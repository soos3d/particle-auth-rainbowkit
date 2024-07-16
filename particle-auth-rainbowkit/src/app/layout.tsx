import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/rainbowKit";
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { BaseSepolia, EthereumSepolia } from "@particle-network/chains";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Particle Auth with RainbowKit",
  description:
    "Demo showcasing how to use the RainbowKit connect kit with Particle Auth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCoreContextProvider
          options={{
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
            clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
            appId: process.env.NEXT_PUBLIC_APP_ID!,
            customStyle: {
              zIndex: 2147483650, // must greater than 2147483646
            },
            themeType: "dark",
            wallet: {
              // Set to false to remove the embedded wallet modal
              visible: true,
              customStyle: {
                // Locks the chain selector to Base Sepolia and Ethereum Sepolia
                supportChains: [EthereumSepolia, BaseSepolia],
              },
            },
          }}
        >
          <Providers>{children}</Providers>
        </AuthCoreContextProvider>
      </body>
    </html>
  );
}
