// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentRegistry.sol";
import "./VotingPool.sol";

/**
 * @title TuringArena
 * @notice Main game coordinator for Human vs AI trading competition
 * @dev Orchestrates trading rounds, scoring, and leaderboard
 */
contract TuringArena is Ownable {
    AgentRegistry public immutable agentRegistry;
    VotingPool public immutable votingPool;

    struct TradeRecord {
        uint256 traderId;
        uint256 timestamp;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 gasUsed;
        string reasoning; // IPFS hash or short text
    }

    struct TradingRound {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256[] traderIds;
        mapping(uint256 => TradeRecord[]) trades; // traderId => trades
        mapping(uint256 => int256) scores; // traderId => final score
        bool isFinalized;
    }

    mapping(uint256 => TradingRound) public rounds;
    uint256 public currentRoundId;

    // Leaderboard
    struct LeaderboardEntry {
        uint256 traderId;
        string name;
        uint256 totalRounds;
        uint256 wins;
        int256 totalScore;
        int256 totalPnL;
    }

    mapping(uint256 => LeaderboardEntry) public leaderboard;
    uint256[] public leaderboardIds;

    event RoundStarted(uint256 indexed roundId, uint256[] traderIds, uint256 startTime);
    event TradeRecorded(
        uint256 indexed roundId,
        uint256 indexed traderId,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event RoundFinalized(uint256 indexed roundId, uint256 winnerId, int256 winningScore);
    event LeaderboardUpdated(uint256 indexed traderId, int256 newScore);

    constructor(address _agentRegistry, address _votingPool) Ownable(msg.sender) {
        agentRegistry = AgentRegistry(_agentRegistry);
        votingPool = VotingPool(_votingPool);
    }

    /**
     * @notice Start a new trading round
     * @param traderIds Array of trader IDs (agents + humans)
     * @param duration Round duration in seconds
     * @return roundId The created round ID
     */
    function startRound(uint256[] memory traderIds, uint256 duration)
        external
        onlyOwner
        returns (uint256)
    {
        require(
            currentRoundId == 0 || rounds[currentRoundId].isFinalized,
            "Previous round not finalized"
        );

        uint256 roundId = ++currentRoundId;
        TradingRound storage round = rounds[roundId];

        round.roundId = roundId;
        round.startTime = block.timestamp;
        round.endTime = block.timestamp + duration;
        round.traderIds = traderIds;
        round.isFinalized = false;

        emit RoundStarted(roundId, traderIds, block.timestamp);
        return roundId;
    }

    /**
     * @notice Record a trade execution
     * @param roundId Round ID
     * @param traderId Trader ID
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Input amount
     * @param amountOut Output amount
     * @param gasUsed Gas consumed
     * @param reasoning Trade reasoning (IPFS hash or text)
     */
    function recordTrade(
        uint256 roundId,
        uint256 traderId,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 gasUsed,
        string memory reasoning
    ) external onlyOwner {
        TradingRound storage round = rounds[roundId];

        require(block.timestamp >= round.startTime, "Round not started");
        require(block.timestamp < round.endTime, "Round ended");
        require(!round.isFinalized, "Round finalized");

        TradeRecord memory trade = TradeRecord({
            traderId: traderId,
            timestamp: block.timestamp,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOut: amountOut,
            gasUsed: gasUsed,
            reasoning: reasoning
        });

        round.trades[traderId].push(trade);

        emit TradeRecorded(roundId, traderId, tokenIn, tokenOut, amountIn, amountOut);
    }

    /**
     * @notice Finalize round and calculate scores
     * @param roundId Round to finalize
     * @param scores Array of final scores for each trader
     * @param pnls Array of P&L for each trader (in basis points)
     */
    function finalizeRound(
        uint256 roundId,
        int256[] memory scores,
        int256[] memory pnls
    ) external onlyOwner {
        TradingRound storage round = rounds[roundId];

        require(block.timestamp >= round.endTime, "Round not ended");
        require(!round.isFinalized, "Already finalized");
        require(scores.length == round.traderIds.length, "Score array mismatch");
        require(pnls.length == round.traderIds.length, "PnL array mismatch");

        round.isFinalized = true;

        // Find winner
        int256 maxScore = type(int256).min;
        uint256 winnerId = 0;

        for (uint256 i = 0; i < round.traderIds.length; i++) {
            uint256 traderId = round.traderIds[i];
            round.scores[traderId] = scores[i];

            if (scores[i] > maxScore) {
                maxScore = scores[i];
                winnerId = traderId;
            }

            // Update leaderboard
            _updateLeaderboard(traderId, scores[i], pnls[i]);
        }

        emit RoundFinalized(roundId, winnerId, maxScore);
    }

    /**
     * @notice Update leaderboard for a trader
     * @param traderId Trader ID
     * @param score Round score
     * @param pnl Round P&L
     */
    function _updateLeaderboard(
        uint256 traderId,
        int256 score,
        int256 pnl
    ) private {
        LeaderboardEntry storage entry = leaderboard[traderId];

        if (entry.totalRounds == 0) {
            // New entry
            AgentRegistry.AgentProfile memory agent = agentRegistry.getAgent(traderId);
            entry.traderId = traderId;
            entry.name = agent.name;
            leaderboardIds.push(traderId);
        }

        entry.totalRounds++;
        entry.totalScore += score;
        entry.totalPnL += pnl;

        if (score > 0) {
            entry.wins++;
        }

        emit LeaderboardUpdated(traderId, entry.totalScore);
    }

    /**
     * @notice Get trades for a trader in a round
     * @param roundId Round ID
     * @param traderId Trader ID
     * @return Array of trade records
     */
    function getTrades(uint256 roundId, uint256 traderId)
        external
        view
        returns (TradeRecord[] memory)
    {
        return rounds[roundId].trades[traderId];
    }

    /**
     * @notice Get round score for a trader
     * @param roundId Round ID
     * @param traderId Trader ID
     * @return Final score
     */
    function getScore(uint256 roundId, uint256 traderId) external view returns (int256) {
        return rounds[roundId].scores[traderId];
    }

    /**
     * @notice Get top N traders from leaderboard
     * @param n Number of top traders to return
     * @return Array of leaderboard entries
     */
    function getTopTraders(uint256 n) external view returns (LeaderboardEntry[] memory) {
        uint256 count = leaderboardIds.length < n ? leaderboardIds.length : n;
        LeaderboardEntry[] memory top = new LeaderboardEntry[](count);

        // Simple implementation - in production use sorted data structure
        for (uint256 i = 0; i < count; i++) {
            top[i] = leaderboard[leaderboardIds[i]];
        }

        return top;
    }

    /**
     * @notice Get leaderboard entry for a trader
     * @param traderId Trader ID
     * @return Leaderboard entry
     */
    function getLeaderboardEntry(uint256 traderId)
        external
        view
        returns (LeaderboardEntry memory)
    {
        return leaderboard[traderId];
    }
}
