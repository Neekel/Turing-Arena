// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentRegistry
 * @notice ERC-8004 compliant registry for AI agent identities
 * @dev Each agent gets a unique NFT representing their on-chain identity
 */
contract AgentRegistry is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct AgentProfile {
        string name;
        string personality; // "Aggressor", "Conservative", "MemeLord"
        uint8 riskTolerance; // 0-100
        string strategy; // "momentum", "DCA", "sentiment"
        uint256 totalTrades;
        int256 totalPnL; // in basis points (10000 = 100%)
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => AgentProfile) public agents;
    mapping(string => bool) public nameExists;

    event AgentRegistered(
        uint256 indexed tokenId,
        string name,
        string personality,
        address indexed owner
    );
    event AgentUpdated(uint256 indexed tokenId, uint256 totalTrades, int256 totalPnL);
    event AgentDeactivated(uint256 indexed tokenId);

    constructor() ERC721("TuringArena Agent", "AGENT") Ownable(msg.sender) {}

    /**
     * @notice Register a new AI agent
     * @param name Unique agent name
     * @param personality Agent personality type
     * @param riskTolerance Risk level (0-100)
     * @param strategy Trading strategy
     * @return tokenId The minted NFT token ID
     */
    function registerAgent(
        string memory name,
        string memory personality,
        uint8 riskTolerance,
        string memory strategy
    ) external onlyOwner returns (uint256) {
        require(!nameExists[name], "Agent name already exists");
        require(riskTolerance <= 100, "Risk tolerance must be 0-100");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        agents[tokenId] = AgentProfile({
            name: name,
            personality: personality,
            riskTolerance: riskTolerance,
            strategy: strategy,
            totalTrades: 0,
            totalPnL: 0,
            createdAt: block.timestamp,
            isActive: true
        });

        nameExists[name] = true;

        emit AgentRegistered(tokenId, name, personality, msg.sender);
        return tokenId;
    }

    /**
     * @notice Update agent performance stats
     * @param tokenId Agent NFT ID
     * @param trades Number of trades to add
     * @param pnl P&L to add (in basis points)
     */
    function updateAgentStats(
        uint256 tokenId,
        uint256 trades,
        int256 pnl
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");
        require(agents[tokenId].isActive, "Agent is not active");

        agents[tokenId].totalTrades += trades;
        agents[tokenId].totalPnL += pnl;

        emit AgentUpdated(tokenId, agents[tokenId].totalTrades, agents[tokenId].totalPnL);
    }

    /**
     * @notice Deactivate an agent
     * @param tokenId Agent NFT ID
     */
    function deactivateAgent(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");
        agents[tokenId].isActive = false;
        emit AgentDeactivated(tokenId);
    }

    /**
     * @notice Get agent profile
     * @param tokenId Agent NFT ID
     * @return Agent profile struct
     */
    function getAgent(uint256 tokenId) external view returns (AgentProfile memory) {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");
        return agents[tokenId];
    }

    /**
     * @notice Get total number of registered agents
     * @return Total agent count
     */
    function totalAgents() external view returns (uint256) {
        return _nextTokenId;
    }
}
