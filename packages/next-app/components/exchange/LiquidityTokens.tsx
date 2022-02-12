import { useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";
import { useAccount, useSigner, useProvider } from "wagmi";
import { Button, TextField } from "@/components/elements";

import { addLiquidity, calculateCD } from "@/utils/addLiquidity";
import { getTokensAfterRemove, removeLiquidity } from "@/utils/removeLiquidity";

export const LiquidityTokens = ({
  ExchangeContract,
  CryptoDevTokenContract,
}) => {
  const zero = BigNumber.from(0);
  const [ethBalance, setEtherBalance] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [lpBalance, setLPBalance] = useState(zero);
  const [reservedCD, setReservedCD] = useState(zero);
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);

  const [addCDTokens, setAddCDTokens] = useState(zero);
  const [removeEther, setRemoveEther] = useState(zero);
  const [removeCD, setRemoveCD] = useState(zero);

  const [addEther, setAddEther] = useState("");
  const [removeLPTokens, setRemoveLPTokens] = useState("");

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data: signerData, error, loading }, getSigner] = useSigner();

  const provider = useProvider();

  const getAmounts = async () => {
    try {
      const _ethBalance = await provider.getBalance(accountData.address);
      const _cdBalance = await CryptoDevTokenContract.balanceOf(
        accountData.address
      );
      const _lpBalance = await ExchangeContract.balanceOf(accountData.address);
      const _reservedCD = await ExchangeContract.getReserve();
      const _ethBalanceContract = await provider.getBalance(
        ExchangeContract.address
      );
      setEtherBalance(_ethBalance);
      setCDBalance(_cdBalance);
      setLPBalance(_lpBalance);
      setReservedCD(_reservedCD);
      setEtherBalanceContract(_ethBalanceContract);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      signerData &&
      ExchangeContract.provider &&
      CryptoDevTokenContract.provider
    ) {
      getAmounts();
    }
  }, [signerData, ExchangeContract, CryptoDevTokenContract]);

  const _addLiquidity = async () => {
    try {
      // Convert the ether amount entered by the user to Bignumber
      const addEtherWei = utils.parseEther(addEther.toString());
      // Check if the values are zero
      if (!addCDTokens.eq(zero) && !addEtherWei.eq(zero)) {
        // setLoading(true);
        // call the addLiquidity function from the utils folder
        await addLiquidity(
          addCDTokens,
          addEtherWei,
          ExchangeContract,
          CryptoDevTokenContract
        );
        // setLoading(false);
        // Reinitialize the CD tokens
        setAddCDTokens(zero);
        // Get amounts for all values after the liquidity has been added
        await getAmounts();
      } else {
        setAddCDTokens(zero);
      }
    } catch (err) {
      console.error(err);
      // setLoading(false);
      setAddCDTokens(zero);
    }
  };

  const _removeLiquidity = async () => {
    try {
      // const signer = await getProviderOrSigner(true);
      // Convert the LP tokens entered by the user to a BigNumber
      const removeLPTokensWei = utils.parseEther(removeLPTokens);
      // setLoading(true);
      // Call the removeLiquidity function from the `utils` folder
      await removeLiquidity(removeLPTokensWei, ExchangeContract);
      // setLoading(false);
      await getAmounts();
      setRemoveCD(zero);
      setRemoveEther(zero);
      setRemoveLPTokens("");
      setAddEther("");
    } catch (err) {
      console.error(err);
      // setLoading(false);
      setRemoveCD(zero);
      setRemoveEther(zero);
      setRemoveLPTokens("");
      setAddEther("");
    }
  };

  const _getTokensAfterRemove = async (_removeLPTokens) => {
    try {
      // const provider = await getProviderOrSigner();
      // Convert the LP tokens entered by the user to a BigNumber
      const removeLPTokenWei = utils.parseEther(_removeLPTokens);
      // Get the Eth reserves within the exchange contract
      // const _ethBalance = await getEtherBalance(provider, null, true);
      const _ethBalance = await provider.getBalance(accountData.address);

      // get the crypto dev token reserves from the contract
      // const cryptoDevTokenReserve = await getReserveOfCDTokens(provider);
      const cryptoDevTokenReserve = await ExchangeContract.getReserve();
      // call the getTokensAfterRemove from the utils folder
      const { _removeEther, _removeCD } = await getTokensAfterRemove(
        removeLPTokenWei,
        _ethBalance,
        cryptoDevTokenReserve,
        ExchangeContract
      );
      setRemoveEther(_removeEther);
      setRemoveCD(_removeCD);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p className="text-sm md:text-base text-gray-50">You have:</p>
      <p className="text-sm md:text-base text-gray-50">
        {utils.formatEther(cdBalance)} Crypto Dev Tokens
      </p>
      <p className="text-sm md:text-base text-gray-50">
        {utils.formatEther(ethBalance)} Ether
      </p>
      <p className="text-sm md:text-base text-gray-50 mb-4">
        {utils.formatEther(lpBalance)} Crypto Dev LP tokens
      </p>
      <div>
        {utils.parseEther(reservedCD.toString()).eq(zero) ? (
          <div>
            <TextField
              className="my-4"
              placeholder="Amount of Ether"
              type="number"
              value={addEther}
              onChange={(e) => setAddEther(e.target.value)}
            />
            <TextField
              className="my-4"
              placeholder="Amount of CryptoDev tokens"
              type="number"
              value={addCDTokens}
              onChange={(e) =>
                setAddCDTokens(
                  BigNumber.from(utils.parseEther(e.target.value || "0"))
                )
              }
            />
            <Button onClick={() => _addLiquidity()}>add</Button>
          </div>
        ) : (
          <div>
            <TextField
              className="my-4"
              placeholder="Amount of Ether"
              type="number"
              value={addEther}
              onChange={async (e) => {
                setAddEther(e.target.value || "0");
                const _addCDTokens = await calculateCD(
                  e.target.value || "0",
                  etherBalanceContract,
                  reservedCD
                );
                setAddCDTokens(_addCDTokens);
              }}
            />
            <p className="text-sm md:text-base text-gray-50">{`You will need ${utils.formatEther(
              addCDTokens
            )} Crypto Dev Tokens`}</p>
            <Button onClick={() => _addLiquidity()}>add</Button>
          </div>
        )}
      </div>

      <TextField
        className="my-4"
        placeholder="Amount of LP Tokens"
        type="number"
        value={removeLPTokens}
        onChange={async (e) => {
          setRemoveLPTokens(e.target.value || "0");
          await _getTokensAfterRemove(e.target.value || "0");
        }}
      />
      <p className="text-sm md:text-base text-gray-50">{`You will get ${utils.formatEther(
        removeCD
      )} Crypto
              Dev Tokens and ${utils.formatEther(removeEther)} Eth`}</p>
      <Button onClick={() => _removeLiquidity()}>remove</Button>
    </div>
  );
};
