import Web3 from "web3";

export const MintAmountSelector = ({
  mintAmountLimit,
  mintAmount,
  setMintAmount,
  mintPrice,
}) => {
  console.log(mintAmountLimit);

  const onMintAmountIncreaseClick = () => {
    if (mintAmount === mintAmountLimit) return;
    setMintAmount(mintAmount + 1);
  };

  const onMintAmountDecreaseClick = () => {
    if (mintAmount === 1) return;
    setMintAmount(mintAmount - 1);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <button
          className="rounded-full w-8 h-8 border flex items-center justify-center pb-1"
          onClick={onMintAmountDecreaseClick}
        >
          -
        </button>
        <span className="mx-4 text-3xl">{mintAmount}</span>
        <button
          className="rounded-full w-8 h-8 border flex items-center justify-center pb-1"
          onClick={onMintAmountIncreaseClick}
        >
          +
        </button>
      </div>
      <span className="my-4 block text-center text-lg">
        Total Price: {mintPrice * mintAmount} ETH
      </span>
    </div>
  );
};
