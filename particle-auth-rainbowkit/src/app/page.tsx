"use client";

// Particle imports
import { particleWagmiWallet } from "@/particleWallet/particleWagmiWallet";
import {
  AuthCoreEvent,
  getLatestAuthType,
  isSocialAuthType,
  particleAuth,
  type SocialAuthType,
} from "@particle-network/auth-core";
import {
  useConnect as useParticleConnect,
  useAuthCore,
  useEthereum,
} from "@particle-network/auth-core-modal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import { ethers, type Eip1193Provider } from "ethers"; // Eip1193Provider is the interface for the injected BrowserProvider

// UI component to display links to the Particle sites
import LinksGrid from "../components/Links";
import Header from "../components/Header";
import TxNotification from "../components/TxNotification";

// Import the utility functions
import { formatBalance } from "../utils/utils";

export default function Home() {
  // Essential states
  const { userInfo } = useAuthCore();
  const { provider, chainInfo, signMessage, address } = useEthereum();
  const [recipientAddress, setRecipientAddress] = useState<string>(""); // states to get the address to send tokens to from the UI
  const [selectedProvider, setSelectedProvider] = useState<string>("ethers"); // states to handle which providers signs the message

  // UX states
  const [balance, setBalance] = useState<string>(""); // states for fetching and display the balance
  const [transactionHash, setTransactionHash] = useState<string | null>(null); // states for the transaction hash
  const [isSending, setIsSending] = useState<boolean>(false); // state to display 'Sending...' while waiting for a hash

  // start: fix social auth login
  const { connect } = useConnect();
  const { connectionStatus } = useParticleConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (
      connectionStatus === "connected" &&
      isSocialAuthType(getLatestAuthType())
    ) {
      connect({
        connector: particleWagmiWallet({
          socialType: getLatestAuthType() as SocialAuthType,
        }),
      });
    }
    const onDisconnect = () => {
      disconnect();
    };
    particleAuth.on(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
    return () => {
      particleAuth.off(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
    };
  }, [connect, connectionStatus, disconnect]);
  // end: fix social auth login

  // Create provider instance with ethers V6
  // use new ethers.providers.Web3Provider(provider, "any"); for Ethers V5
  const ethersProvider = new ethers.BrowserProvider(
    provider as Eip1193Provider,
    "any"
  );

  // Fetch the balance when userInfo or chainInfo changes
  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo, chainInfo]);

  // Fetch the user's balance in Ether
  const fetchBalance = async () => {
    try {
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const balanceResponse = await ethersProvider.getBalance(address);
      const balanceInEther = ethers.formatEther(balanceResponse); // ethers V5 will need the utils module for those convertion operations
      console.log(address, balanceInEther);

      // Format the balance using the utility function
      const fixedBalance = formatBalance(balanceInEther);
      setBalance(fixedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Execute an Ethereum transaction
  // Simple transfer in this example
  const executeTxEvm = async () => {
    setIsSending(true);
    const signer = await ethersProvider.getSigner();
    const tx = {
      to: recipientAddress,
      value: ethers.parseEther("0.01"),
      data: "0x", // data is needed only when interacting with smart contracts. 0x equals to zero and it's here for demonstration only
    };

    try {
      const txResponse = await signer.sendTransaction(tx);
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setTransactionHash(txReceipt.hash);
      } else {
        console.error("Transaction receipt is null");
      }
    } catch (error) {
      console.error("Error executing EVM transaction:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Sign a message using ethers as provider
  const signMessageEthers = async () => {
    const signer = await ethersProvider.getSigner();
    const signerAddress = await signer.getAddress();

    const message = "Gm Particle! Signing with ethers.";

    try {
      const result = await signMessage(message);
      alert(`Signed Message: ${result} by address ${signerAddress}.`);
    } catch (error: any) {
      // This is how you can display errors to the user
      alert(`Error with code ${error.code}: ${error.message}`);
      console.error("personal_sign", error);
    }
  };

  // Sign message using Particle Auth Natively
  const signMessageParticle = async () => {
    const message = "Gm Particle! Signing with Particle Auth.";

    try {
      const result = await signMessage(message);
      alert(`Signed Message: ${result} by address ${address}.`);
    } catch (error: any) {
      // This is how you can display errors to the user
      alert(`Error with code ${error.code}: ${error.message}`);
      console.error("personal_sign", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-black text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        <div className="p-4">
          <ConnectButton />
        </div>
        {!userInfo ? (
          <div className="text-center">
            <p className="text-lg font-semibold mb-2 ">
              Connect your wallet to continue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="border border-purple-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Accounts info
              </h2>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold mb-2 text-white mr-2">
                  Name: {userInfo.name}
                </h2>
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-white">
                Status: {connectionStatus}
              </h2>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-purple-400 mr-2">
                  Balance: {balance} {chainInfo.nativeCurrency.symbol}
                </h3>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
                  onClick={fetchBalance}
                >
                  🔄
                </button>
              </div>
            </div>
            <div className="border border-purple-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Send a transaction
              </h2>
              <h2 className="text-lg">Send 0.01 ETH</h2>
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="mt-4 p-2 w-full rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                onClick={executeTxEvm}
                disabled={!recipientAddress || isSending}
              >
                {isSending ? "Sending..." : "Send 0.01 ETH"}
              </button>
              {transactionHash && (
                <TxNotification
                  hash={transactionHash}
                  blockExplorerUrl={chainInfo.blockExplorerUrl}
                />
              )}
            </div>
            <div className="border border-purple-500 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Sign a Message</h2>
              <p className="text-lf">Pick a provider to sign with:</p>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mt-4 p-2 w-full rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="ethers">Ethers Provider</option>
                <option value="particle">Particle Auth</option>
              </select>
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                onClick={
                  selectedProvider === "ethers"
                    ? signMessageEthers
                    : signMessageParticle
                }
              >
                Sign Message
              </button>
            </div>
          </div>
        )}
        <LinksGrid />
      </main>
    </div>
  );
}
