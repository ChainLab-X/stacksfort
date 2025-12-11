;; Multi-signature vault contract
;; Implements a multisig wallet for managing STX and SIP-010 tokens

(use-trait sip-010-trait-ft-standard 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard)

;; ============================================
;; Constants
;; ============================================
(define-constant CONTRACT_OWNER 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant MAX_SIGNERS u100)
(define-constant MIN_SIGNATURES_REQUIRED u1)

;; ============================================
;; Error Constants
;; ============================================
(define-constant ERR_OWNER_ONLY (err u1))
(define-constant ERR_ALREADY_INITIALIZED (err u2))
(define-constant ERR_TOO_MANY_SIGNERS (err u3))
(define-constant ERR_INVALID_THRESHOLD (err u4))
(define-constant ERR_NOT_INITIALIZED (err u5))
(define-constant ERR_NOT_SIGNER (err u6))
(define-constant ERR_INVALID_AMOUNT (err u7))
(define-constant ERR_INVALID_TXN_TYPE (err u8))
(define-constant ERR_INVALID_TXN_ID (err u9))
(define-constant ERR_TXN_ALREADY_EXECUTED (err u10))
(define-constant ERR_INSUFFICIENT_SIGNATURES (err u11))
(define-constant ERR_INVALID_SIGNATURE (err u12))
(define-constant ERR_INVALID_TOKEN (err u13))

