# Stacks Multisig Vaults Guide

Welcome to the official documentation for Stacks Multisig Vaults!

## User Documentation

### 1. How to create a Multisig Vault
Currently, vaults are created using Stacks CLI or contract deployments natively on Stacks. You define the signers array and the threshold upon initialization of the `deadman-vault` contract.
* **Initialize contract:** Calls `initialize(signers, threshold)`. 
* **Requirement:** Must be deployed onto the network by the contract owner.

### 2. How to submit transactions
Any authorized signer in the Multisig vault can submit a transaction proposal:
- Connect your wallet to the Stacks Multisig Vault frontend.
- Enter your Multisig contract address.
- Click **Create Transaction** in the Dashboard.
- Provide the asset type (STX or SIP-010 Token), Amount, and Recipient's address.
- Confirm submission in your wallet.

### 3. How to sign transactions
- Visit the Dashboard and check the "Pending Transactions" list.
- Click **View Details** on a transaction.
- Review the transaction parameters safely.
- Click **Sign Transaction** to generate off-chain signatures via your connected wallet. 
- Signatures are automatically stored and mapped to your public key.

### 4. How to execute transactions
- Once enough signers have signed (reaching the predefined `threshold`), the **Execute** button becomes active.
- Any signer can trigger the execution.
- Click **Execute Transaction** and sign the final broadcast to the Stacks blockchain.
- The assets move from the vault to the recipient.

---

## Developer Documentation

### Architecture Overview
The system consists of two primary components:
1. **Clarity Smart Contract**: A threshold-based multisig vault utilizing Clarity 4 features for asset safety (`restrict-assets!`, `contract-hash!`). Transactions are stored in a map and executed off-chain via ECDSA signature recovery (`secp256k1-recover?`).
2. **Next.js Frontend**: A modern UI for interacting with vaults, extracting data from the blockchain and caching off-chain signatures via `useMultisig` hook logic and API routes (`app/api/transactions`).

### Contract API Highlights
- `submit-txn`: Add a new transaction tuple to the map.
- `execute-stx-transfer-txn`: Execute a STX transfer if `threshold` is verified.
- `execute-token-transfer-txn`: Execute an SIP-010 token transfer.

### Frontend Component Highlights
- **`MultisigDashboard`**: Parses `state.threshold` and `state.signers` directly from the Stacks node. 
- **`TransactionList`**: Shows paginated lists spanning active, executed, and archived transactions.
- **`CreateTransaction`**: Interfaces with `@stacks/connect` and `@stacks/transactions` for broadcast.
- **`stx-utils.ts`**: Helper utilities for shortening Stacks constants and converting values (e.g. `formatStxAmount`).

### Contribution Guidelines
1. Fork the repository and create a descriptive feature branch (`feat/new-thing`).
2. Adhere to modular, well-scoped commits. 
3. Verify test validity using `npm run test` or `vitest run` before publishing a pull request.
4. Open a PR referencing any active issues in `issues.md`.
