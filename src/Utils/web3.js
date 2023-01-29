import Web3 from "web3";
import { CHAIN_ID_TO_USE } from "./constants";

export const changeNetworkIfNeeded = async (web3, currentChainId) => {
  if (currentChainId !== CHAIN_ID_TO_USE) {
    try {
      await web3.currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(CHAIN_ID_TO_USE) }],
      });
    } catch (error) {
      console.log(error);
    }
  }
};
