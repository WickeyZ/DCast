import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "../context/DCast";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import router from "next/router";

type RegisterRoles = "VOTER" | "CANDIDATE";

export default function RegisterVoterCandidatePage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    registerVoter,
    registerCandidate,
    getVotingSessionCandidateCount,
    getVoterCount,
    getVotingSessionCount,
    getVotingSessionDetails,
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
      currentRole != pages["/register-voter-candidate"].access
    ) {
      toast.error("You have no access to that page.");
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [votingSessionId, setVotingSessionId] = useState<number>();
  const [voterId, setVoterId] = useState<number>();
  const [votingWeight, setVotingWeight] = useState<number>();
  const [latestCandidateId, setLatestCandidateId] = useState<number>();
  const [candidateName, setCandidateName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [registerRoleType, setRegisterRoleType] =
    useState<RegisterRoles>("VOTER");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegisterRoleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRegisterRoleType(e.target.value as RegisterRoles);
  };

  const { uploadToIPFS } = useContext(DCastContext);

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    const uploadingToast = toast.loading("Uploading...");
    try {
      const url = await uploadToIPFS(acceptedFiles[0]);
      setFileUrl(url);
      toast.dismiss(uploadingToast);
      toast.success("Image uploaded");
    } catch (error) {
      toast.dismiss(uploadingToast);
      toast.error("Error uploading image");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5000000,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");
    const maxVotingSessionId = await getVotingSessionCount();

    const currentPhase = Number(
      (await getVotingSessionDetails(Number(votingSessionId))).details[2]
    );
    console.log(currentPhase);
    if (currentPhase !== 0) {
      setErrorMessage(
        `Voting Session ${votingSessionId} phase is not Registration`
      );
      toast.dismiss(loadingToast);
      toast.error(
        `Voting Session ${votingSessionId} phase is not Registration`
      );
      return;
    }

    if (
      Number(votingSessionId) > maxVotingSessionId ||
      Number(votingSessionId) < 1
    ) {
      setErrorMessage(`Voting Session ${votingSessionId} does not exist`);
      toast.dismiss(loadingToast);
      toast.error(`Voting Session ${votingSessionId} does not exist`);
      return;
    }
    if (registerRoleType === "VOTER") {
      try {
        const maxVoterId = await getVoterCount();
        if (Number(voterId) > maxVoterId || Number(voterId) < 1) {
          setErrorMessage(`Voter ${voterId} does not exist`);
          toast.dismiss(loadingToast);
          toast.error(`Voter ${voterId} does not exist`);
          return;
        }
        if (Number(votingWeight) < 1) {
          setErrorMessage(`Voting weight must be more than 0`);
          toast.dismiss(loadingToast);
          toast.error("Voting weight must be more than 0");
          return;
        }
        const votingSessionVoters = (
          await getVotingSessionDetails(votingSessionId)
        ).voterDetails;
        if (votingSessionVoters != undefined) {
          for (let i = 0; i < votingSessionVoters.length; i++) {
            if (Number(votingSessionVoters[i][0]) === voterId) {
              setErrorMessage(
                `Voter ${voterId} registered in Voting Session ${votingSessionId}`
              );
              toast.dismiss(loadingToast);
              toast.error(
                `Voter ${voterId} registered in Voting Session ${votingSessionId}`
              );
              return;
            }
          }
        }

        await registerVoter(
          Number(votingSessionId),
          Number(voterId),
          Number(votingWeight)
        );
        setErrorMessage("");
        toast.dismiss(loadingToast);
        toast.success("Voter registered successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Error registering voter");
        console.log(error);
      }
    } else if (registerRoleType === "CANDIDATE") {
      try {
        if (!fileUrl) {
          setErrorMessage("Please upload an image of the candidate");
          toast.dismiss(loadingToast);
          toast.error("Please upload an image of the candidate");
          return;
        }
        await registerCandidate(
          Number(votingSessionId),
          candidateName as string,
          description as string,
          fileUrl
        );
        const newCandidateId = await getVotingSessionCandidateCount(
          Number(votingSessionId)
        );
        console.log(newCandidateId);
        setLatestCandidateId(newCandidateId);
        setErrorMessage("");
        toast.dismiss(loadingToast);
        toast.success("Candidate registered successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Error registering candidate");
        console.log(error);
      }
    }
  };

  return (
    <Layout
      currentPage="/register-voter-candidate"
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
          {pages["/register-voter-candidate"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="register-role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Register Role
                </label>
                <select
                  id="register-role"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Voter/Candidate"
                  value={registerRoleType}
                  onChange={handleRegisterRoleChange}
                >
                  <option value="VOTER">Voter</option>
                  <option value="CANDIDATE">Candidate</option>
                </select>
              </div>

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
              {registerRoleType === "VOTER" ? (
                <>
                  <div>
                    <label
                      htmlFor="voter-id"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Voter ID
                    </label>
                    <input
                      type="number"
                      id="voter-id"
                      value={voterId}
                      onChange={(e) => setVoterId(parseInt(e.target.value))}
                      className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="e.g. 1"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="voting-weight"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Voting Weight
                    </label>
                    <input
                      type="number"
                      id="voting-weight"
                      value={votingWeight}
                      onChange={(e) =>
                        setVotingWeight(parseInt(e.target.value))
                      }
                      className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="e.g. 1"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="candidate-name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      id="candidate-name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="e.g. Chicken Burger"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="e.g. chicken patty, perfectly seasoned"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Candidate Image
                    </label>
                    <div
                      className="flex cursor-pointer justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div>
                        <div>
                          {fileUrl ? (
                            <img
                              src={fileUrl}
                              className="mx-auto mb-3 h-32 w-32 object-contain border text-gray-400"
                            />
                          ) : (
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12h-4a8 8 0 00-8 8v12a8 8 0 008 8h16a8 8 0 008-8V20a8 8 0 00-8-8h-4"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 20h4l2 2 4-4 4 4 2-2h4"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="rounded-md font-medium text-blue-600 hover:text-blue-500">
                              Upload a file
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, GIF, WEBM up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Register
            </button>
          </form>
        </div>
        {latestCandidateId && registerRoleType === "CANDIDATE" ? (
          <div
            className="p-4 mt-6 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">Generated Candidate ID:</span>{" "}
            {latestCandidateId}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
}
