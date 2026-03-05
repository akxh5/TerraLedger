// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TerraLedger {

    address public registrar;

    constructor() {
        registrar = msg.sender;
    }

    modifier onlyRegistrar() {
        require(msg.sender == registrar, "Not authorized: Registrar only");
        _;
    }

    struct LandRecord {
        uint256 id;
        string landId;
        string ownerName;
        string location;
        uint256 area;
        address registeredBy;
        address currentOwner; // Added: Current owner of the land
        bool isActive;
        string documentHash; // Added: IPFS CID of land deed document
    }

    uint256 public recordCounter;

    mapping(uint256 => LandRecord) public records;
    mapping(uint256 => address[]) public ownershipHistory; // Added: Immutable ownership history

    struct TransferRequest {
        uint256 landId;
        address from;
        address to;
        bool approved;
    }

    mapping(uint256 => TransferRequest) public transferRequests;

    event LandRegistered(
        uint256 indexed id,
        string landId,
        string ownerName,
        address registeredBy
    );
    event TransferInitiated(uint256 indexed landId, address indexed from, address indexed to);
    event TransferApproved(uint256 indexed landId, address indexed from, address indexed to);
    event OwnershipRecorded(uint256 landId, address newOwner); // Added: Event for ownership changes
    event DocumentAttached(uint256 landId, string documentHash); // Added: Event for document hash changes

    function registerLand(
        string memory _landId,
        string memory _ownerName,
        string memory _location,
        uint256 _area,
        string memory _documentHash // Added: IPFS CID for land deed
    ) public onlyRegistrar {
        recordCounter++;

        records[recordCounter] = LandRecord({
            id: recordCounter,
            landId: _landId,
            ownerName: _ownerName,
            location: _location,
            area: _area,
            registeredBy: msg.sender,
            currentOwner: msg.sender, // Set currentOwner to msg.sender on registration
            isActive: true,
            documentHash: _documentHash // Store document hash
        });

        ownershipHistory[recordCounter].push(msg.sender); // Record initial owner
        emit OwnershipRecorded(recordCounter, msg.sender); // Emit event for initial ownership
        emit DocumentAttached(recordCounter, _documentHash); // Emit event for document attached

        emit LandRegistered(
            recordCounter,
            _landId,
            _ownerName,
            msg.sender
        );
    }

    function getLand(uint256 _id) public view returns (LandRecord memory) {
        return records[_id];
    }

    function deactivateLand(uint256 _id) public {
        require(records[_id].registeredBy == msg.sender, "Not authorized");
        records[_id].isActive = false;
    }

    function transferRegistrar(address newRegistrar) public onlyRegistrar {
        registrar = newRegistrar;
    }

    function initiateTransfer(uint256 _landId, address _to) public {
        require(records[_landId].currentOwner == msg.sender, "Not authorized: Only current owner can initiate transfer");
        require(records[_landId].isActive, "Land record is not active");
        require(_to != address(0), "Recipient address cannot be zero");

        transferRequests[_landId] = TransferRequest({
            landId: _landId,
            from: msg.sender,
            to: _to,
            approved: false
        });
        emit TransferInitiated(_landId, msg.sender, _to);
    }

    function approveTransfer(uint256 _landId) public onlyRegistrar {
        TransferRequest storage request = transferRequests[_landId];
        require(request.from != address(0), "No pending transfer request for this land");
        require(!request.approved, "Transfer already approved");

        request.approved = true;
        records[_landId].currentOwner = request.to;
        ownershipHistory[_landId].push(request.to); // Record new owner
        emit OwnershipRecorded(_landId, request.to); // Emit event for ownership change
        emit TransferApproved(_landId, request.from, request.to);
    }

    function updateDocumentHash(uint256 _landId, string memory _newHash)
        public onlyRegistrar
    {
        records[_landId].documentHash = _newHash;
        emit DocumentAttached(_landId, _newHash);
    }

    function getOwnershipHistory(uint256 _landId)
        public
        view
        returns (address[] memory)
    {
        return ownershipHistory[_landId];
    }
}