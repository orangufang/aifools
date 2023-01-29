import Web3Modal from "web3modal";
import getProviderOptions from "./providerOptions";

export const getWeb3Modal = (isMainnet = false) => {
  return new Web3Modal({
    cacheProvider: true,
    providerOptions: getProviderOptions(isMainnet),
  });
};

export default getWeb3Modal;
