// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VotingPool
 * @notice On-chain voting for Human vs AI identification
 * @dev Voters stake MNT, correct guesses split the reward pool
 */
contract VotingPool is Ownable, ReentrancyGuard {
    struct Round {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 revealTime;
        uint256 totalStaked;
        bool isRevealed;
        mapping(uint256 => bool) traderIsAI; // traderId => true if AI
        mapping(address => mapping(uint256 => bool)) votes; // voter => traderId => voted AI
        mapping(address => uint256) stakes; // voter => staked amount
        mapping(address => bool) hasVoted;
        mapping(address => bool) hasClaimed;
        uint256 correctVoters;
        uint256 totalVoters;
    }

    mapping(uint256 => Round) public rounds;
    uint256 public currentRoundId;
    uint256 public constant MIN_STAKE = 0.01 ether;
    uint256 public votingDuration = 5 minutes; // Default 5 minutes for demo
    uint256 public revealDelay = 1 minutes; // Default 1 minute for demo

    event RoundCreated(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event VoteCast(
        uint256 indexed roundId,
        address indexed voter,
        uint256 traderId,
        bool votedAI,
        uint256 stake
    );
    event RoundRevealed(uint256 indexed roundId, uint256 correctVoters, uint256 totalVoters);
    event RewardClaimed(uint256 indexed roundId, address indexed voter, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set voting duration (owner only)
     * @param _duration Duration in seconds
     */
    function setVotingDuration(uint256 _duration) external onlyOwner {
        require(_duration >= 1 minutes, "Duration too short");
        votingDuration = _duration;
    }

    /**
     * @notice Set reveal delay (owner only)
     * @param _delay Delay in seconds
     */
    function setRevealDelay(uint256 _delay) external onlyOwner {
        revealDelay = _delay;
    }

    /**
     * @notice Start a new voting round
     * @param traderIds Array of trader IDs participating
     * @return roundId The created round ID
     */
    function startRound(uint256[] memory traderIds) external onlyOwner returns (uint256) {
        // Comment out for testing - allow multiple rounds without reveal
        // require(
        //     currentRoundId == 0 || rounds[currentRoundId].isRevealed,
        //     "Previous round not revealed"
        // );

        uint256 roundId = ++currentRoundId;
        Round storage round = rounds[roundId];

        round.roundId = roundId;
        round.startTime = block.timestamp;
        round.endTime = block.timestamp + votingDuration;
        round.revealTime = round.endTime + revealDelay;
        round.isRevealed = false;

        emit RoundCreated(roundId, round.startTime, round.endTime);
        return roundId;
    }

    /**
     * @notice Cast votes for multiple traders
     * @param roundId Round to vote in
     * @param traderIds Array of trader IDs
     * @param votesAI Array of votes (true = AI, false = Human)
     */
    function vote(
        uint256 roundId,
        uint256[] memory traderIds,
        bool[] memory votesAI
    ) external payable nonReentrant {
        Round storage round = rounds[roundId];

        require(block.timestamp >= round.startTime, "Voting not started");
        require(block.timestamp < round.endTime, "Voting ended");
        require(!round.hasVoted[msg.sender], "Already voted");
        require(msg.value >= MIN_STAKE, "Stake too low");
        require(traderIds.length == votesAI.length, "Array length mismatch");

        round.hasVoted[msg.sender] = true;
        round.stakes[msg.sender] = msg.value;
        round.totalStaked += msg.value;
        round.totalVoters++;

        for (uint256 i = 0; i < traderIds.length; i++) {
            round.votes[msg.sender][traderIds[i]] = votesAI[i];
            emit VoteCast(roundId, msg.sender, traderIds[i], votesAI[i], msg.value);
        }
    }

    /**
     * @notice Reveal round results (owner only)
     * @param roundId Round to reveal
     * @param traderIds Array of trader IDs
     * @param isAI Array indicating which traders are AI
     */
    function revealRound(
        uint256 roundId,
        uint256[] memory traderIds,
        bool[] memory isAI
    ) external onlyOwner {
        Round storage round = rounds[roundId];

        require(block.timestamp >= round.revealTime, "Reveal time not reached");
        require(!round.isRevealed, "Already revealed");
        require(traderIds.length == isAI.length, "Array length mismatch");

        round.isRevealed = true;

        // Store ground truth
        for (uint256 i = 0; i < traderIds.length; i++) {
            round.traderIsAI[traderIds[i]] = isAI[i];
        }

        emit RoundRevealed(roundId, round.correctVoters, round.totalVoters);
    }

    /**
     * @notice Claim reward if voted correctly
     * @param roundId Round to claim from
     * @param traderIds Array of trader IDs that were voted on
     */
    function claimReward(uint256 roundId, uint256[] memory traderIds) external nonReentrant {
        Round storage round = rounds[roundId];

        require(round.isRevealed, "Round not revealed");
        require(round.hasVoted[msg.sender], "Did not vote");
        require(!round.hasClaimed[msg.sender], "Already claimed");

        // Check if all votes were correct
        bool allCorrect = true;
        for (uint256 i = 0; i < traderIds.length; i++) {
            if (round.votes[msg.sender][traderIds[i]] != round.traderIsAI[traderIds[i]]) {
                allCorrect = false;
                break;
            }
        }

        require(allCorrect, "Not all votes correct");

        round.hasClaimed[msg.sender] = true;
        round.correctVoters++;

        // Calculate reward (equal split among correct voters)
        // In production, this would be calculated after all claims or use a merkle tree
        uint256 reward = round.stakes[msg.sender]; // Simplified: return stake + share of pool

        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");

        emit RewardClaimed(roundId, msg.sender, reward);
    }

    /**
     * @notice Get voter's votes for a round
     * @param roundId Round ID
     * @param voter Voter address
     * @param traderIds Trader IDs to check
     * @return Array of votes
     */
    function getVotes(
        uint256 roundId,
        address voter,
        uint256[] memory traderIds
    ) external view returns (bool[] memory) {
        Round storage round = rounds[roundId];
        bool[] memory votes = new bool[](traderIds.length);

        for (uint256 i = 0; i < traderIds.length; i++) {
            votes[i] = round.votes[voter][traderIds[i]];
        }

        return votes;
    }

    /**
     * @notice Check if address has voted in round
     * @param roundId Round ID
     * @param voter Voter address
     * @return True if voted
     */
    function hasVoted(uint256 roundId, address voter) external view returns (bool) {
        return rounds[roundId].hasVoted[voter];
    }

    /**
     * @notice Get round stats
     * @param roundId Round ID
     * @return startTime endTime totalStaked totalVoters isRevealed
     */
    function getRoundStats(uint256 roundId)
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 totalStaked,
            uint256 totalVoters,
            bool isRevealed
        )
    {
        Round storage round = rounds[roundId];
        return (
            round.startTime,
            round.endTime,
            round.totalStaked,
            round.totalVoters,
            round.isRevealed
        );
    }
}
