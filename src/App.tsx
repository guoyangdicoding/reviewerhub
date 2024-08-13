import Home from "./pages/Home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { baseSepolia, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { watchAccount } from "@wagmi/core";
import { switchChain } from "@wagmi/core";

import "./App.css";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import About from "./pages/About";
import Faq from "./pages/Faq";
import { useEffect, useState } from "react";
import HowItWorks from "./pages/HowItWorks";
import AddCompany from "./pages/AddCompany";
import CompanyList from "./pages/ManageCompany";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./shared/components/ProtectedRoute";

const queryClient = new QueryClient();

const projectId = "a4fb9360f196efc572542e470e026a2c";

const metadata = {
  name: "Review App",
  description: "Review App",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [baseSepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
});

watchAccount(config, {
  async onChange(data) {
    if (data.chain?.name != "baseSepolia") {
      await switchChain(config, {
        chainId: baseSepolia.id,
      });
    }
  },
});

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "companies",
      Component: Companies,
    },
    {
      path: "about",
      Component: About,
    },
    {
      path: "faq",
      Component: Faq,
    },
    {
      path: "how-it-works",
      Component: HowItWorks,
    },
    {
      path: "/:id",
      Component: CompanyProfile,
    },
    {
      path: "add-company",
      Component: () => (
        <ProtectedRoute>
          <AddCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: "manage-companies",
      Component: () => (
        <ProtectedRoute>
          <CompanyList />
        </ProtectedRoute>
      ),
    },
    {
      path: "admin-login",
      Component: AdminLogin,
    },
  ]);

  const [show, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 1000);
  }, []);

  return (
    show && (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />

          <ToastContainer />
        </QueryClientProvider>
      </WagmiProvider>
    )
  );
}

export default App;
