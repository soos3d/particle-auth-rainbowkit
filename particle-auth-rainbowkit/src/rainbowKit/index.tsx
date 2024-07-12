"use client";

import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  rabbyWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";
import {
  particleGoogleWallet,
  particleTwitterWallet,
  particleWallet,
  particleGithHubrWallet,
} from "../particleWallet";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [particleWallet, rainbowWallet],
    },
    {
      groupName: "Social Logins",
      wallets: [
        particleGoogleWallet,
        particleTwitterWallet,
        particleGithHubrWallet,
      ],
    },
    {
      groupName: "Other options",
      wallets: [metaMaskWallet, walletConnectWallet, rabbyWallet, trustWallet],
    },
  ],
  {
    appName: "Particle Auth with Rainbowkit",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  }
);

const config = createConfig({
  connectors,
  chains: [sepolia, baseSepolia],
  transports: {
    [sepolia.id]: http("https://sepolia.etherscan.io/"),
    [baseSepolia.id]: http("https://basescan.org/"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
