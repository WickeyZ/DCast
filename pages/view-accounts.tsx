import Layout, { pages, roles } from "@/components/layout/Layout";
import { DCastContext } from "@/context/DCast";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewAccountsPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    getContractOwnerAddress,
    getAdminAddresses,
    getVoterDetailsList,
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
    if (role !== undefined && currentRole != pages["/view-accounts"].access) {
      toast.error("You have no access to that page.");
      router.push("/");
    }
  }, [role]);

  console.log("role", role);
  // ---------------------------------------------------------------------//

  const [isLoaded, setIsLoaded] = useState(false);
  const [contractOwnerAddress, setContractOwnerAddress] = useState("");
  const [adminAddresses, setAdminAddresses] = useState<string[]>([]);
  const [voterDetailsList, setVoterDetailsList] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Loading...");

    try {
      const contractOwnerAddress = await getContractOwnerAddress();
      setContractOwnerAddress(contractOwnerAddress);

      const adminAddresses = await getAdminAddresses();
      setAdminAddresses(adminAddresses);

      const { voterDetailsList } = await getVoterDetailsList();
      setVoterDetailsList(voterDetailsList);

      setIsLoaded(true);
      toast.dismiss(loadingToast);
      toast.success("Accounts retrieved successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error retrieving accounts");
    }
  };

  return (
    <Layout
      currentPage="/view-accounts"
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
          {pages["/view-accounts"].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              View
            </button>
          </form>
        </div>

        {isLoaded && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Admin Accounts
            </h2>
            <div className="relative overflow-x-auto">
              <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ACCOUNT ADDRESS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 flex items-center">
                      {contractOwnerAddress}
                      <span className="ml-2 whitespace-nowrap bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        Contract Owner
                      </span>
                    </td>
                  </tr>
                  {adminAddresses
                    .map((address, index) => (
                      <tr
                        key={`${index}-${address}`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{address}</td>
                      </tr>
                    ))
                    .slice(1)}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Voter Accounts
            </h2>
            {voterDetailsList.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTER ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ACCOUNT ADDRESS
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        VOTING SESSIONS PARTICIPATED
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voterDetailsList.map((voterData, index) => (
                      <tr
                        key={`${index}-voter`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{voterData[0].toNumber()}</td>
                        <td className="px-6 py-4">{voterData[1]}</td>
                        <td className="px-6 py-4">{voterData[2].length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no voter accounts yet.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
