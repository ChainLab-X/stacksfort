;; Multi-signature vault contract
;; Implements a multisig wallet for managing STX and SIP-010 tokens

(use-trait sip-010-trait-ft-standard 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard)

;; ============================================
;; Constants
;; ============================================
(define-constant CONTRACT_OWNER 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant MAX_SIGNERS u100)
(define-constant MIN_SIGNATURES_REQUIRED u1)

