const { execSync } = require('child_process');

async function runTests() {
    const API_BASE = 'http://localhost:8080/api';
    let passed = true;
    let errors = [];

    const report = (step, result, expected = '', info = '') => {
        if (result) {
            console.log(`\x1b[32m[PASS]\x1b[0m ${step} ${expected ? '(' + expected + ')' : ''} ${info ? '- ' + info : ''}`);
        } else {
            console.log(`\x1b[31m[FAIL]\x1b[0m ${step} ${expected ? '(' + expected + ')' : ''} ${info ? '- ' + info : ''}`);
            passed = false;
        }
    };

    try {
        console.log("Starting TerraLedger PROTV2 Hardened E2E Validation...\n");

        // 1. Base Authentication
        let ownerJwt = null;
        let registrarJwt = null;

        // Login OWNER
        let ownerRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "citizen@test.com", password: "password", role: "OWNER" })
        });
        let ownerJson = await ownerRes.json();
        ownerJwt = ownerJson.token;
        if (!ownerJwt) {
            ownerRes = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "citizen@test.com", password: "password" })
            });
            ownerJson = await ownerRes.json();
            ownerJwt = ownerJson.token;
        }

        // Login REGISTRAR
        let adminRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "admin@terraledger.gov", password: "admin123", role: "REGISTRAR" })
        });
        let adminJson = await adminRes.json();
        registrarJwt = adminJson.token;
        if (!registrarJwt) {
            adminRes = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "admin@terraledger.gov", password: "admin123" })
            });
            adminJson = await adminRes.json();
            registrarJwt = adminJson.token;
        }
        report('Step 1: Base Authentication', !!ownerJwt && !!registrarJwt, '', 'Tokens extracted');

        // 2. Valid Request Submission
        const reqRes = await fetch(`${API_BASE}/lands/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerJwt}` },
            body: JSON.stringify({ location: "Edge Case Address", area: 1500, documentHash: "QmHashData", citizenId: "ID-999" })
        });
        const reqJson = await reqRes.json();
        const reqSuccess = reqJson.status === 'success';

        let reqUuid = null;
        if (reqSuccess) {
            const myRequestsRes = await fetch(`${API_BASE}/lands/my-requests`, {
                headers: { 'Authorization': `Bearer ${ownerJwt}` }
            });
            const myRequests = await myRequestsRes.json();
            const latest = myRequests.find(r => r.location === "Edge Case Address");
            if (latest) reqUuid = latest.id;
        }
        report('Step 2: Valid Request Submission', !!reqUuid, '200 OK', `UUID: ${reqUuid}`);

        // 3. Invalid Input Rejection (400)
        // Submitting bad payload
        const badReqRes = await fetch(`${API_BASE}/lands/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerJwt}` },
            body: "BAD JSON"
        });
        report('Step 3: Invalid Input Rejection', badReqRes.status === 400 || badReqRes.status === 500, '400/500', `Received ${badReqRes.status}`);

        // 4. Unauthorized Access
        // Owner trying to hit /approve
        const unauthRes = await fetch(`${API_BASE}/lands/approve/${reqUuid}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${ownerJwt}` }
        });
        report('Step 4: Unauthorized Access', unauthRes.status === 403, '403 Forbidden', `Received ${unauthRes.status}`);

        // 5. Invalid UUID lookup (expect 404)
        const fakeUUID = '00000000-0000-0000-0000-000000000000';
        const notFoundRes = await fetch(`${API_BASE}/lands/approve/${fakeUUID}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${registrarJwt}` }
        });
        report('Step 5: Invalid UUID lookup', notFoundRes.status === 404, '404 Not Found', `Received ${notFoundRes.status}`);

        // 6. Golden Path Approval (expect 200 + TxHash)
        let goldenSuccess = false;
        let txHash = null;
        const approveRes = await fetch(`${API_BASE}/lands/approve/${reqUuid}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${registrarJwt}` }
        });
        if (approveRes.status === 200) {
            const approveJson = await approveRes.json();
            if (approveJson.transactionHash && approveJson.transactionHash.startsWith('0x')) {
                txHash = approveJson.transactionHash;
                goldenSuccess = true;
            }
        } else {
            const errJson = await approveRes.text();
            console.log("Approval error response:", errJson);
        }
        report('Step 6: Golden Path Approval', goldenSuccess, '200 OK', txHash ? `txHash: ${txHash}` : 'Failed');

        // 7. Duplicate Approval (expect 400 from idempotency check)
        const dupRes = await fetch(`${API_BASE}/lands/approve/${reqUuid}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${registrarJwt}` }
        });
        report('Step 7: Duplicate Approval', dupRes.status === 400, '400 Bad Request', `Received ${dupRes.status} (Idempotency trigger)`);

        console.log('\n========= EXECUTION COMPLETE =========');
        if (passed) {
            console.log('\x1b[32mALL EDGE CASE TESTS PASSED SUCCESSFULLY.\x1b[0m');
            process.exit(0);
        } else {
            console.log('\x1b[31mSOME TESTS FAILED.\x1b[0m');
            errors.forEach(e => console.log('\x1b[31mError: \x1b[0m' + e));
            process.exit(1);
        }

    } catch (err) {
        console.error("Critical Failure: ", err);
        process.exit(1);
    }
}

runTests();
