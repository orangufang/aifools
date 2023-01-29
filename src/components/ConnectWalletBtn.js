import { PRIMARY_BUTTON_STYLES } from "../Utils/constants";
import getWeb3Modal from "../Utils/web3modal";

export const ConnectWalletBtn = ({ setProvider }) => {
  const web3Modal = getWeb3Modal(true);

  const onClick = async () => {
    const provider = await web3Modal.connect();
    setProvider(provider);
  };

  return (
    <button className={PRIMARY_BUTTON_STYLES} onClick={onClick}>
      Connect
    </button>
  );
};
