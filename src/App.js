import Web3 from "web3";
import { changeNetworkIfNeeded } from "./Utils/web3";
import { useEffect, useState } from "react";
import { ConnectWalletBtn } from "./components/ConnectWalletBtn";
import { MintAmountSelector } from "./components/MintAmountSelector";
import {
  CHAIN_ID_TO_USE,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  INFURA_URL,
  PRIMARY_BUTTON_STYLES,
} from "./Utils/constants";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [mintAmount, setMintAmount] = useState(1);
  const [contract, setContract] = useState();
  const [mintAmountLimit, setMintAmountLimit] = useState();
  const [mintPrice, setMintPrice] = useState();
  const [maxSupply, setMaxSupply] = useState();
  const [isPublicMintOpen, setIsPublicMintOpen] = useState();
  const [isPrivateMintOpen, setIsPrivateMintOpen] = useState();
  const [nftsAlreadyMinted, setNftsAlreadyMinted] = useState();
  const [mintTransactionHash, setMintTransactionHash] = useState();

  useEffect(() => {
    const infuraWeb3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

    setContract(new infuraWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS));
  }, []);

  useEffect(() => {
    const fetchContractValues = async () => {
      const [limit, price, supply, publicMintOpen, isPrivateMintOpen, count] =
        await Promise.all([
          contract.methods.mintAmountLimit().call(),
          contract.methods.mintPrice().call(),
          contract.methods.maxSupply().call(),
          contract.methods.isPublicMintOpen().call(),
          contract.methods.isPrivateMintOpen().call(),
          contract.methods.tokenCounter().call(),
        ]);
      setMintAmountLimit(limit);
      setMintPrice(Web3.utils.fromWei(price, "ether"));
      setMaxSupply(supply);
      setIsPublicMintOpen(publicMintOpen);
      setIsPrivateMintOpen(isPrivateMintOpen);
      setNftsAlreadyMinted(count);
    };

    if (contract) fetchContractValues();
  }, [contract]);

  const onConnect = async (provider) => {
    if (!provider) return;
    const newWeb3 = new Web3(provider);
    setWeb3(newWeb3);

    const accounts = await newWeb3.eth.getAccounts();
    setAccount(accounts[0]);

    const currentChainId = await newWeb3.eth.getChainId();
    await changeNetworkIfNeeded(newWeb3, currentChainId);

    newWeb3.currentProvider.on("chainChanged", async (chainId) => {
      await changeNetworkIfNeeded(newWeb3, chainId);
    });
    newWeb3.currentProvider.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
    });
  };

  console.log(
    mintPrice,
    mintAmountLimit,
    maxSupply,
    isPrivateMintOpen,
    isPublicMintOpen
  );

  const onMintClick = async () => {
    const currentChainId = await web3.eth.getChainId();
    await changeNetworkIfNeeded(web3, currentChainId);
    const newChainId = await web3.eth.getChainId();
    if (newChainId !== CHAIN_ID_TO_USE) return;

    const txParams = {
      from: account,
      to: CONTRACT_ADDRESS,
      value: Web3.utils.toHex(
        Web3.utils.toWei(`${mintPrice * mintAmount}`, "ether")
      ),
      data: contract.methods.mint(mintAmount).encodeABI(),
    };
    web3.eth
      .sendTransaction(txParams)
      .on("transactionHash", (hash) => {
        toast.success(
          "The mint transaction was sent, hold on until it succeeds...."
        );
        setMintTransactionHash(hash);
      })
      .on("receipt", (receipt) => {
        if (receipt.status) {
          toast.success("The mint was successful");
        }
        console.log(receipt);
      })
      .on("error", async (error) => {
        if (!error.receipt) return toast.error("The mint failed");
        const tx = await web3.eth.getTransaction(error.receipt.transactionHash);

        try {
          await web3.eth.call(tx, tx.blockNumber);
        } catch (err) {
          console.log(err.message);
          const revertReason = err.message.split("{")[0].split(":")[1];
          toast.error(`The mint failed: ${revertReason}`);
          return;
        }

        toast.error("The mint failed");
      });
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div></div>
      {account ? (
        <>
          <span className="mt-4"> {account}</span>
          <span className="my-4 mb-8">
            {nftsAlreadyMinted - 1}/{maxSupply} NFTs Minted
          </span>
          <MintAmountSelector
            mintAmount={mintAmount}
            setMintAmount={setMintAmount}
            mintAmountLimit={mintAmountLimit ? parseInt(mintAmountLimit) : null}
            mintPrice={mintPrice}
          />
          <button
            className={PRIMARY_BUTTON_STYLES + "mt-4"}
            disabled={
              (!isPublicMintOpen && !isPrivateMintOpen) ||
              maxSupply === nftsAlreadyMinted - 1
            }
            onClick={onMintClick}
          >
            Mint
          </button>
          {mintTransactionHash && (
            <a
              href={`https://goerli.etherscan.io/tx/${mintTransactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 underline"
            >
              See your mint transaction
            </a>
          )}
        </>
      ) : (
        <ConnectWalletBtn setProvider={onConnect} />
      )}
    </div>
  );
}

export default App;
