// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrustifyAccessControl
 * @notice Manages role-based access for the Trustify registry with on-chain issuer metadata.
 * @dev Uses AccessControlDefaultAdminRules for enhanced admin security (3-day delay for transfers).
 *      Includes mappings for issuer metadata as per PRD Section 4.5.1.
 */
contract TrustifyAccessControl is AccessControlDefaultAdminRules, Pausable {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Metadata stored off the role-check path for UI display (PRD 4.5.1)
    address[] public allIssuers;
    mapping(address => string) public issuerName;
    mapping(address => string) public issuerSector;
    mapping(address => uint256) public issuerApprovedAt;
    mapping(address => bool) private _isIssuerListed;

    event IssuerApproved(
        address indexed issuer, 
        address indexed admin, 
        string name, 
        string sector, 
        uint256 timestamp
    );
    
    event IssuerRevoked(
        address indexed issuer, 
        address indexed admin, 
        uint256 timestamp
    );

    error InvalidAddress();

    constructor(address initialAdmin) 
        AccessControlDefaultAdminRules(3 days, initialAdmin) 
    {
        if (initialAdmin == address(0)) revert InvalidAddress();
        _grantRole(PAUSER_ROLE, initialAdmin);
    }

    /**
     * @notice Approve an address as a trusted issuer with metadata.
     * @param issuer The address to grant the ISSUER_ROLE.
     * @param name The organization name (e.g., "Stanford University").
     * @param sector The primary sector (e.g., "Education").
     */
    function approveIssuer(
        address issuer,
        string calldata name,
        string calldata sector
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (issuer == address(0)) revert InvalidAddress();
        
        _grantRole(ISSUER_ROLE, issuer);
        
        if (!_isIssuerListed[issuer]) {
            allIssuers.push(issuer);
            _isIssuerListed[issuer] = true;
        }
        
        issuerName[issuer] = name;
        issuerSector[issuer] = sector;
        issuerApprovedAt[issuer] = block.timestamp;
        
        emit IssuerApproved(issuer, msg.sender, name, sector, block.timestamp);
    }

    /**
     * @notice Revoke an issuer's ability to register documents.
     */
    function revokeIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (issuer == address(0)) revert InvalidAddress();
        
        _revokeRole(ISSUER_ROLE, issuer);
        
        // We keep the metadata for provenance but mark as revoked via events
        emit IssuerRevoked(issuer, msg.sender, block.timestamp);
    }

    function isIssuer(address account) external view returns (bool) {
        return hasRole(ISSUER_ROLE, account);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function getAllIssuers() external view returns (address[] memory) {
        return allIssuers;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
