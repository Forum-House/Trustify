// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract TrustifyAccessControl is AccessControl, Pausable {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    event IssuerApproved(address indexed issuer, address indexed admin, uint256 timestamp);
    event IssuerRevoked(address indexed issuer, address indexed admin, uint256 timestamp);

    error InvalidAddress();

    constructor(address admin) {
        if (admin == address(0)) revert InvalidAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function approveIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (issuer == address(0)) revert InvalidAddress();
        _grantRole(ISSUER_ROLE, issuer);
        emit IssuerApproved(issuer, msg.sender, block.timestamp);
    }

    function revokeIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (issuer == address(0)) revert InvalidAddress();
        _revokeRole(ISSUER_ROLE, issuer);
        emit IssuerRevoked(issuer, msg.sender, block.timestamp);
    }

    function isIssuer(address account) external view returns (bool) {
        return hasRole(ISSUER_ROLE, account);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
