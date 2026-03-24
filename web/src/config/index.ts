import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains";
import { http } from "wagmi";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "placeholder";

export const config = getDefaultConfig({
  appName: "Buy Me a Coffee",
  projectId,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
