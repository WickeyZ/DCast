// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

contract DCast {
    //=================================
    // UTILs
    //=================================

    using Counters for Counters.Counter;

    //=================================
    // ENUMs
    //=================================

    enum VotingPhase {
        Registration,
        Voting,
        Close
    }

    //=================================
    // STRUCTs & EVENTs
    //=================================

    //VotingSession structs
    struct VotingSession {
        uint256 votingSessionID;
        string votingSessionName;
        VotingPhase phase;
        uint256 registrationTime;
        uint256 votingTime;
        uint256 closeTime;
        VotingSessionRoles votingSessionRoles;
    }

    //VotingSessionRoles struct in VotingSession struct
    struct VotingSessionRoles {
        uint256[] registeredVoterIDs;
        mapping(uint256 => bool) registeredVoters;
        uint256[] winnerCandidateIDs;
        Counters.Counter registeredCandidateCount;
        mapping(uint256 => Candidate) registeredCandidates;
    }

    event VotingSessionAdded(
        uint256 votingSessionID,
        string votingSessionName,
        VotingPhase phase,
        uint256 registrationTime
    );

    event VotingSessionPhaseUpdated(
        uint256 votingSessionID,
        VotingPhase phase,
        uint256 time
    );

    event VoterRegistered(
        uint256 votingSessionID,
        uint256 voterID,
        uint8 votingWeight
    );

    event CandidateRegistered(
        uint256 votingSessionID,
        uint256 candidateID,
        string candidateName,
        string description,
        string candidateImageIPFS_URL
    );

    //Candidate struct in VotingSessionRoles struct
    struct Candidate {
        uint256 candidateID;
        string candidateName;
        string description;
        string candidateImageIPFS_URL;
        Counters.Counter voteCount;
    }

    //Voter struct
    struct Voter {
        uint256 voterID;
        address voterAddress;
        uint256[] sessionsParticipated;
        mapping(uint256 => VoterSessionDetails) voterSessionDetails;
    }

    //VoterSessionDetails struct in Voter struct
    struct VoterSessionDetails {
        uint8 votingWeight;
        uint256 votedCandidateID;
    }

    event VoterAdded(uint256 voterID, address voterAddress);

    event AdminAdded(address adminAddress);

    event VoteCasted(
        uint256 votingSessionID,
        uint256 voterID,
        uint256 votedCandidateID,
        uint256 votedCandidateVoteCount
    );

    //=================================
    // STATE VARIABLES
    //=================================

    //Voting Session
    Counters.Counter public votingSessionCount;
    mapping(uint256 => VotingSession) internal votingSessions;

    //Voter
    address[] public voterAddresses;
    mapping(address => Voter) public voters;

    //Contract Owner & Admin
    address public contractOwner;
    address[] public adminAddresses;
    mapping(address => bool) public admins;

    //=================================
    // CONSTRUCTOR
    //=================================
    constructor() {
        contractOwner = msg.sender;
        addAdmin(contractOwner);
    }

    //=================================
    // FUNCTION MODIFIERS
    //=================================

    modifier onlyAdmin() {
        require(
            msg.sender == contractOwner || admins[msg.sender],
            "Caller is not an admin"
        );
        _;
    }

    modifier adminNotExists(address _adminAddress) {
        require(!admins[_adminAddress], "Admin already exists");
        _;
    }

    modifier voterNotExists(address _voterAddress) {
        require(
            voters[_voterAddress].voterAddress != _voterAddress,
            "Voter already exists"
        );
        _;
    }

    modifier votingSessionExists(uint256 _votingSessionID) {
        require(
            votingSessions[_votingSessionID].votingSessionID ==
                _votingSessionID,
            "Voting session does not exist"
        );
        _;
    }

    modifier votingPhaseIsNotClose(uint256 _votingSessionID) {
        require(
            votingSessions[_votingSessionID].phase != VotingPhase.Close,
            "Voting session is already closed"
        );
        _;
    }

    modifier votingPhaseIsRegistration(uint256 _votingSessionID) {
        require(
            votingSessions[_votingSessionID].phase == VotingPhase.Registration,
            "Voting session phase is not registration"
        );
        _;
    }

    modifier votingPhaseIsVoting(uint256 _votingSessionID) {
        require(
            votingSessions[_votingSessionID].phase == VotingPhase.Voting,
            "Voting session phase is not voting"
        );
        _;
    }

    modifier atLeast1CandidateAnd1VoterRegistered(uint256 _votingSessionID) {
        require(
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidateCount
                .current() > 0,
            "At least one candidate should be registered"
        );
        require(
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredVoterIDs
                .length > 0,
            "At least one voter should be registered"
        );
        _;
    }

    modifier voterExists(uint256 _voterID) {
        require(
            voters[voterAddresses[_voterID - 1]].voterID == _voterID,
            "Voter does not exist"
        );
        _;
    }

    modifier votingWeightIsNotZero(uint8 _votingWeight) {
        require(_votingWeight > 0, "Voting weight should be greater than zero");
        _;
    }

    modifier onlyVotingSessionVoter(uint256 votingSessionID) {
        require(
            voters[msg.sender].voterAddress == msg.sender,
            "Caller is not a voter"
        );
        require(
            votingSessions[votingSessionID].votingSessionRoles.registeredVoters[
                voters[msg.sender].voterID
            ] == true,
            "Caller is not a voter of this voting session"
        );
        _;
    }

    modifier candidateNotExists(
        uint256 _votingSessionID,
        uint256 _candidateID
    ) {
        require(
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .candidateID != _candidateID,
            "Candidate already exists"
        );
        _;
    }

    modifier candidateExists(uint256 _votingSessionID, uint256 _candidateID) {
        require(
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .candidateID == _candidateID,
            "Candidate does not exist"
        );
        _;
    }

    //=================================
    // FUNCTIONS
    //=================================

    function getContractOwnerAddress() public view returns (address) {
        return contractOwner;
    }

    function addAdmin(
        address _adminAddress
    ) public onlyAdmin adminNotExists(_adminAddress) {
        adminAddresses.push(_adminAddress);
        admins[_adminAddress] = true;
        emit AdminAdded(_adminAddress);
    }

    function getAdminAddresses() public view returns (address[] memory) {
        return adminAddresses;
    }

    function addVoter(
        address _voterAddress
    ) public onlyAdmin voterNotExists(_voterAddress) {
        voterAddresses.push(_voterAddress);

        voters[_voterAddress].voterID = voterAddresses.length;
        voters[_voterAddress].voterAddress = _voterAddress;
        emit VoterAdded(
            voters[_voterAddress].voterID,
            voters[_voterAddress].voterAddress
        );
    }

    function getVoterCount() public view returns (uint256) {
        return voterAddresses.length;
    }

    function getVoterAddresses() public view returns (address[] memory) {
        return voterAddresses;
    }

    function getVoterDetails(
        address _voterAddress
    ) public view returns (uint256, address, uint256[] memory) {
        return (
            voters[_voterAddress].voterID,
            voters[_voterAddress].voterAddress,
            voters[_voterAddress].sessionsParticipated
        );
    }

    //check account type
    function checkAccountType(
        address _accountAddress
    ) public view returns (string memory) {
        if (_accountAddress == contractOwner) {
            return "Owner";
        } else if (admins[_accountAddress]) {
            return "Admin";
        } else if (voters[_accountAddress].voterAddress == _accountAddress) {
            return "Voter";
        } else {
            return "Guest";
        }
    }

    //add voting session with name
    function addVotingSession(
        string memory _votingSessionName
    ) public onlyAdmin {
        votingSessionCount.increment();
        uint256 _votingSessionID = votingSessionCount.current();

        VotingSession storage newVotingSession = votingSessions[
            _votingSessionID
        ];

        newVotingSession.votingSessionID = _votingSessionID;
        newVotingSession.votingSessionName = _votingSessionName;
        newVotingSession.phase = VotingPhase.Registration;
        newVotingSession.registrationTime = block.timestamp;

        emit VotingSessionAdded(
            newVotingSession.votingSessionID,
            newVotingSession.votingSessionName,
            newVotingSession.phase,
            newVotingSession.registrationTime
        );
    }

    function getVotingSessionCount() public view returns (uint256) {
        return votingSessionCount.current();
    }

    function getVotingSessionDetails(
        uint256 _votingSessionID
    )
        public
        view
        returns (uint256, string memory, VotingPhase, uint256, uint256, uint256)
    {
        return (
            votingSessions[_votingSessionID].votingSessionID,
            votingSessions[_votingSessionID].votingSessionName,
            votingSessions[_votingSessionID].phase,
            votingSessions[_votingSessionID].registrationTime,
            votingSessions[_votingSessionID].votingTime,
            votingSessions[_votingSessionID].closeTime
        );
    }

    //register voter
    function registerVoter(
        uint256 _votingSessionID,
        uint256 _voterID,
        uint8 _votingWeight
    )
        public
        onlyAdmin
        votingSessionExists(_votingSessionID)
        voterExists(_voterID)
        votingWeightIsNotZero(_votingWeight)
    {
        VotingSession storage votingSession = votingSessions[_votingSessionID];

        votingSession.votingSessionRoles.registeredVoterIDs.push(_voterID);
        votingSession.votingSessionRoles.registeredVoters[_voterID] = true;

        address voterAddress = voterAddresses[_voterID - 1];
        voters[voterAddress].sessionsParticipated.push(_votingSessionID);
        voters[voterAddress]
            .voterSessionDetails[_votingSessionID]
            .votingWeight = _votingWeight;

        emit VoterRegistered(
            votingSession.votingSessionID,
            _voterID,
            voters[voterAddress]
                .voterSessionDetails[_votingSessionID]
                .votingWeight
        );
    }

    function getVotingSessionRegisteredVoterIDs(
        uint256 _votingSessionID
    ) public view returns (uint256[] memory) {
        return
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredVoterIDs;
    }

    function getVoterVotingSessionDetails(
        address _voterAddress,
        uint256 _votingSessionID
    ) public view returns (uint8, uint256) {
        return (
            voters[_voterAddress]
                .voterSessionDetails[_votingSessionID]
                .votingWeight,
            voters[_voterAddress]
                .voterSessionDetails[_votingSessionID]
                .votedCandidateID
        );
    }

    //register candidate
    function registerCandidate(
        uint256 _votingSessionID,
        string memory _candidateName,
        string memory _description,
        string memory _candidateImageIPFS_URL
    )
        public
        onlyAdmin
        votingSessionExists(_votingSessionID)
        candidateNotExists(
            _votingSessionID,
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidateCount
                .current()
        )
    {
        VotingSession storage votingSession = votingSessions[_votingSessionID];
        votingSession.votingSessionRoles.registeredCandidateCount.increment();
        uint256 _candidateID = votingSession
            .votingSessionRoles
            .registeredCandidateCount
            .current();

        Candidate memory newCandidate = votingSession
            .votingSessionRoles
            .registeredCandidates[_candidateID];

        newCandidate.candidateID = _candidateID;
        newCandidate.candidateName = _candidateName;
        newCandidate.description = _description;
        newCandidate.candidateImageIPFS_URL = _candidateImageIPFS_URL;

        emit CandidateRegistered(
            votingSession.votingSessionID,
            newCandidate.candidateID,
            newCandidate.candidateName,
            newCandidate.description,
            newCandidate.candidateImageIPFS_URL
        );
    }

    function getVotingSessionCandidateCount(
        uint256 _votingSessionID
    ) public view returns (uint256) {
        return
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidateCount
                .current();
    }

    function getVotingSessionWinnerCandidateIDs(
        uint256 _votingSessionID
    ) public view returns (uint256[] memory) {
        return
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .winnerCandidateIDs;
    }

    function getVotingSessionCandidateDetails(
        uint256 _votingSessionID,
        uint256 _candidateID
    )
        public
        view
        returns (uint256, string memory, string memory, string memory, uint256)
    {
        return (
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .candidateID,
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .candidateName,
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .description,
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .candidateImageIPFS_URL,
            votingSessions[_votingSessionID]
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .voteCount
                .current()
        );
    }

    //update voting session phase
    function updateVotingSessionPhase(
        uint256 _votingSessionID
    )
        public
        onlyAdmin
        votingSessionExists(_votingSessionID)
        votingPhaseIsNotClose(_votingSessionID)
    {
        VotingSession storage votingSession = votingSessions[_votingSessionID];

        if (votingSession.phase == VotingPhase.Registration) {
            updateToVotingPhase(_votingSessionID);
        } else if (votingSession.phase == VotingPhase.Voting) {
            updateToClosePhase(_votingSessionID);
        }

        emit VotingSessionPhaseUpdated(
            votingSession.votingSessionID,
            votingSession.phase,
            block.timestamp
        );
    }

    function updateToVotingPhase(
        uint256 _votingSessionID
    )
        internal
        onlyAdmin
        atLeast1CandidateAnd1VoterRegistered(_votingSessionID)
        votingPhaseIsRegistration(_votingSessionID)
    {
        votingSessions[_votingSessionID].phase = VotingPhase.Voting;
        votingSessions[_votingSessionID].votingTime = block.timestamp;
    }

    function updateToClosePhase(
        uint256 _votingSessionID
    ) internal onlyAdmin votingPhaseIsVoting(_votingSessionID) {
        votingSessions[_votingSessionID].phase = VotingPhase.Close;
        votingSessions[_votingSessionID].closeTime = block.timestamp;
        computeWinnerCandidateIDs(_votingSessionID);
    }

    function computeWinnerCandidateIDs(
        uint256 _votingSessionID
    )
        internal
        onlyAdmin
        votingSessionExists(_votingSessionID)
        votingPhaseIsVoting(_votingSessionID)
    {
        VotingSession storage votingSession = votingSessions[_votingSessionID];

        uint256[] memory _winnerCandidateIDs = new uint256[](
            votingSession.votingSessionRoles.registeredCandidateCount.current()
        );

        uint256 _maxVoteCount = 0;
        uint256 _winnerCandidateCount = 0;

        for (
            uint256 i = 1;
            i <=
            votingSession.votingSessionRoles.registeredCandidateCount.current();
            i++
        ) {
            uint256 _candidateID = i;
            uint256 _candidateVoteCount = votingSession
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .voteCount
                .current();

            if (_candidateVoteCount > _maxVoteCount) {
                _maxVoteCount = _candidateVoteCount;
                _winnerCandidateCount = 1;
                _winnerCandidateIDs[0] = _candidateID;
            } else if (_candidateVoteCount == _maxVoteCount) {
                _winnerCandidateCount++;
                _winnerCandidateIDs[_winnerCandidateCount - 1] = _candidateID;
            }
        }

        votingSession
            .votingSessionRoles
            .winnerCandidateIDs = _winnerCandidateIDs;
    }

    //cast vote
    function castVote(
        uint256 _votingSessionID,
        uint256 _voterID,
        uint256 _candidateID
    )
        public
        onlyVotingSessionVoter(_votingSessionID)
        votingSessionExists(_votingSessionID)
        candidateExists(_votingSessionID, _candidateID)
    {
        VotingSession storage votingSession = votingSessions[_votingSessionID];

        address voterAddress = voterAddresses[_voterID - 1];
        voters[voterAddress]
            .voterSessionDetails[_votingSessionID]
            .votedCandidateID = _candidateID;

        //increase vote count according to voter weight
        for (
            uint256 i = 0;
            i <
            voters[voterAddress]
                .voterSessionDetails[_votingSessionID]
                .votingWeight;
            i++
        ) {
            votingSession
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .voteCount
                .increment();
        }

        emit VoteCasted(
            votingSession.votingSessionID,
            _voterID,
            _candidateID,
            votingSession
                .votingSessionRoles
                .registeredCandidates[_candidateID]
                .voteCount
                .current()
        );
    }
}
