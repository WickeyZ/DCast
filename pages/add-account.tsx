import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "@/context/DCast";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Roles = "ADMIN" | "VOTER";

export default function AddAccountPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    addAdmin,
    addVoter,
    getVoterCount,
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
  // ---------------------------------------------------------------------//

  const [accountAddress, setAccountAddress] = useState("");
  const [accountType, setAccountType] = useState<Roles>("ADMIN");
  const [latestVoterId, setLatestVoterId] = useState<number | null>(null);

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value as Roles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountAddress === "") {
      toast.error("Please enter an account address");
      return;
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(accountAddress)) {
      toast.error("Please enter a valid account address");
      return;
    } else if (accountAddress.toLowerCase() === currentAccount) {
      toast.error("You cannot add your own account");
      return;
    } else {
      try {
        if (accountType === "ADMIN") {
          if (
            (await checkAccountType(accountAddress)) === "Admin" ||
            (await checkAccountType(accountAddress)) === "Owner"
          ) {
            toast.error("This account is already an admin");
            return;
          }
          await addAdmin(accountAddress);
          toast.success("Admin added successfully!");
        } else if (accountType === "VOTER") {
          if ((await checkAccountType(accountAddress)) === "Voter") {
            toast.error("This account is already a voter");
            return;
          } else if (
            (await checkAccountType(accountAddress)) === "Admin" ||
            (await checkAccountType(accountAddress)) === "Owner"
          ) {
            toast.error("This account is already an admin");
            return;
          }
          await addVoter(accountAddress);
          const newVoterId = await getVoterCount();
          setLatestVoterId(newVoterId);
          toast.success("Voter added successfully!");
        }
      } catch (error) {
        toast.error("Error adding account");
      }
    }
  };

  return (
    <Layout
      currentPage="/add-account"
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
          {pages["/add-account"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="account-type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Account Type
                </label>
                <select
                  id="account-type"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="Admin/Voter"
                  value={accountType}
                  onChange={handleAccountTypeChange}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="VOTER">Voter</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="account-address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Account Address
                </label>
                <input
                  type="text"
                  id="account-address"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Add Account
            </button>
          </form>
        </div>
        {latestVoterId !== null && (
          <div
            className="p-4 mt-6 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">Generated voter ID:</span>{" "}
            {latestVoterId}
          </div>
        )}
      </div>
    </Layout>
  );
}
