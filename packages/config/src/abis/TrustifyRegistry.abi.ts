export const TrustifyRegistryAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "accessControlAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DocumentAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DocumentNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EnforcedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExpectedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "enum TrustifyRegistry.DocumentStatus",
        "name": "current",
        "type": "uint8"
      }
    ],
    "name": "InvalidDocumentStatus",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidHash",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTimestampRange",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "IssuerMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Unauthorized",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "cid",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "holderId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "documentType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum TrustifyRegistry.Sector",
        "name": "sector",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "issuedAt",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "expiresAt",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "registeredAt",
        "type": "uint64"
      }
    ],
    "name": "DocumentRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "revokedAt",
        "type": "uint64"
      }
    ],
    "name": "DocumentRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "oldHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "DocumentSuperseded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "accessControl",
    "outputs": [
      {
        "internalType": "contract ITrustifyAccessControl",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allDocumentHashes",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllDocumentHashes",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "getDocument",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "cid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "holderName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "holderId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "documentType",
            "type": "string"
          },
          {
            "internalType": "enum TrustifyRegistry.Sector",
            "name": "sector",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "issuedAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "expiresAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "registeredAt",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "revokedAt",
            "type": "uint64"
          },
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "enum TrustifyRegistry.DocumentStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "supersededByHash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "revokeReason",
            "type": "string"
          }
        ],
        "internalType": "struct TrustifyRegistry.DocumentRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "getIssuerDocuments",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "cid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "holderName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "holderId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "documentType",
        "type": "string"
      },
      {
        "internalType": "enum TrustifyRegistry.Sector",
        "name": "sector",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "issuedAt",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "expiresAt",
        "type": "uint64"
      }
    ],
    "name": "registerDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "revokeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "oldHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "newHash",
        "type": "bytes32"
      }
    ],
    "name": "supersedeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDocuments",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "valid",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "revoked",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "expired",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "superseded",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
              },
              {
                "internalType": "string",
                "name": "cid",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "holderName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "holderId",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "documentType",
                "type": "string"
              },
              {
                "internalType": "enum TrustifyRegistry.Sector",
                "name": "sector",
                "type": "uint8"
              },
              {
                "internalType": "uint64",
                "name": "issuedAt",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "expiresAt",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "registeredAt",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "revokedAt",
                "type": "uint64"
              },
              {
                "internalType": "address",
                "name": "issuer",
                "type": "address"
              },
              {
                "internalType": "enum TrustifyRegistry.DocumentStatus",
                "name": "status",
                "type": "uint8"
              },
              {
                "internalType": "bytes32",
                "name": "supersededByHash",
                "type": "bytes32"
              },
              {
                "internalType": "string",
                "name": "revokeReason",
                "type": "string"
              }
            ],
            "internalType": "struct TrustifyRegistry.DocumentRecord",
            "name": "record",
            "type": "tuple"
          }
        ],
        "internalType": "struct TrustifyRegistry.VerificationResult",
        "name": "result",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
