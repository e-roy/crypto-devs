import { useState } from "react";
import { BigNumber, utils } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { Button, TextField } from "@/components/elements";
import { swapTokens, getAmountOfTokensReceivedFromSwap } from "@/utils/swap";

export const SwapTokens = ({ ExchangeContract, CryptoDevTokenContract }) => {
  const zero = BigNumber.from(0);

  const [swapAmount, setSwapAmount] = useState("");
  const [tokenToBeRecievedAfterSwap, setTokenToBeRecievedAfterSwap] =
    useState(zero);
  const [ethSelected, setEthSelected] = useState(true);

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const provider = useProvider();

  /*
  swapTokens: Swaps  `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeRecievedAfterSwap` amount of Eth/Crypto Dev tokens.
*/
  const _swapTokens = async () => {
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const swapAmountWei = utils.parseEther(swapAmount);
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!swapAmountWei.eq(zero)) {
        // setLoading(true);
        // Call the swapTokens function from the `utils` folder
        await swapTokens(
          swapAmountWei,
          tokenToBeRecievedAfterSwap,
          ethSelected,
          ExchangeContract,
          CryptoDevTokenContract
        );
        // setLoading(false);
        // Get all the updated amounts after the swap
        // await getAmounts();
        setSwapAmount("");
      }
    } catch (err) {
      console.error(err);
      // setLoading(false);
      setSwapAmount("");
    }
  };

  /*
    _getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/Crypto Dev tokens that can be recieved 
    when the user swaps `_swapAmountWEI` amount of Eth/Crypto Dev tokens.
 */
  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount) => {
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!_swapAmountWEI.eq(zero)) {
        // Get the amount of ether in the contract
        const _ethBalance = await provider.getBalance(accountData.address);
        const _reservedCD = await ExchangeContract.getReserve();

        // Call the `getAmountOfTokensReceivedFromSwap` from the utils folder
        const amountOfTokens = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          ethSelected,
          _ethBalance,
          _reservedCD,
          ExchangeContract
        );
        setTokenToBeRecievedAfterSwap(amountOfTokens);
      } else {
        setTokenToBeRecievedAfterSwap(zero);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <TextField
        className="my-4"
        placeholder="Amount"
        type="number"
        value={swapAmount}
        onChange={async (e) => {
          setSwapAmount(e.target.value || "");
          // Calculate the amount of tokens user would recieve after the swap
          await _getAmountOfTokensReceivedFromSwap(e.target.value || "0");
        }}
      />
      <select
        className={"w-full my-2 mb-8 p-2 rounded-md text-gray-700"}
        name="dropdown"
        id="dropdown"
        onChange={async () => {
          setEthSelected(!ethSelected);
          // Initialize the values back to zero
          await _getAmountOfTokensReceivedFromSwap(0);
          setSwapAmount("");
        }}
      >
        <option value="eth">Ethereum</option>
        <option value="cryptoDevToken">Crypto Dev Token</option>
      </select>
      <p className="text-sm md:text-base text-gray-50">
        {ethSelected
          ? `You will get ${utils.formatEther(
              tokenToBeRecievedAfterSwap
            )} Crypto Dev Tokens`
          : `You will get ${utils.formatEther(tokenToBeRecievedAfterSwap)} Eth`}
      </p>
      <Button onClick={() => _swapTokens()}>remove</Button>
    </div>
  );
};
