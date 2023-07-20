import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "../context/DCast";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import router from "next/router";

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
  const [role, setRole] = useState<roles | null | undefined>(undefined);

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

  useEffect(() => {
    const currentRole =
      role !== null && role !== undefined
        ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
            ? "admin"
            : role.toLowerCase()) as roles)
        : role === null
        ? "guest"
        : undefined;
    //Restrict users from accessing unaccessible pages with their roles
    if (role !== undefined && currentRole != pages["/cast-vote"].access) {
      toast.error("You have no access to that page.");
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<number>();
  const [candidateId, setCandidateId] = useState<number>();
  const [voterId, setVoterId] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [voteCasted, setVoteCasted] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");

    try {
      //! votingSessionExists(_votingSessionID)
      const maxVotingSessionId = await getVotingSessionCount();
      if (
        Number(votingSessionId) > maxVotingSessionId ||
        Number(votingSessionId) < 1
      ) {
        setVoteCasted(0);
        setErrorMessage(`Voting Session ${votingSessionId} does not exist`);
        toast.dismiss(loadingToast);
        toast.error(`Voting Session ${votingSessionId} does not exist`);
        return;
      }

      //! votingPhaseIsVoting(_votingSessionID)
      const currentPhase = Number(
        (await getVotingSessionDetails(Number(votingSessionId))).details[2]
      );
      console.log(currentPhase);
      if (currentPhase !== 1) {
        setVoteCasted(0);
        setErrorMessage(
          `Voting Session ${votingSessionId} phase is not Voting`
        );
        toast.dismiss(loadingToast);
        toast.error(`Voting Session ${votingSessionId} phase is not Voting`);
        return;
      }

      //! onlyVotingSessionVoter(_votingSessionID)
      const votingSessionVoters = (
        await getVotingSessionDetails(votingSessionId)
      ).voterDetails;

      if (votingSessionVoters === undefined) {
        setVoteCasted(0);
        setErrorMessage(`You're not in Voting Session ${votingSessionId}`);
        toast.dismiss(loadingToast);
        toast.error(`You're not in Voting Session ${votingSessionId}`);
        return;
      }

      let voterInSession = false;
      for (let i = 0; i < votingSessionVoters.length; i++) {
        if (Number(votingSessionVoters[i][0]) === voterId) {
          voterInSession = true;
        }
      }

      if (!voterInSession) {
        setVoteCasted(0);
        setErrorMessage(`You're not in Voting Session ${votingSessionId}`);
        toast.dismiss(loadingToast);
        toast.error(`You're not in Voting Session ${votingSessionId}`);
        return;
      }

      //! voterNotVoted(_votingSessionID)
      const voterVoted = (await getVotingSessionDetails(votingSessionId))
        .voterVSDetails[Number(voterId) - 1][1];

      if (Number(voterVoted)) {
        setVoteCasted(0);
        setErrorMessage(`You had already voted before`);
        toast.dismiss(loadingToast);
        toast.error(`You had already voted before`);
        return;
      }

      //! candidateExists(_votingSessionID, _candidateID)
      const votingSessionCandidates = (
        await getVotingSessionDetails(votingSessionId)
      ).candidateDetails;

      if (votingSessionCandidates === undefined) {
        setVoteCasted(0);
        setErrorMessage(
          `No Candidate ${candidateId} in Voting Session ${votingSessionId}`
        );
        toast.dismiss(loadingToast);
        toast.error(
          `No Candidate ${candidateId} in Voting Session ${votingSessionId}`
        );
        return;
      }

      let candidateInSession = false;

      for (let i = 0; i < votingSessionCandidates.length; i++) {
        if (Number(votingSessionCandidates[i][0]) === candidateId) {
          candidateInSession = true;
        }
      }

      if (!candidateInSession) {
        setVoteCasted(0);
        setErrorMessage(
          `No Candidate ${candidateId} in Voting Session ${votingSessionId}`
        );
        toast.dismiss(loadingToast);
        toast.error(
          `No Candidate ${candidateId} in Voting Session ${votingSessionId}`
        );
        return;
      }

      //End validation

      await castVote(
        Number(votingSessionId),
        Number(voterId),
        Number(candidateId)
      );
      setVoteCasted(Number(candidateId));
      setErrorMessage("");
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
      getVoterID(currentAccount).then((voterId?) => {
        setVoterId(Number(voterId));
      });
    }
  }, [currentAccount]);

  return (
    <Layout
      currentPage="/cast-vote"
      currentRole={
        role !== null && role !== undefined
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
              <div className="col-span-1 grid gap-6">
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
                    onChange={(e) =>
                      setVotingSessionId(parseInt(e.target.value))
                    }
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
                    Candidate ID
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
            </div>

            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Cast Vote
            </button>
          </form>
        </div>
        {errorMessage !== "" && (
          <div className="mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        {voteCasted !== 0 && errorMessage === "" ? (
          <div
            className="p-4 mt-6 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">Vote Casted to Candidate </span>{" "}
            {voteCasted}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
}
