import {
  callReadOnlyFunction,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungiblePostCondition,
  FungibleConditionCode,
  createAssetInfo,
  uintCV,
  principalCV,
  listCV,
  bufferCV,
  someCV,
  noneCV,
  cvToValue,
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import { DEPLOYER, MULTISIG_CONTRACT_NAME, TOKEN_CONTRACT_NAME } from "./constants";

const network = new StacksMainnet();

export interface MultisigContract {
  contractAddress: string;
  contractName: string;
}

export interface TransactionData {
  id: number;
  type: "stx" | "token";
  amount: string;
  recipient: string;
  tokenContract?: string;
  executed: boolean;
  cancelled: boolean;
  expiration: number;
}

export interface SignerData {
  address: string;
  hasSigned: boolean;
}

export async function getContractId(
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<string> {
  return `${contractAddress}.${contractName}`;
}

export async function isInitialized(
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "is-initialized",
      functionArgs: [],
      senderAddress,
      network,
    });
    return cvToValue(result).value;
  } catch (error) {
    console.error("Error checking initialization:", error);
    return false;
  }
}

export async function getThreshold(
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-threshold",
      functionArgs: [],
      senderAddress,
      network,
    });
    return Number(cvToValue(result).value);
  } catch (error) {
    console.error("Error getting threshold:", error);
    return 0;
  }
}

export async function getSigners(
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<string[]> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-signers",
      functionArgs: [],
      senderAddress,
      network,
    });
    return cvToValue(result).map((s: { value: string }) => s.value);
  } catch (error) {
    console.error("Error getting signers:", error);
    return [];
  }
}

export async function getTransaction(
  txId: number,
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<TransactionData | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-transaction",
      functionArgs: [uintCV(txId)],
      senderAddress,
      network,
    });
    const data = cvToValue(result).value;
    return {
      id: txId,
      type: data["txn-type"].value === 0 ? "stx" : "token",
      amount: data["amount"].value,
      recipient: data["recipient"].value,
      tokenContract: data["token"]?.value,
      executed: data["executed"].value,
      cancelled: data["cancelled"].value,
      expiration: Number(data["expiration"].value),
    };
  } catch (error) {
    console.error("Error getting transaction:", error);
    return null;
  }
}

export async function getNextTxnId(
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-next-txn-id",
      functionArgs: [],
      senderAddress,
      network,
    });
    return Number(cvToValue(result).value);
  } catch (error) {
    console.error("Error getting next transaction ID:", error);
    return 0;
  }
}

export async function hashTransaction(
  txId: number,
  senderAddress: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
): Promise<string | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "hash-txn",
      functionArgs: [uintCV(txId)],
      senderAddress,
      network,
    });
    return cvToValue(result).value;
  } catch (error) {
    console.error("Error hashing transaction:", error);
    return null;
  }
}

export function createInitializeCall(
  signers: string[],
  threshold: number,
  senderKey: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
) {
  return makeContractCall({
    contractAddress,
    contractName,
    functionName: "initialize",
    functionArgs: [
      listCV(signers.map((s) => principalCV(s))),
      uintCV(threshold),
    ],
    senderKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  });
}

export function createSubmitTxnCall(
  txnType: number,
  amount: string,
  recipient: string,
  tokenContract: string | null,
  senderKey: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
) {
  return makeContractCall({
    contractAddress,
    contractName,
    functionName: "submit-txn",
    functionArgs: [
      uintCV(txnType),
      uintCV(amount),
      principalCV(recipient),
      tokenContract ? someCV(principalCV(tokenContract)) : noneCV(),
    ],
    senderKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  });
}

export function createStxPostCondition(
  amount: string,
  recipient: string,
  contractAddress: string = DEPLOYER,
  contractName: string = MULTISIG_CONTRACT_NAME
) {
  return new FungiblePostCondition(
    contractAddress,
    contractName,
    createAssetInfo(contractAddress, contractName, "stx"),
    FungibleConditionCode.Equal,
    BigInt(amount)
  );
}

export async function broadcastTx(tx: any) {
  return broadcastTransaction(tx, network);
}