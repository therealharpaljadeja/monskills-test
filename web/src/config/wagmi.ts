import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monad, monadTestnet } from "wagmi/chains";
import { http } from "wagmi";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "demo-wc-project-id-replace-me";

export const config = getDefaultConfig({
  appName: "Monad Guestbook",
  projectId,
  chains: [monadTestnet, monad],
  transports: {
    [monad.id]: http("https://rpc.monad.xyz"),
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});
