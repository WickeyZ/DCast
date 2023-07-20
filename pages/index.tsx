import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "@/context/DCast";
import MetamaskHover from "@/components/MetamaskHover";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CheckVotingSessionPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
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

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<string>("");
  const [votingSessionDetails, setVotingSessionDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.ethereum) {
      toast((t) => <MetamaskHover />, {
        icon: "🦊",
      });
      return;
    }

    const loadingToast = toast.loading("Loading...");

    const vsDetails = await getVotingSessionDetails(Number(votingSessionId));

    console.log("Inside promise box voting session details", vsDetails);
    setVotingSessionDetails(vsDetails);
    if (vsDetails === null) {
      setErrorMessage(
        `Voting Session with ID ${votingSessionId} does not exist.`
      );
      toast.dismiss(loadingToast);
      toast.error(`Voting Session with ID ${votingSessionId} not found.`);
      return;
    } else if (vsDetails === undefined) {
      toast.dismiss(loadingToast);
      toast.error(`Something went wrong in fetching voting session details`);
      return;
    }
    setErrorMessage("");
    toast.dismiss(loadingToast);
    toast.success("Details retrieved successfully!");
  };

  console.log("votingSessionDetails", votingSessionDetails);

  return (
    <Layout
      currentPage="/"
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
          {pages["/"].title}
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
                  value={votingSessionId}
                  onChange={(e) => {
                    setVotingSessionId(e.target.value);
                  }}
                  id="voting-session-id"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>

        {votingSessionDetails !== null && (
          <>
            <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "65%" }} />
                </colgroup>
                <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Session Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Session ID
                    </th>
                    <td className="px-6 py-4">
                      {Number(votingSessionDetails.details[0])}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Name
                    </th>
                    <td className="px-6 py-4">
                      {votingSessionDetails.details[1]}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Phase
                    </th>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {Number(votingSessionDetails.details[2]) === 0
                          ? "Registration"
                          : Number(votingSessionDetails.details[2]) === 1
                          ? "Voting"
                          : "Close"}
                      </span>
                    </td>
                  </tr>
                  <tr
                    className={`bg-white ${
                      votingSessionDetails.details[2] === 0 ? "" : "border-b"
                    } dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Registration Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        Number(votingSessionDetails.details[3]) * 1000
                      ).toLocaleDateString()} ${new Date(
                        Number(votingSessionDetails.details[3]) * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`}
                    </td>
                  </tr>
                  {(votingSessionDetails.details[2] === 1 ||
                    votingSessionDetails.details[2] === 2) && (
                    <tr
                      className={`bg-white ${
                        votingSessionDetails.details[2] === 2 ? "border-b" : ""
                      } dark:bg-gray-800 dark:border-gray-700`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Voting Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          Number(votingSessionDetails.details[4]) * 1000
                        ).toLocaleDateString()} ${new Date(
                          Number(votingSessionDetails.details[4]) * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                  )}
                  {votingSessionDetails.details[2] === 2 && (
                    <tr className="bg-white dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Close Date & Time
                      </th>
                      <td className="px-6 py-4">
                        {`${new Date(
                          Number(votingSessionDetails.details[5]) * 1000
                        ).toLocaleDateString()} ${new Date(
                          Number(votingSessionDetails.details[5]) * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Candidate Details
            </h2>
            {votingSessionDetails.candidateDetails.length > 0 ? (
              <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "33%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "20%" }} />
                  </colgroup>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        CANDIDATE ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        NAME
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        DESCRIPTION
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTE COUNT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {votingSessionDetails.candidateDetails.map(
                      (candidateData: any, index: any) => (
                        <tr
                          key={`${index}-voter`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">
                            {Number(candidateData[0])}
                          </td>
                          <td className="px-4 py-4 flex items-center gap-4 capitalize font-bold text-gray-900">
                            <img
                              src={candidateData[3]}
                              alt="candidate image"
                              className="w-14 h-14 rounded-full object-contain"
                            />
                            {candidateData[1]}
                          </td>
                          <td className="px-6 py-4">{candidateData[2]}</td>
                          <td className="px-6 py-4">
                            {Number(candidateData[4])}
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              if (votingSessionDetails.details[2] === 2) {
                                for (const winnerId of votingSessionDetails.winnerCandidateIds) {
                                  if (
                                    Number(candidateData[0]) ===
                                    Number(winnerId)
                                  ) {
                                    return (
                                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                        Won
                                      </span>
                                    );
                                  }
                                }
                                return (
                                  <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    Lose
                                  </span>
                                );
                              }
                              return (
                                <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                                  -
                                </span>
                              );
                            })()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no candidates registered.
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Voter Details
            </h2>
            {votingSessionDetails.voterDetails.length > 0 ? (
              <div className="relative overflow-x-auto rounded-lg border shadow mt-8 text-sm font-medium mr-2">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTER ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        ACCOUNT ADDRESS
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        WEIGHT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTED CANDIDATE ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {votingSessionDetails.voterDetails.map(
                      (voterData: any, index: any) => (
                        <tr
                          key={`${index}-voter`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="px-6 py-4">{Number(voterData[0])}</td>
                          <td className="px-6 py-4">{voterData[1]}</td>
                          {
                            <>
                              <td className="px-6 py-4">
                                {Number(
                                  votingSessionDetails.voterVSDetails[index][0]
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`${
                                    Number(
                                      votingSessionDetails.voterVSDetails[
                                        index
                                      ][1]
                                    ) === 0
                                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  } text-sm font-medium mr-2 px-2.5 py-0.5 rounded`}
                                >
                                  {Number(
                                    votingSessionDetails.voterVSDetails[
                                      index
                                    ][1]
                                  ) === 0
                                    ? "No Vote"
                                    : `Voted: ${Number(
                                        votingSessionDetails.voterVSDetails[
                                          index
                                        ][1]
                                      )}`}
                                </span>
                              </td>
                            </>
                          }
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no voter accounts registered.
              </div>
            )}
          </>
        )}

        {errorMessage !== "" && votingSessionDetails === null && (
          <div className="mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
