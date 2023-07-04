import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "../context/DCast";
import { useContext, useEffect, useState } from "react";
import { VotingPhase } from "@/types";
import toast from "react-hot-toast";
import router from "next/router";

export default function UpdateVotingPhasePage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    updateVotingSessionPhase,
    getVotingSessionDetails,
    getVotingSessionCount,
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
    if (
      role !== undefined &&
      currentRole != pages["/update-voting-phase"].access
    ) {
      toast.error("You have no access to that page.");
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<number>();
  const [latestPhase, setLatestPhase] = useState<VotingPhase>();
  const [currentPhaseString, setCurrentPhaseString] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const checkCurrentPhaseString = async (currentPhase: number) => {
    switch (currentPhase) {
      case 0:
        setCurrentPhaseString("Registration");
        return "Registration";
      case 1:
        setCurrentPhaseString("Voting");
        return "Voting";
      case 2:
        setCurrentPhaseString("Close");
        return "Close";
    }
  };

  const handleSubmit = async (buttonClicked: string) => {
    let loadingToast;
    if (!isNaN(votingSessionId as number)) {
      loadingToast = toast.loading("Loading...");
    } else {
      return;
    }
    try {
      const maxVotingSessionId = await getVotingSessionCount();
      if (
        (votingSessionId as number) > maxVotingSessionId ||
        (votingSessionId as number) < 1
      ) {
        //! votingSessionExists
        setErrorMessage(
          `Voting Session with ID ${votingSessionId} does not exist.`
        );
        toast.dismiss(loadingToast);
        toast.error(`Voting Session ${votingSessionId} does not exist`);
        return;
      }

      const currentPhase = (
        await getVotingSessionDetails(votingSessionId as number)
      ).details[2];

      if (buttonClicked === "checkPhase") {
        const phaseString = await checkCurrentPhaseString(currentPhase);
        setErrorMessage("");
        toast.dismiss(loadingToast);
        toast.success(`Current phase is '${phaseString}'`);
      }

      if (buttonClicked === "updatePhase") {
        if (currentPhase === 2) {
          //! votingPhaseIsNotClose
          setErrorMessage("Voting Phase is already 'Close'");
          toast.dismiss(loadingToast);
          toast.error("Phase is already 'Close'");
          return;
        }

        if (currentPhase === 0) {
          //! atLeast1CandidateAnd1VoterRegistered
          const votingSessionVoterLength = (
            await getVotingSessionDetails(votingSessionId)
          ).voterDetails.length;
          const votingSessionCandidateLength = (
            await getVotingSessionDetails(votingSessionId)
          ).candidateDetails.length;
          if (votingSessionCandidateLength === 0) {
            setErrorMessage(`At least 1 candidate should be registered.`);
            toast.dismiss(loadingToast);
            toast.error(`Not enough candidate registered`);
            return;
          }
          if (votingSessionVoterLength === 0) {
            setErrorMessage(`At least 1 voter should be registered.`);
            toast.dismiss(loadingToast);
            toast.error(`Not enough voter registered`);
            return;
          }
        }

        await updateVotingSessionPhase(votingSessionId as number);
        setErrorMessage("");
        const updatedPhase = (
          await getVotingSessionDetails(votingSessionId as number)
        ).details[2];
        const phaseString = await checkCurrentPhaseString(updatedPhase);
        toast.dismiss(loadingToast);
        toast.success(`Phase updated to '${phaseString}'`);
      }
    } catch (error) {
      console.error(error);
      if (votingSessionId === undefined) {
        return;
      }
      if (buttonClicked === "updatePhase") {
        toast.dismiss(loadingToast);
        toast.error("Error updating voting phase");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Error checking voting phase");
      }
      return;
    }
  };

  return (
    <Layout
      currentPage="/update-voting-phase"
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
          {pages["/update-voting-phase"].title}
        </h1>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
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
                  value={votingSessionId}
                  onChange={(e) => setVotingSessionId(parseInt(e.target.value))}
                  id="durian-id"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={() => handleSubmit("checkPhase")}
              className="text-primary rounded-lg bg-white border-primary rounded border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800 mb-4 mr-4 "
            >
              Check Phase
            </button>
            <button
              type="submit"
              onClick={() => handleSubmit("updatePhase")}
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Update Phase
            </button>
          </form>
        </div>

        {errorMessage === "" && currentPhaseString !== "" && (
          <div className="mt-8 text-sm text-left text-gray-900 dark:text-gray-400 flex items-center">
            <p className="mr-2">Current Phase:</p>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {currentPhaseString}
            </span>
          </div>
        )}

        {errorMessage !== "" && (
          <div className="mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
