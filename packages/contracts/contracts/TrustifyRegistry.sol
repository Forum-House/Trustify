// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITrustifyAccessControl {
    function isIssuer(address account) external view returns (bool);
    function isAdmin(address account) external view returns (bool);
    function paused() external view returns (bool);
}

contract TrustifyRegistry is Pausable, ReentrancyGuard {
    enum DocumentStatus {
        NotFound,
        Active,
        Revoked,
        Superseded
    }

    enum Sector {
        Education,
        Healthcare,
        Legal,
        Government,
        Corporate
    }

    struct DocumentRecord {
        bytes32 hash;
        string cid;
        string holderName;
        string holderId;
        string documentType;
        Sector sector;
        uint64 issuedAt;
        uint64 expiresAt;
        uint64 registeredAt;
        uint64 revokedAt;
        address issuer;
        DocumentStatus status;
        bytes32 supersededByHash;
        string revokeReason;
    }

    struct VerificationResult {
        bool exists;
        bool valid;
        bool revoked;
        bool expired;
        bool superseded;
        DocumentRecord record;
    }

    ITrustifyAccessControl public immutable accessControl;

    mapping(bytes32 => DocumentRecord) private documents;
    mapping(address => bytes32[]) private issuerDocuments;
    bytes32[] public allDocumentHashes;
    uint256 public totalDocuments;

    event DocumentRegistered(
        bytes32 indexed hash,
        address indexed issuer,
        string cid,
        string holderId,
        string documentType,
        Sector sector,
        uint64 issuedAt,
        uint64 expiresAt,
        uint64 registeredAt
    );

    event DocumentRevoked(
        bytes32 indexed hash,
        address indexed issuer,
        string reason,
        uint64 revokedAt
    );

    event DocumentSuperseded(
        bytes32 indexed oldHash,
        bytes32 indexed newHash,
        address indexed issuer,
        uint64 timestamp
    );

    error Unauthorized();
    error InvalidAddress();
    error InvalidHash();
    error InvalidTimestampRange();
    error DocumentAlreadyExists();
    error DocumentNotFound();
    error InvalidDocumentStatus(DocumentStatus current);
    error IssuerMismatch();

    constructor(address accessControlAddress) {
        if (accessControlAddress == address(0)) revert InvalidAddress();
        accessControl = ITrustifyAccessControl(accessControlAddress);
    }

    modifier onlyAdmin() {
        if (!accessControl.isAdmin(msg.sender)) revert Unauthorized();
        _;
    }

    modifier onlyIssuer() {
        if (!accessControl.isIssuer(msg.sender)) revert Unauthorized();
        _;
    }

    modifier whenSystemActive() {
        if (accessControl.paused() || paused()) revert EnforcedPause();
        _;
    }

    function registerDocument(
        bytes32 hash,
        string calldata cid,
        string calldata holderName,
        string calldata holderId,
        string calldata documentType,
        Sector sector,
        uint64 issuedAt,
        uint64 expiresAt
    ) external onlyIssuer whenSystemActive nonReentrant {
        if (hash == bytes32(0)) revert InvalidHash();
        if (documents[hash].status != DocumentStatus.NotFound) revert DocumentAlreadyExists();
        if (expiresAt != 0 && expiresAt <= issuedAt) revert InvalidTimestampRange();

        DocumentRecord memory record = DocumentRecord({
            hash: hash,
            cid: cid,
            holderName: holderName,
            holderId: holderId,
            documentType: documentType,
            sector: sector,
            issuedAt: issuedAt,
            expiresAt: expiresAt,
            registeredAt: uint64(block.timestamp),
            revokedAt: 0,
            issuer: msg.sender,
            status: DocumentStatus.Active,
            supersededByHash: bytes32(0),
            revokeReason: ""
        });

        documents[hash] = record;
        issuerDocuments[msg.sender].push(hash);
        allDocumentHashes.push(hash);
        totalDocuments += 1;

        emit DocumentRegistered(
            hash,
            msg.sender,
            cid,
            holderId,
            documentType,
            sector,
            issuedAt,
            expiresAt,
            uint64(block.timestamp)
        );
    }

    function revokeDocument(bytes32 hash, string calldata reason)
        external
        whenSystemActive
        nonReentrant
    {
        DocumentRecord storage record = documents[hash];
        if (record.status == DocumentStatus.NotFound) revert DocumentNotFound();
        
        bool isAdmin = accessControl.isAdmin(msg.sender);
        bool isOriginalIssuer = record.issuer == msg.sender;
        
        if (!isAdmin && !isOriginalIssuer) revert Unauthorized();
        if (record.status != DocumentStatus.Active) revert InvalidDocumentStatus(record.status);

        record.status = DocumentStatus.Revoked;
        record.revokedAt = uint64(block.timestamp);
        record.revokeReason = reason;

        emit DocumentRevoked(hash, msg.sender, reason, uint64(block.timestamp));
    }

    function supersedeDocument(bytes32 oldHash, bytes32 newHash)
        external
        onlyIssuer
        whenSystemActive
        nonReentrant
    {
        if (newHash == bytes32(0)) revert InvalidHash();
        if (documents[newHash].status != DocumentStatus.NotFound) revert DocumentAlreadyExists();

        DocumentRecord storage oldRecord = documents[oldHash];
        if (oldRecord.status == DocumentStatus.NotFound) revert DocumentNotFound();
        if (oldRecord.issuer != msg.sender) revert IssuerMismatch();
        if (oldRecord.status != DocumentStatus.Active) revert InvalidDocumentStatus(oldRecord.status);

        oldRecord.status = DocumentStatus.Superseded;
        oldRecord.supersededByHash = newHash;

        DocumentRecord memory newRecord = DocumentRecord({
            hash: newHash,
            cid: oldRecord.cid,
            holderName: oldRecord.holderName,
            holderId: oldRecord.holderId,
            documentType: oldRecord.documentType,
            sector: oldRecord.sector,
            issuedAt: oldRecord.issuedAt,
            expiresAt: oldRecord.expiresAt,
            registeredAt: uint64(block.timestamp),
            revokedAt: 0,
            issuer: msg.sender,
            status: DocumentStatus.Active,
            supersededByHash: bytes32(0),
            revokeReason: ""
        });

        documents[newHash] = newRecord;
        issuerDocuments[msg.sender].push(newHash);
        totalDocuments += 1;

        emit DocumentSuperseded(oldHash, newHash, msg.sender, uint64(block.timestamp));
    }

    function verifyDocument(bytes32 hash) external view returns (VerificationResult memory result) {
        DocumentRecord memory record = documents[hash];
        if (record.status == DocumentStatus.NotFound) {
            return VerificationResult({
                exists: false,
                valid: false,
                revoked: false,
                expired: false,
                superseded: false,
                record: record
            });
        }

        bool isExpired = record.expiresAt != 0 && block.timestamp > record.expiresAt;
        bool isRevoked = record.status == DocumentStatus.Revoked;
        bool isSuperseded = record.status == DocumentStatus.Superseded;
        bool isValid = !isExpired && !isRevoked && !isSuperseded;

        return VerificationResult({
            exists: true,
            valid: isValid,
            revoked: isRevoked,
            expired: isExpired,
            superseded: isSuperseded,
            record: record
        });
    }

    function getDocument(bytes32 hash) external view returns (DocumentRecord memory) {
        DocumentRecord memory record = documents[hash];
        if (record.status == DocumentStatus.NotFound) revert DocumentNotFound();
        return record;
    }

    function getIssuerDocuments(address issuer) external view returns (bytes32[] memory) {
        return issuerDocuments[issuer];
    }

    function getAllDocumentHashes() external view returns (bytes32[] memory) {
        return allDocumentHashes;
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }
}
