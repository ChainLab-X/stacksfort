import { hashTransaction, getNextTxnId } from "./multisig-contract";
import { signMessageHashRsv } from "@stacks/transactions";

export type TransactionStatus = "pending" | "signed" | "ready-to-execute" | "executed" | "cancelled";

export interface SignatureData {
  signer: string;
  signature: string;
  timestamp: number;
}

export interface TransactionWithSignatures {
  id: number;
  hash: string;
  signatures: SignatureData[];
  status: TransactionStatus;
}

export async function calculateTransactionHash(
  txId: number,
  senderAddress: string,
  contractAddress: string,
  contractName: string
): Promise<string | null> {
  return hashTransaction(txId, senderAddress, contractAddress, contractName);
}

export function generateOffChainSignature(
  messageHash: string,
  privateKey: string
): string {
  return signMessageHashRsv({
    messageHash,
    privateKey,
  }).data;
}

export function validateSignatureFormat(signature: string): boolean {
  const signatureRegex = /^[0-9a-fA-F]{130}$/;
  return signatureRegex.test(signature);
}

export function extractSignerFromSignature(
  messageHash: string,
  signature: string
): string | null {
  try {
    if (!validateSignatureFormat(signature)) {
      return null;
    }
    return messageHash;
  } catch (error) {
    console.error("Error extracting signer:", error);
    return null;
  }
}

export function getTransactionStatus(
  executed: boolean,
  cancelled: boolean,
  signatureCount: number,
  threshold: number
): TransactionStatus {
  if (executed) return "executed";
  if (cancelled) return "cancelled";
  if (signatureCount >= threshold) return "ready-to-execute";
  if (signatureCount > 0) return "signed";
  return "pending";
}

export function formatTransactionType(type: "stx" | "token"): string {
  return type === "stx" ? "STX Transfer" : "Token Transfer";
}

export function formatAmount(amount: string, type: "stx" | "token"): string {
  const microUnits = BigInt(amount);
  if (type === "stx") {
    const stx = microUnits / BigInt(1_000_000);
    return `${stx.toLocaleString()} STX`;
  }
  return microUnits.toLocaleString();
}

export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function aggregateSignatures(
  signatures: SignatureData[]
): string[] {
  return signatures.map((s) => s.signature);
}

export function checkThresholdMet(
  signatureCount: number,
  threshold: number
): boolean {
  return signatureCount >= threshold;
}

export function hasSignerSigned(
  signatures: SignatureData[],
  signerAddress: string
): boolean {
  return signatures.some((s) => s.signer === signerAddress);
}

export function getUniqueSigners(signatures: SignatureData[]): string[] {
  const signerSet = new Set(signatures.map((s) => s.signer));
  return Array.from(signerSet);
}

export function sortSignaturesByTimestamp(
  signatures: SignatureData[],
  order: "asc" | "desc" = "desc"
): SignatureData[] {
  return [...signatures].sort((a, b) => {
    const diff = a.timestamp - b.timestamp;
    return order === "asc" ? diff : -diff;
  });
}