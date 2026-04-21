package com.terraledger.blockchain;

import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.crypto.Credentials;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TerraLedgerService {

    private final Web3j web3j;
    private final Credentials credentials;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    @Value("${blockchain.abi.path:smart-contract/artifacts/contracts/TerraLedger.sol/TerraLedger.json}")
    private String abiFilePath;

    private final ContractGasProvider gasProvider = new DefaultGasProvider();
    private TransactionManager transactionManager;


    public TerraLedgerService(Web3j web3j, Credentials credentials) {
        this.web3j = web3j;
        this.credentials = credentials;
    }

    @PostConstruct
    public void init() throws Exception {
        this.transactionManager = new RawTransactionManager(web3j, credentials);
        // Contract loading logic is no longer needed here as methods will directly use ABI and address
    }

    // This data class will represent the LandRecord struct from the Solidity contract
    // We define it as a DynamicStruct so Web3j can map the return types.
    public static class LandRecord extends DynamicStruct {
        public BigInteger id;
        public String landId;
        public String ownerName;
        public String location;
        public BigInteger area;
        public String registeredBy;
        public String currentOwner;
        public Boolean isActive;
        public String documentHash;

        public LandRecord(Uint256 id, Utf8String landId, Utf8String ownerName, Utf8String location, Uint256 area, Address registeredBy, Address currentOwner, Bool isActive, Utf8String documentHash) {
            super(id, landId, ownerName, location, area, registeredBy, currentOwner, isActive, documentHash);
            this.id = id.getValue();
            this.landId = landId.getValue();
            this.ownerName = ownerName.getValue();
            this.location = location.getValue();
            this.area = area.getValue();
            this.registeredBy = registeredBy.getValue();
            this.currentOwner = currentOwner.getValue();
            this.isActive = isActive.getValue();
            this.documentHash = documentHash.getValue();
        }
    }

    // Helper to get ABI (moved from loadContract)
    private String getAbi() throws IOException {
        String abiJson = new String(Files.readAllBytes(Paths.get(abiFilePath)));
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(abiJson);
        return mapper.writeValueAsString(rootNode.get("abi"));
    }

    // Implemented methods directly in the service

    public RemoteCall<TransactionReceipt> registerLand(String landId, String ownerName, String location, BigInteger area, String documentHash) throws IOException {
        Function function = new Function(
            "registerLand",
            Arrays.asList(new Utf8String(landId), new Utf8String(ownerName), new Utf8String(location), new Uint256(area), new Utf8String(documentHash)),
            Collections.emptyList());
        return executeTransaction(function);
    }

    public RemoteCall<LandRecord> getLand(BigInteger id) throws IOException {
        Function function = new Function(
            "getLand",
            Arrays.asList(new Uint256(id)),
            Arrays.asList(new TypeReference<TerraLedgerService.LandRecord>() {}));
        
        return new RemoteCall<>(() -> {
            EthCall ethCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                        credentials.getAddress(), contractAddress, FunctionEncoder.encode(function)),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST)
                    .send();
                
            if (ethCall.hasError()) {
                throw new RuntimeException("EthCall Error: " + ethCall.getError().getMessage());
            }

            List<org.web3j.abi.datatypes.Type> results = FunctionReturnDecoder.decode(ethCall.getValue(), function.getOutputParameters());
            if (!results.isEmpty()) {
                DynamicStruct struct = (DynamicStruct) results.get(0);
                // Corrected access to struct members
                return new LandRecord(
                    (Uint256) struct.getValue().get(0),
                    (Utf8String) struct.getValue().get(1),
                    (Utf8String) struct.getValue().get(2),
                    (Utf8String) struct.getValue().get(3),
                    (Uint256) struct.getValue().get(4),
                    (Address) struct.getValue().get(5),
                    (Address) struct.getValue().get(6),
                    (Bool) struct.getValue().get(7),
                    (Utf8String) struct.getValue().get(8)
                );
            }
            return null;
        });
    }

    public RemoteCall<TransactionReceipt> initiateTransfer(BigInteger landId, String to) throws IOException {
        Function function = new Function(
            "initiateTransfer",
            Arrays.asList(new Uint256(landId), new Address(to)),
            Collections.emptyList());
        return executeTransaction(function);
    }

    public RemoteCall<TransactionReceipt> approveTransfer(BigInteger landId) throws IOException {
        Function function = new Function(
            "approveTransfer",
            Arrays.asList(new Uint256(landId)),
            Collections.emptyList());
        return executeTransaction(function);
    }

    public RemoteCall<List<String>> getOwnershipHistory(BigInteger landId) throws IOException {
        Function function = new Function(
            "getOwnershipHistory",
            Arrays.asList(new Uint256(landId)),
            Arrays.asList(new TypeReference<DynamicArray<Address>>() {})); // Corrected TypeReference for DynamicArray

        return new RemoteCall<>(() -> {
            EthCall ethCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                        credentials.getAddress(), contractAddress, FunctionEncoder.encode(function)),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST)
                    .send();
                
            if (ethCall.hasError()) {
                throw new RuntimeException("EthCall Error: " + ethCall.getError().getMessage());
            }

            List<org.web3j.abi.datatypes.Type> results = FunctionReturnDecoder.decode(ethCall.getValue(), function.getOutputParameters());
            if (!results.isEmpty()) {
                @SuppressWarnings("unchecked")
                DynamicArray<Address> dynamicAddresses = (DynamicArray<Address>) results.get(0);
                return dynamicAddresses.getValue().stream().map(Address::getValue).collect(Collectors.toList());
            }
            return Collections.emptyList();
        });
    }

    private RemoteCall<TransactionReceipt> executeTransaction(Function function) {
        return new RemoteCall<>(() -> {
            // Corrected getGasPrice/getGasLimit calls (no functionName parameter)
            BigInteger gasPrice = gasProvider.getGasPrice();
            BigInteger gasLimit = gasProvider.getGasLimit();
            
            String encodedFunction = FunctionEncoder.encode(function);
            
            org.web3j.protocol.core.methods.response.EthSendTransaction ethSendTransaction = transactionManager.sendTransaction(
                gasPrice, gasLimit, contractAddress, encodedFunction, BigInteger.ZERO);

            if (ethSendTransaction.hasError()) {
                throw new RuntimeException("Transaction send error: " + ethSendTransaction.getError().getMessage());
            }

            String transactionHash = ethSendTransaction.getTransactionHash();
            TransactionReceipt receipt = web3j.ethGetTransactionReceipt(transactionHash).send().getTransactionReceipt()
                                        .orElseThrow(() -> new RuntimeException("Transaction receipt not generated for hash: " + transactionHash));
            
            if (!receipt.isStatusOK()) {
                throw new RuntimeException("Transaction failed: " + receipt.getStatus() + " for hash: " + transactionHash);
            }
            return receipt;
        });
    }
}
