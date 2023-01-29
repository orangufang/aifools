import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";

const providerOptions = (isMainnet = false) => ({
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "a092b5eb5e234203a815bc3af77d627a", // required
    },
  },

  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "aifools mint website", // Required
      infuraId: "a092b5eb5e234203a815bc3af77d627a", // Required
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      chainId: isMainnet ? 1 : 5, // Optional. It defaults to 1 if not provided
      darkMode: true, // Optional. Use dark theme, defaults to false
    },
  },

  torus: {
    package: Torus, // required
    options: {
      networkParams: {
        host: isMainnet ? "mainnet" : "goerli",
      },
    },
  },
});

export default providerOptions;
