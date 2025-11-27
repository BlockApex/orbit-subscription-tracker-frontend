"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/services/auth.service";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { getMySubscriptions } from "@/services/subscription.service";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";
const network =
  (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK as
    | "sapphire_devnet"
    | "sapphire_mainnet") || "sapphire_devnet";

const solanaConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3", // Solana Devnet
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorer: "https://explorer.solana.com?cluster=devnet",
  ticker: "SOL",
  tickerName: "Solana",
};

export default function Login() {
  const router = useRouter();
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const { setAuthenticated, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig: solanaConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: network,
          chainConfig: solanaConfig,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: { uxMode: "popup" },
        });

        web3authInstance.configureAdapter(authAdapter);
        await web3authInstance.initModal();

        console.log("Web3Auth Initialized");
        setWeb3auth(web3authInstance);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, []);


  const handleLogin = async (token: string) => {
    if (!token) {
      console.error("token not found");
      return;
    }
    try {
      setLoading(true);
      const authResponse = await login(token);
      console.log('✅ Auth response:', authResponse);
      localStorage.setItem('token', authResponse.accessToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      const subs_response = await getMySubscriptions();
      setUser(authResponse.user);
      setAuthenticated(true);
      if (authResponse.user?.country) {
        if (subs_response.length > 0) {
          router.push('/dashboard');
          return
        }
        router.push('/sources');
      } else {
        router.push('/countries');
      }

      toast.success('Login successful!');
    } catch (err: unknown) {
      console.error('❌ Login error:', err);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }

  const handleConnect = async () => {
    if (!web3auth) return console.log("Web3Auth not initialized yet");
    try {
      // If already connected, just get user info
      if (web3auth.connected) {
        const user = await web3auth.getUserInfo();
        console.log("ID TOKEN:", user.idToken);
        handleLogin(user.idToken!);
        return;
      }
      // Otherwise, connect using Google
      await web3auth.connectTo("auth", { loginProvider: "google" });

      if (web3auth.connected) {
        const user = await web3auth.getUserInfo();
        console.log("ID TOKEN:", user.idToken);
        handleLogin(user.idToken!);
      }
    } catch (error: unknown) {
      console.error("Login error:", error instanceof Error ? error.message : error);
    }
  };


  return (
    <main className="w-full bg-white h-dvh p-4 flex flex-col items-center justify-between overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[60%]">
        {/* Hero Image */}
        <div className="w-full max-w-md flex items-center justify-center h-full">
          <Image
            src="/assets/login.png"
            alt="Login Main Image"
            width={500}
            height={500}
            className="w-auto h-auto max-h-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-6 pb-6">
        {/* Logo + Intro Text */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/assets/logo.png" alt="Logo" width={100} height={100} className="w-24 h-auto" />
          <p className="text-sm sm:text-base text-foreground max-w-sm px-4">
            Track, manage, and stay on top of your{" "}
            <span className="text-secondary font-medium">subscriptions</span> with
            Orbit Subscription Tracker.
          </p>
        </div>

        {/* Button */}
        <div className="w-full px-4">
          <Button onClick={handleConnect} loading={loading} variant="primary" size="full" className="py-6 text-lg">
            Get Started
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-foreground text-center max-w-xs">
          By signing in, you agree to the{" "}
          <span className="text-secondary cursor-pointer hover:underline">
            User Agreement
          </span>{" "}
          and{" "}
          <span className="text-secondary cursor-pointer hover:underline">
            Privacy Policy
          </span>{" "}
          of HuddleUp Protocol.
        </p>
      </div>
    </main>
  );
}
