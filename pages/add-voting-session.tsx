import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "../context/DCast";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import router from "next/router";

export default function AddVotingSessionPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    addVotingSession,
    getVotingSessionCount,
    getVotingSessionDetails,
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

  useEffect(() => {
    const currentRole =
      role !== null
        ? ((role.toLowerCase() === "owner" || role.toLowerCase() === "admin"
            ? "admin"
            : role.toLowerCase()) as roles)
        : "guest";
    //Restrict users from accessing unaccessible pages with their roles
    if (role !== null && currentRole != pages["/add-voting-session"].access) {
      router.push("/");
    } else if (role === null) {
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//
  const [votingSessionName, setVotingSessionName] = useState("");
  const [latestVotingSessionId, setLatestVotingSessionId] = useState<
    number | null
  >(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");

    if (votingSessionName === "") {
      toast.dismiss(loadingToast);
      toast.error("Please enter a voting session name");
      return;
    } else {
      try {
        await addVotingSession(votingSessionName);
        const newVotingSessionId = await getVotingSessionCount();
        setLatestVotingSessionId(newVotingSessionId);
        toast.dismiss(loadingToast);
        toast.success("Voting Session added successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Error adding voting session");
        console.log(error);
      }
    }
  };

  return (
    <Layout
      currentPage="/add-voting-session"
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
          {pages["/add-voting-session"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="voting-session-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Voting Session Name
                </label>
                <input
                  type="text"
                  id="voting-session-name"
                  value={votingSessionName}
                  onChange={(e) => setVotingSessionName(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. Lunch Idea"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Add New Session
            </button>
          </form>
        </div>
        {latestVotingSessionId !== null && (
          <div
            className="p-4 mt-6 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">Generated Voting Session ID:</span>{" "}
            {latestVotingSessionId}
          </div>
        )}
      </div>
    </Layout>
  );
}
