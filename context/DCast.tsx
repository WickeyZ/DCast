import React, { useState, createContext } from "react";
import Web3Modal from "web3modal";
import { BigNumberish, Signer, ethers } from "ethers";
import MetamaskHover from "@/components/MetamaskHover";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { VotingPhase } from "@/types";

// //Smart Contract
// //might move to constant.ts file
// Smart Contract Address and ABI
import dcast from "../artifacts/contracts/DCast.sol/DCast.json";
import toast from "react-hot-toast";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const contractABI = dcast.abi;

//IPFS
const ipfsProjectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID as string;
const ipfsProjectSecretKey = process.env
  .NEXT_PUBLIC_IPFS_PROJECT_SECRET_KEY as string;
const ipfsSubdomain = process.env.NEXT_PUBLIC_IPFS_SUBDOMAIN as string;

const authorization =
  "Basic " + btoa(ipfsProjectId + ":" + ipfsProjectSecretKey);
const subdomain = ipfsSubdomain;

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization,
  },
});

export const fetchContract = async (signerOrProvider: any) => {
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signerOrProvider
  );
  console.log("SMART CONTRACT FETCHED");
  console.log(contractAddress);
  return contract;
};

interface DCastData {
  checkIfWalletIsConnected: () => Promise<boolean>;
  connectWallet: () => Promise<void>;
  uploadToIPFS: (file: any) => Promise<string | undefined>;
  isWalletConnected: boolean;
  currentAccount: string;
  error: string;

  //general
  checkAccountType: (accountAddress: string) => Promise<string | null>;

  //check-voting-session (index)
  getVotingSessionDetails: any;

  //add-account
  addAdmin: (adminAddress: String) => Promise<void>;
  addVoter: (voterAddress: String) => Promise<void>;
  getVoterCount: () => Promise<any>;

  //view-accounts
  getContractOwnerAddress: () => Promise<string>;
  getAdminAddresses: () => Promise<any>;
  getVoterDetailsList: () => Promise<any>;

  //add-voting-session
  addVotingSession: (votingSessionName: String) => Promise<void>;
  getVotingSessionCount: () => Promise<any>;

  //register-voter-candidate
  registerVoter: (
    votingSessionID: number,
    voterID: number,
    votingWeight: number
  ) => Promise<void>;
  registerCandidate: (
    votingSessionID: number,
    candidateName: String,
    description: String,
    candidateImageIPFS_URL: String
  ) => Promise<void>;
  getVotingSessionCandidateCount: (votingSessionID: number) => Promise<any>;

  //update-voting-phase
  updateVotingSessionPhase: (votingSessionID: number) => Promise<void>;

  //cast-vote
  castVote: (
    votingSessionID: number,
    voterID: number,
    candidateID: number
  ) => Promise<any>;

  //my-voting-sessions
  getVoterID: (voterAddress: string) => Promise<any>;
  getSingleVoterDetails: (voterAddress: string) => Promise<any>;
  getVoterVotingSessionDetails: (
    voterAddress: string,
    votingSessionID: number
  ) => Promise<any>;

  // checkRatingStatus: (rating: VotingPhase) => Promise<number>;
  getContractOwner: () => Promise<string>;
  getFarmDataList: () => Promise<any>;
  getDistributionCenterDataList: () => Promise<any>;
  getRetailerDataList: () => Promise<any>;
  getConsumerDataList: () => Promise<any>;
  // addAdmin: (adminAddress: String) => Promise<void>;
  addFarm: (
    farmAddress: String,
    farmName: String,
    farmLocation: String
  ) => Promise<void>;
  getConsumerTotal: () => Promise<any>;
  addDistributionCenter: (
    distributionCenterAddress: String,
    distributionCenterName: String,
    distributionCenterLocation: String
  ) => Promise<void>;
  getDistributionCenterTotal: () => Promise<any>;
  addRetailer: (
    retailerAddress: String,
    retailerName: String,
    retailerLocation: String
  ) => Promise<void>;
  getRetailerTotal: () => Promise<any>;
  addConsumer: (consumerAddress: String, consumerName: String) => Promise<void>;
  getFarmTotal: () => Promise<any>;
  checkTotalDurian: () => Promise<any>;
  // checkDurianDetails: any;
  addDurian: (
    farmID: number,
    treeID: number,
    varietyCode: String,
    harvestedTime: number,
    durianImg: String,
    conditionFarm: number
  ) => Promise<void>;
  getFarmId: (farmAddress: String) => Promise<number>;
  addDurianDCDetails: (
    durianId: number,
    distributionCenterID: number,
    arrivalTimeDC: number,
    durianImg: String,
    conditionDC: number
  ) => Promise<void>;
  getDCId: (DCAddress: String) => Promise<number>;
  addDurianRTDetails: (
    durianId: number,
    retailerID: number,
    arrivalTimeRT: number,
    durianImg: String,
    conditionRT: number
  ) => Promise<void>;
  getRTId: (RTAddress: String) => Promise<number>;
  sellDurian: (
    durianId: number,
    consumerID: number,
    soldTime: number
  ) => Promise<void>;
  rateDurian: (
    durianId: number,
    durianImg: String,
    taste: number,
    fragrance: number,
    creaminess: number
  ) => Promise<void>;
}

type DCastContextProviderProps = {
  children: React.ReactNode;
};

const defaultValue = {
  checkIfWalletIsConnected: () => {},
  connectWallet: () => {},
  uploadToIPFS: () => {},
  isWalletConnected: false,
  currentAccount: "",
  error: "",
  checkAccountType: () => {},
  getVotingSessionDetails: () => {},
  addAdmin: () => {},
  addVoter: () => {},
  getVoterCount: () => {},
  getContractOwnerAddress: () => {},
  getAdminAddresses: () => {},
  getVoterDetailsList: () => {},
  addVotingSession: () => {},
  getVotingSessionCount: () => {},
  registerVoter: () => {},
  registerCandidate: () => {},
  getVotingSessionCandidateCount: () => {},
  updateVotingSessionPhase: () => {},
  castVote: () => {},
  getVoterID: () => {},
  getSingleVoterDetails: () => {},
  getVoterVotingSessionDetails: () => {},
  // checkRatingStatus: () => {},
  getContractOwner: () => {},
  getFarmDataList: () => {},
  getDistributionCenterDataList: () => {},
  getRetailerDataList: () => {},
  getConsumerDataList: () => {},
  // addAdmin: () => {},
  addFarm: () => {},
  addDistributionCenter: () => {},
  addRetailer: () => {},
  addConsumer: () => {},
  checkTotalDurian: () => {},
  // checkDurianDetails: () => {},
  addDurian: () => {},
  getFarmId: () => {},
  addDurianDCDetails: () => {},
  getDCId: () => {},
  addDurianRTDetails: () => {},
  getRTId: () => {},
  sellDurian: () => {},
  rateDurian: () => {},
} as unknown as DCastData;

export const DCastContext = createContext(defaultValue);
// export const DCastContext = React.createContext<Partial<DCastData>>([]);

export const DCastProvider = ({ children }: DCastContextProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState("");

  // CONNECTING SMART CONTRACT
  const connectSmartContract = async () => {
    console.log("trying to connect to smart contract");
    const web3Modal = new Web3Modal();
    console.log("web3modal");
    console.log(web3Modal);
    const connection = await web3Modal.connect();
    console.log("connection");
    console.log(connection);
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    console.log("SMART CONTRACT CONNECTED");
    console.log(connection);
    console.log(provider);
    console.log(signer);
    const fetchedContract = await fetchContract(signer);
    console.log("fetchedContract:", fetchedContract);
    return fetchedContract;
  };

  // CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask first.");
      return false;
    }
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setIsWalletConnected(true);
      return true;
    } else {
      setCurrentAccount("");
      setIsWalletConnected(false);
      setError("Connect with Metamask first.");
      return false;
    }
  };

  // CONNECT WALLET
  const connectWallet = async () => {
    try {
      console.log("connectWallet");
      if (!window.ethereum) {
        setError("Please install MetaMask first.");
        throw error;
      }

      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(account[0]);
      setIsWalletConnected(true);
    } catch (error) {
      console.log(error);
      toast((t) => <MetamaskHover />, {
        icon: "🦊",
      });
    }
  };

  //UPLOAD TO IPFS VOTER IMAGE
  //TODO: restrict to IMAGE file type
  const uploadToIPFS = async (file: any) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log(error);
      setError("Error uploading file to IPFS");
      throw error;
    }
  };

  //general
  const checkAccountType = async (accountAddress: String) => {
    try {
      const contract = await connectSmartContract();
      const accountType = await contract.checkAccountType(accountAddress);
      console.log(accountType);
      return accountType;
    } catch (error) {
      console.error(error);
      setError("Something went wrong in checking account type");
    }
  };

  //check-voting-session (index)
  const getVotingSessionDetails = async (votingSessionId: number) => {
    try {
      const contract = await connectSmartContract();

      const details = await contract.getVotingSessionDetails(votingSessionId);

      if (Number(details[0]) != 0) {
        const phase = Number(details[2]);

        //Get Candidate Details
        const candidateLength = await contract.getVotingSessionCandidateCount(
          votingSessionId
        );

        const candidateIds = Array.from(
          { length: Number(candidateLength) },
          (_, i) => i + 1
        );

        const candidateDetailPromises = candidateIds.map((candidateId) =>
          contract.getVotingSessionCandidateDetails(
            votingSessionId as number,
            candidateId as number
          )
        );

        const candidateDetails = await Promise.all(candidateDetailPromises);

        //Get Winner Ids
        const winnerCandidateIds =
          await contract.getVotingSessionWinnerCandidateIDs(votingSessionId);

        //Get Voter Details
        const voterIds = await contract.getVotingSessionRegisteredVoterIDs(
          votingSessionId
        );
        const allVoterAddresses = await contract.getVoterAddresses();
        const voterAddressPromises = voterIds.map(
          (voterId: number) => allVoterAddresses[Number(voterId) - 1]
        );

        const voterAddresses = await Promise.all(voterAddressPromises);
        const voterDetailPromises = voterAddresses.map((voterAddress) =>
          contract.getVoterDetails(voterAddress)
        );

        const voterDetails = await Promise.all(voterDetailPromises);

        //Get Voter Voting Session Details (voting weight and voted candidate)
        const voterVSDetailPromises = voterAddresses.map((voterAddress) =>
          contract.getVoterVotingSessionDetails(voterAddress, votingSessionId)
        );

        const voterVSDetails = await Promise.all(voterVSDetailPromises);
        console.log(
          "VS Details",
          details,
          "candidate Details",
          candidateDetails,
          "Winner Details",
          winnerCandidateIds,
          "Voter Details",
          voterDetails,
          "VoterVS Details",
          voterVSDetails
        );
        return {
          details,
          candidateDetails,
          winnerCandidateIds,
          voterDetails,
          voterVSDetails,
        };
      } else {
        return null;
      }
    } catch (error) {
      setError("Something went wrong in checking voting session details");
    }
  };

  //add-account
  const addAdmin = async (adminAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const admin = await contract.addAdmin(adminAddress);
      await admin.wait();
      console.log(admin);
    } catch (error) {
      setError("Something went wrong in adding admin");
      throw error;
    }
  };

  const addVoter = async (voterAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const voter = await contract.addVoter(voterAddress);
      await voter.wait();
      console.log(voter);
    } catch (error) {
      setError("Something went wrong in adding voter");
      throw error;
    }
  };

  const getVoterCount = async () => {
    try {
      const contract = await connectSmartContract();

      const voterCount: number = await contract.getVoterCount();
      console.log(voterCount);
      return Number(voterCount);
    } catch (error) {
      setError("Something went wrong in checking voter count");
    }
  };

  //view-accounts
  const getContractOwnerAddress = async () => {
    //return: ownerAddress
    try {
      const contract = await connectSmartContract();

      const owner = await contract.getContractOwnerAddress();
      console.log(owner);
      return owner;
    } catch (error) {
      setError("Something went wrong in getting contract owner address");
    }
  };

  const getAdminAddresses = async () => {
    try {
      const contract = await connectSmartContract();

      const admin = await contract.getAdminAddresses();
      console.log(admin);
      //return: [] of admin addresses
      return admin;
    } catch (error) {
      setError("Something went wrong in getting admin addresses list");
    }
  };

  const getVoterDetailsList = async () => {
    try {
      const contract = await connectSmartContract();

      const voterAddresses = await contract.getVoterAddresses();
      console.log(voterAddresses);

      const voterDetailsPromises = voterAddresses.map(
        async (voterAddress: any) => {
          const singleVoterDetails = await contract.getVoterDetails(
            voterAddress
          );
          return singleVoterDetails;
        }
      );

      const voterDetailsList = await Promise.all(voterDetailsPromises);

      // singleVoterDetails (in array form):
      // [voterID: number,
      // voterAddress: string
      // sessionsParticipated: number[] ]
      return { voterDetailsList };
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  //add-voting-session
  const addVotingSession = async (votingSessionName: String) => {
    try {
      const contract = await connectSmartContract();

      const votingSession = await contract.addVotingSession(votingSessionName);
      await votingSession.wait();
      console.log(votingSession);
    } catch (error) {
      setError("Something went wrong in adding voter");
      throw error;
    }
  };

  const getVotingSessionCount = async () => {
    try {
      const contract = await connectSmartContract();

      const votingSessionCount: number =
        (await contract.getVotingSessionCount()) as number;
      console.log(votingSessionCount);
      return Number(votingSessionCount);
    } catch (error) {
      setError("Something went wrong in checking voter count");
    }
  };

  const registerVoter = async (
    votingSessionID: number,
    voterID: number,
    votingWeight: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const registerVoter = await contract.registerVoter(
        votingSessionID,
        voterID,
        votingWeight
      );
      await registerVoter.wait();
      console.log(registerVoter);
    } catch (error) {
      setError("Something went wrong in registering voter");
      throw error;
    }
  };

  const registerCandidate = async (
    votingSessionID: number,
    candidateName: String,
    description: String,
    candidateImageIPFS_URL: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const registerCandidate = await contract.registerCandidate(
        votingSessionID,
        candidateName,
        description,
        candidateImageIPFS_URL
      );
      await registerCandidate.wait();
      console.log(registerCandidate);
    } catch (error) {
      setError("Something went wrong in registering candidate");
      throw error;
    }
  };

  const getVotingSessionCandidateCount = async (votingSessionID: number) => {
    try {
      const contract = await connectSmartContract();

      const candidateCount: number =
        await contract.getVotingSessionCandidateCount(votingSessionID);
      console.log(candidateCount);
      return Number(candidateCount);
    } catch (error) {
      setError("Something went wrong in getting candidate count");
      throw error;
    }
  };

  const updateVotingSessionPhase = async (votingSessionID: number) => {
    try {
      const contract = await connectSmartContract();

      const updatePhase = await contract.updateVotingSessionPhase(
        votingSessionID
      );
      await updatePhase.wait();
      console.log(updatePhase);
    } catch (error) {
      setError("Something went wrong in updating voting phase");
      throw error;
    }
  };

  const castVote = async (
    votingSessionID: number,
    voterID: number,
    candidateID: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const voteCasted = await contract.castVote(
        votingSessionID,
        voterID,
        candidateID
      );
      await voteCasted.wait();
      console.log(voteCasted);
    } catch (error) {
      setError("Something went wrong in updating voting phase");
      throw error;
    }
  };

  const getVoterID = async (voterAddress: string) => {
    try {
      const contract = await connectSmartContract();

      const voterDetails = await contract.getVoterDetails(voterAddress);

      console.log("Voter Details");
      console.log(voterDetails);
      return voterDetails[0];
    } catch (error) {
      setError("Something went wrong in getting voter ID");
    }
  };

  const getSingleVoterDetails = async (voterAddress: string) => {
    try {
      const contract = await connectSmartContract();

      const voterDetails = await contract.getVoterDetails(voterAddress);

      console.log("Voter Details");
      console.log(voterDetails);
      return voterDetails;
    } catch (error) {
      setError("Something went wrong in getting single voter details");
    }
  };

  const getVoterVotingSessionDetails = async (
    voterAddress: string,
    votingSessionID: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const voterVSDetails = await contract.getVoterVotingSessionDetails(
        voterAddress,
        votingSessionID
      );

      console.log("Voter Voting Session Details");
      console.log(voterVSDetails);
      return voterVSDetails;
    } catch (error) {
      setError(
        "Something went wrong in getting voter's voting session details"
      );
    }
  };

  // const checkRatingStatus = async (rating: VotingPhase) => {
  //   let num: number = 0;
  //   switch (rating) {
  //     case "Excellent":
  //       num = 4;
  //       break;
  //     case "Good":
  //       num = 3;
  //       break;
  //     case "Fair":
  //       num = 2;
  //       break;
  //     case "Poor":
  //       num = 1;
  //       break;
  //     case "Bad":
  //       num = 0;
  //       break;
  //     default:
  //       console.log("Rating not found");
  //       break;
  //   }
  //   return num;
  // };

  //all-account.tsx
  const getContractOwner = async () => {
    //return: ownerAddress
    try {
      const contract = await connectSmartContract();

      const owner = await contract.getContractOwner();
      console.log(owner);
      return owner;
    } catch (error) {
      setError("Something went wrong in getting contract owner");
    }
  };

  const getFarmDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const farmLength = parseInt(await contract.getFarmTotal());
      const farmAddresses = await contract.getFarmList();
      console.log(farmAddresses);

      const farmDataPromises = farmAddresses.map(async (farmAddress: any) => {
        const singleFarmData = await contract.getFarmData(farmAddress);
        return singleFarmData;
      });

      const farmDataList = await Promise.all(farmDataPromises);

      // singleFarmData (in array form):
      // [farmID : number,
      // farmAddress : String,
      // farmName : String,
      // farmLocation : String]

      //return: farmLength:number, [] of singleFarmData
      return { farmLength, farmDataList };
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getDistributionCenterDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const distributionCenterLength = parseInt(
        await contract.getDistributionCenterTotal()
      );
      const distributionCenterAddresses =
        await contract.getDistributionCenterList();
      console.log(distributionCenterAddresses);

      const distributionCenterDataPromises = distributionCenterAddresses.map(
        async (distributionCenterAddress: any) => {
          const singleDistributionCenterData =
            await contract.getDistributionCenterData(distributionCenterAddress);
          return singleDistributionCenterData;
        }
      );

      const distributionCenterDataList = await Promise.all(
        distributionCenterDataPromises
      );

      // singleDistributionCenterData (in array form):
      // [distributionCenterID : number,
      // distributionCenterAddress : String,
      // distributionCenterName : String,
      // distributionCenterLocation : String]

      //return: distributionCenterLength:number, [] of singleDistributionCenterData
      return { distributionCenterLength, distributionCenterDataList };
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getRetailerDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const retailerLength = parseInt(await contract.getRetailerTotal());
      const retailerAddresses = await contract.getRetailerList();
      console.log(retailerAddresses);

      const retailerDataPromises = retailerAddresses.map(
        async (retailerAddress: any) => {
          const singleRetailerData = await contract.getRetailerData(
            retailerAddress
          );
          return singleRetailerData;
        }
      );

      const retailerDataList = await Promise.all(retailerDataPromises);

      // singleRetailerData (in array form):
      // [retailerID : number,
      // retailerAddress : String,
      // retailerName : String,
      // retailerLocation : String]

      //return: retailerLength:number, [] of singleRetailerData
      return { retailerLength, retailerDataList };
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  const getConsumerDataList = async () => {
    try {
      const contract = await connectSmartContract();

      const consumerLength = parseInt(await contract.getConsumerTotal());
      const consumerAddresses = await contract.getConsumerList();
      console.log(consumerAddresses);

      const consumerDataPromises = consumerAddresses.map(
        async (consumerAddress: any) => {
          const singleConsumerData = await contract.getConsumerData(
            consumerAddress
          );
          return singleConsumerData;
        }
      );

      const consumerDataList = await Promise.all(consumerDataPromises);

      // singleConsumerData (in array form):
      // [consumerID : number,
      // consumerAddress : String,
      // consumerName : String]

      //return: consumerLength:number, [] of singleConsumerData
      return { consumerLength, consumerDataList };
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  //add-account.tsx
  const getFarmTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const farmTotal: number = (await contract.getFarmTotal()).toNumber();
      console.log(farmTotal);
      return farmTotal;
    } catch (error) {
      setError("Something went wrong in checking total farm");
    }
  };

  const addFarm = async (
    farmAddress: String,
    farmName: String,
    farmLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const farm = await contract.addFarm(farmAddress, farmName, farmLocation);
      farm.wait();
      console.log(farm);
    } catch (error) {
      setError("Something went wrong in adding farm");
      throw error;
    }
  };

  const addDistributionCenter = async (
    distributionCenterAddress: String,
    distributionCenterName: String,
    distributionCenterLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const distributionCenter = await contract.addDistributionCenter(
        distributionCenterAddress,
        distributionCenterName,
        distributionCenterLocation
      );
      distributionCenter.wait();
      console.log(distributionCenter);
    } catch (error) {
      setError("Something went wrong in adding distribution center");
      throw error;
    }
  };

  const getDistributionCenterTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const distributionCenterTotal: number = (
        await contract.getDistributionCenterTotal()
      ).toNumber();
      console.log(distributionCenterTotal);
      return distributionCenterTotal;
    } catch (error) {
      setError("Something went wrong in checking total distribution center");
    }
  };

  const addRetailer = async (
    retailerAddress: String,
    retailerName: String,
    retailerLocation: String
  ) => {
    try {
      const contract = await connectSmartContract();

      const retailer = await contract.addRetailer(
        retailerAddress,
        retailerName,
        retailerLocation
      );
      retailer.wait();
      console.log(retailer);
    } catch (error) {
      setError("Something went wrong in adding retailer");
      throw error;
    }
  };

  const getRetailerTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const retailerTotal: number = (
        await contract.getRetailerTotal()
      ).toNumber();
      console.log(retailerTotal);
      return retailerTotal;
    } catch (error) {
      setError("Something went wrong in checking total retailer");
    }
  };

  //add-account.tsx, add-consumer.tsx
  const addConsumer = async (consumerAddress: String, consumerName: String) => {
    try {
      const contract = await connectSmartContract();

      const consumer = await contract.addConsumer(
        consumerAddress,
        consumerName
      );
      consumer.wait();
      console.log(consumer);
    } catch (error) {
      setError("Something went wrong in adding consumer");
      throw error;
    }
  };

  const getConsumerTotal = async () => {
    try {
      const contract = await connectSmartContract();

      const consumerTotal: number = (
        await contract.getConsumerTotal()
      ).toNumber();
      console.log(consumerTotal);
      return consumerTotal;
    } catch (error) {
      setError("Something went wrong in checking total consumer");
    }
  };

  //check.tsx

  // const checkDurianDetails = async (durianId: number) => {
  //   try {
  //     const contract = await connectSmartContract();

  //     const status = await contract.checkDurianStatus(durianId);
  //     console.log(status);

  //     switch (status) {
  //       case 0: {
  //         const farmDetails = await contract.checkDurianFarmDetails(durianId);
  //         return { status, farmDetails };
  //       }
  //       case 1: {
  //         const farmDetails = await contract.checkDurianFarmDetails(durianId);
  //         const DCDetails = await contract.checkDurianDCDetails(durianId);
  //         return { status, farmDetails, DCDetails };
  //       }
  //       case 2: {
  //         const farmDetails = await contract.checkDurianFarmDetails(durianId);
  //         const DCDetails = await contract.checkDurianDCDetails(durianId);
  //         const RTDetails = await contract.checkDurianRTDetails(durianId);
  //         return { status, farmDetails, DCDetails, RTDetails };
  //       }
  //       case 3: {
  //         const farmDetails = await contract.checkDurianFarmDetails(durianId);
  //         const DCDetails = await contract.checkDurianDCDetails(durianId);
  //         const RTDetails = await contract.checkDurianRTDetails(durianId);
  //         const soldDetails = await contract.checkDurianSoldDetails(durianId);
  //         return { status, farmDetails, DCDetails, RTDetails, soldDetails };
  //       }
  //       case 4: {
  //         const farmDetails = await contract.checkDurianFarmDetails(durianId);
  //         const DCDetails = await contract.checkDurianDCDetails(durianId);
  //         const RTDetails = await contract.checkDurianRTDetails(durianId);
  //         const soldDetails = await contract.checkDurianSoldDetails(durianId);
  //         const ratingDetails = await contract.checkDurianRatingDetails(
  //           durianId
  //         );
  //         return {
  //           status,
  //           farmDetails,
  //           DCDetails,
  //           RTDetails,
  //           soldDetails,
  //           ratingDetails,
  //         };
  //       }
  //       default:
  //         console.log("Durian not found");
  //         break;
  //     }
  //   } catch (error) {
  //     setError("Something went wrong in checking durian details");
  //   }
  // };

  //add-durian.tsx
  const addDurian = async (
    farmID: number,
    treeID: number,
    varietyCode: String,
    harvestedTime: number,
    durianImg: String,
    conditionFarm: number
  ) => {
    try {
      const contract = await connectSmartContract();
      // let latestDurianId:number = NaN;
      // contract.on("DurianCreated", (durianId: any) => {
      //   console.log("durianID", durianId);
      //   latestDurianId = durianId;
      // });

      const durian = await contract.addDurian(
        farmID,
        treeID,
        varietyCode,
        harvestedTime,
        durianImg,
        conditionFarm
      );
      await durian.wait();
      console.log(durian);
    } catch (error) {
      setError("Something went wrong in adding durian");
      console.log("final error:", error);
      throw error;
    }
  };

  const checkTotalDurian = async () => {
    try {
      const contract = await connectSmartContract();

      const total: number = (await contract.checkTotalDurian()).toNumber();
      console.log(total);
      return total;
    } catch (error) {
      setError("Something went wrong in checking total durian");
    }
  };

  const getFarmId = async (farmAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const farmId = await contract.getFarmData(farmAddress);

      console.log("farmId", farmId);
      return farmId[0];
    } catch (error) {
      setError("Something went wrong in getting farm ID");
    }
  };

  //catalog.tsx
  const addDurianDCDetails = async (
    durianId: number,
    distributionCenterID: number,
    arrivalTimeDC: number,
    durianImg: String,
    conditionDC: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const catalog = await contract.addDurianDCDetails(
        durianId,
        distributionCenterID,
        arrivalTimeDC,
        durianImg,
        conditionDC
      );
      catalog.wait();
      console.log(catalog);
    } catch (error) {
      setError("Something went wrong in cataloging durian");
      throw error;
    }
  };

  const getDCId = async (DCAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const DCId = await contract.getDistributionCenterData(DCAddress);

      console.log("DCData", DCId);
      return DCId[0];
    } catch (error) {
      setError("Something went wrong in getting farm ID");
    }
  };

  //stock-in.tsx
  const addDurianRTDetails = async (
    durianId: number,
    retailerID: number,
    arrivalTimeRT: number,
    durianImg: String,
    conditionRT: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const stockIn = await contract.addDurianRTDetails(
        durianId,
        retailerID,
        arrivalTimeRT,
        durianImg,
        conditionRT
      );
      stockIn.wait();
      console.log(stockIn);
    } catch (error) {
      setError("Something went wrong in stocking in durian");
      throw error;
    }
  };

  const getRTId = async (RTAddress: String) => {
    try {
      const contract = await connectSmartContract();

      const RTId = await contract.getRetailerData(RTAddress);

      console.log("RTData", RTId);
      return RTId[0];
    } catch (error) {
      setError("Something went wrong in getting farm ID");
    }
  };

  //sell.tsx
  const sellDurian = async (
    durianId: number,
    consumerID: number,
    soldTime: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const sell = await contract.sellDurian(durianId, consumerID, soldTime);
      sell.wait();
      console.log(sell);
    } catch (error) {
      setError("Something went wrong in selling durian");

      throw error;
    }
  };

  //rate.tsx
  const rateDurian = async (
    durianId: number,
    durianImg: String,
    taste: number,
    fragrance: number,
    creaminess: number
  ) => {
    try {
      const contract = await connectSmartContract();

      const rate = await contract.rateDurian(
        durianId,
        durianImg,
        taste,
        fragrance,
        creaminess
      );
      rate.wait();
      console.log(rate);
    } catch (error) {
      setError("Something went wrong in rating durian");
      throw error;
    }
  };

  return (
    <DCastContext.Provider
      value={{
        currentAccount,
        error,
        checkIfWalletIsConnected,
        connectWallet,
        isWalletConnected,
        uploadToIPFS,
        checkAccountType,
        getVotingSessionDetails,
        addAdmin,
        addVoter,
        getVoterCount,
        getContractOwnerAddress,
        getAdminAddresses,
        getVoterDetailsList,
        addVotingSession,
        getVotingSessionCount,
        registerVoter,
        registerCandidate,
        getVotingSessionCandidateCount,
        updateVotingSessionPhase,
        castVote,
        getVoterID,
        getSingleVoterDetails,
        getVoterVotingSessionDetails,
        // checkRatingStatus,
        getContractOwner,
        getFarmDataList,
        getDistributionCenterDataList,
        getRetailerDataList,
        getConsumerDataList,
        // addAdmin,
        addFarm,
        getFarmTotal,
        addDistributionCenter,
        getDistributionCenterTotal,
        addRetailer,
        getRetailerTotal,
        addConsumer,
        getConsumerTotal,
        checkTotalDurian,
        // checkDurianDetails,
        addDurian,
        getFarmId,
        addDurianDCDetails,
        getDCId,
        addDurianRTDetails,
        getRTId,
        sellDurian,
        rateDurian,
      }}
    >
      {children}
    </DCastContext.Provider>
  );
};
