import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "../context/DCast";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CastVotePage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    castVote,
    getVotingSessionDetails,
    getVotingSessionCount,
    getVoterID,
  } = useContext(DCastContext);
  const [role, setRole] = useState<roles | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (currentAccount) {
      console.log("currentAccount", currentAccount);

      checkAccountType(currentAccount).then((accountType) => {
        setRole(accountType as roles);
      });
    } else {
      setRole(null);
    }
  }, [currentAccount]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<number>();
  const [candidateId, setCandidateId] = useState<number>();
  const [voterId, setVoterId] = useState<number>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");

    try {
      //! votingSessionExists(_votingSessionID)
      const maxVotingSessionId = await getVotingSessionCount();
      if (
        (votingSessionId as number) > maxVotingSessionId ||
        (votingSessionId as number) < 1
      ) {
        toast.dismiss(loadingToast);
        toast.error(`Voting Session ${votingSessionId} does not exist`);
        return;
      }

      //! onlyVotingSessionVoter(_votingSessionID)
      const votingSessionVoters = (
        await getVotingSessionDetails(votingSessionId)
      ).voterDetails;

      if (votingSessionVoters === undefined) {
        toast.dismiss(loadingToast);
        toast.error(
          `You're not registered in Voting Session ${votingSessionId}`
        );
        return;
      }

      let voterInSession = false;
      for (let i = 0; i < votingSessionVoters.length; i++) {
        if (votingSessionVoters[i][0].toNumber() === voterId) {
          voterInSession = true;
        }
      }

      if (!voterInSession) {
        toast.dismiss(loadingToast);
        toast.error(
          `You're not registered in Voting Session ${votingSessionId}`
        );
        return;
      }

      //! candidateExists(_votingSessionID, _candidateID)
      const votingSessionCandidates = (
        await getVotingSessionDetails(votingSessionId)
      ).candidateDetails;

      if (votingSessionCandidates === undefined) {
        toast.dismiss(loadingToast);
        toast.error(
          `Candidate ${candidateId} is not registered in Voting Session ${votingSessionId}`
        );
        return;
      }

      let candidateInSession = false;

      for (let i = 0; i < votingSessionCandidates.length; i++) {
        if (votingSessionCandidates[i][0].toNumber() === voterId) {
          candidateInSession = true;
        }
      }

      if (!candidateInSession) {
        toast.dismiss(loadingToast);
        toast.error(
          `Candidate ${candidateId} is not registered in Voting Session ${votingSessionId}`
        );
        return;
      }

      //End validation

      await castVote(
        votingSessionId as number,
        voterId as number,
        candidateId as number
      );
      toast.dismiss(loadingToast);
      toast.success("Vote casted successfully!");
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Error casting vote");
      return;
    }
  };

  useEffect(() => {
    if (currentAccount) {
      getVoterID(currentAccount).then((voterId) => {
        setVoterId(voterId.toString());
      });
    }
  }, [currentAccount]);

  return (
    <Layout
      currentPage="/cast-vote"
      currentRole={
        role !== null
          ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
              ? "admin"
              : role.toLowerCase()) as roles)
          : "guest"
      }
    >
      <div className="p-4 md:ml-80">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages["/cast-vote"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="voting-session-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Voting Session ID
                </label>
                <input
                  type="number"
                  id="voting-session-id"
                  value={votingSessionId}
                  onChange={(e) => setVotingSessionId(parseInt(e.target.value))}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="candidate-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Voting Session ID
                </label>
                <input
                  type="number"
                  id="candidate-id"
                  value={candidateId}
                  onChange={(e) => setCandidateId(parseInt(e.target.value))}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Cast Vote
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
