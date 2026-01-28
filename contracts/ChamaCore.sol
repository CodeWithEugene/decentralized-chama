// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ChamaCore
 * @dev The Vault - Holds funds and manages the "truth" of the group.
 * Managed by the ChamaKernel (The Brain).
 */
contract ChamaCore {
    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    // Group Configuration
    string public name;
    string public description;
    uint256 public contributionAmount;
    uint256 public payoutCycle; // in seconds
    address public kernel; // The KRNL contract address (The Brain)
    
    // Membership
    struct Member {
        address addr;
        string name;
        uint256 totalContributions;
        uint8 status; // 0=active, 1=pending, 2=inactive
        uint256 joinDate;
        uint256 lastContribution;
    }
    
    mapping(address => Member) public members;
    address[] public memberList;
    uint256 public constant MAX_MEMBERS = 10;
    
    // Financials
    uint256 public treasuryBalance;
    uint256 public currentRound;
    uint256 public nextRecipientIndex; // Index in memberList for next payout
    
    // Events
    event MemberAdded(address indexed member, string name);
    event ContributionReceived(address indexed member, uint256 amount, uint256 round);
    event PayoutProcessed(address indexed recipient, uint256 amount, uint256 round);
    event RoundCompleted(uint256 round);

    // ============================================================================
    // MODIFIERS
    // ============================================================================
    
    modifier onlyKernel() {
        require(msg.sender == kernel, "ChamaCore: Only Kernel can call this");
        _;
    }
    
    modifier onlyActiveMember() {
        require(members[msg.sender].status == 0, "ChamaCore: Not an active member");
        _;
    }

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    constructor(
        string memory _name,
        string memory _description,
        uint256 _contributionAmount,
        uint256 _payoutCycle,
        address _kernel
    ) {
        name = _name;
        description = _description;
        contributionAmount = _contributionAmount;
        payoutCycle = _payoutCycle;
        kernel = _kernel;
        currentRound = 1;
    }
    
    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================
    
    function getGroupDetails() external view returns (
        string memory _name,
        string memory _description,
        uint256 _totalMembers,
        uint256 _treasuryBalance,
        uint256 _contributionAmount,
        uint256 _currentRound
    ) {
        return (name, description, memberList.length, treasuryBalance, contributionAmount, currentRound);
    }
    
    function getMember(address _addr) external view returns (Member memory) {
        return members[_addr];
    }
    
    function getNextRecipient() external view returns (address) {
        if (memberList.length == 0) return address(0);
        return memberList[nextRecipientIndex];
    }
    
    // ============================================================================
    // CORE FUNCTIONS
    // ============================================================================
    
    function addMember(address _addr, string memory _memberName) external {
        // In this simplified version, anyone can join if spots available
        // In production, this might be gated by Kernel or onlyOwner
        require(memberList.length < MAX_MEMBERS, "ChamaCore: Group is full");
        require(members[_addr].joinDate == 0, "ChamaCore: Already a member");
        
        Member memory newMember = Member({
            addr: _addr,
            name: _memberName,
            totalContributions: 0,
            status: 0, // active
            joinDate: block.timestamp,
            lastContribution: 0
        });
        
        members[_addr] = newMember;
        memberList.push(_addr);
        
        emit MemberAdded(_addr, _memberName);
    }
    
    function contribute() external payable onlyActiveMember {
        require(msg.value == contributionAmount, "ChamaCore: Incorrect contribution amount");
        
        members[msg.sender].totalContributions += msg.value;
        members[msg.sender].lastContribution = block.timestamp;
        treasuryBalance += msg.value;
        
        emit ContributionReceived(msg.sender, msg.value, currentRound);
    }
    
    /**
     * @dev Process payout - Only callable by Kernel
     * @param _recipient Expected recipient address for double verification
     */
    function payout(address _recipient) external onlyKernel {
        require(address(this).balance >= treasuryBalance, "ChamaCore: Insufficient contract balance");
        
        // Determine recipient based on rotation
        address actualRecipient = memberList[nextRecipientIndex];
        require(actualRecipient == _recipient, "ChamaCore: Recipient mismatch in rotation");
        
        // Check if pot is full (Assuming standard round where everyone contributed)
        // For flexibility, we payout whatever is in treasury or fixed amount?
        // Let's assume we payout the full pot collected for this round
        uint256 amountToPayout = treasuryBalance;
        require(amountToPayout > 0, "ChamaCore: No funds to payout");
        
        // Reset treasury tracking
        treasuryBalance = 0;
        
        // Update rotation for next round
        nextRecipientIndex = (nextRecipientIndex + 1) % memberList.length;
        currentRound++;
        
        // INTERACTIONS (Pull payment pattern preferred, but push for simplicity in demo)
        (bool success, ) = payable(actualRecipient).call{value: amountToPayout}("");
        require(success, "ChamaCore: Transfer failed");
        
        emit PayoutProcessed(actualRecipient, amountToPayout, currentRound - 1);
        emit RoundCompleted(currentRound - 1);
    }
}
