// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ChamaCore.sol";

/**
 * @title ChamaFactory
 * @dev Creates and manages ChamaCore instances (Groups).
 * Acts as a Router/Facade for the frontend which interacts with a single address.
 */
contract ChamaFactory {
    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    address public kernel;
    mapping(string => address) public groups; // groupId => ChamaCore address
    string[] public groupIds;

    event GroupCreated(string groupId, address indexed groupAddress, string name);

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor(address _kernel) {
        kernel = _kernel;
    }

    // ============================================================================
    // FUNCTIONS
    // ============================================================================

    function createGroup(
        string memory _name,
        string memory _description,
        uint256 _contributionAmount,
        uint256 _payoutCycle
    ) external returns (string memory) {
        // Generate a pseudo-random ID (simple counter for now)
        string memory groupId = _uint2str(groupIds.length + 1);
        
        ChamaCore newGroup = new ChamaCore(
            _name,
            _description,
            _contributionAmount,
            _payoutCycle,
            kernel
        );

        groups[groupId] = address(newGroup);
        groupIds.push(groupId);

        emit GroupCreated(groupId, address(newGroup), _name);
        return groupId;
    }

    // ============================================================================
    // FACADE / ROUTER FUNCTIONS
    // ============================================================================

    function getGroup(string memory groupId) external view returns (
        string memory id,
        string memory name,
        string memory description,
        uint256 totalMembers,
        uint256 treasuryBalance,
        uint256 contributionAmount,
        uint256 payoutCycle,
        uint256 createdAt,
        address contractAddress
    ) {
        require(groups[groupId] != address(0), "Group not found");
        ChamaCore core = ChamaCore(groups[groupId]);
        
        (
            string memory _name,
            string memory _desc,
            uint256 _members,
            uint256 _balance,
            uint256 _contrib,
            
        ) = core.getGroupDetails();

        return (
            groupId,
            _name,
            _desc,
            _members,
            _balance,
            _contrib,
            core.payoutCycle(),
            0, // createdAt mock
            address(core)
        );
    }

    function addMember(string memory groupId, address memberAddress, string memory memberName) external {
        require(groups[groupId] != address(0), "Group not found");
        ChamaCore(groups[groupId]).addMember(memberAddress, memberName);
    }

    // amount arg ignored, using msg.value to be safe? 
    // Contract implementation says `require(msg.value == contributionAmount)`
    function contribute(string memory groupId, uint256 amount) external payable {
        require(groups[groupId] != address(0), "Group not found");
        ChamaCore core = ChamaCore(groups[groupId]);
        core.contribute{value: msg.value}();
    }
    
    function getMembers(string memory groupId) external view returns (ChamaCore.Member[] memory) {
         require(groups[groupId] != address(0), "Group not found");
         return ChamaCore(groups[groupId]).getAllMembers();
    }
    
    // ============================================================================
    // HELPERS
    // ============================================================================

    function _uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
