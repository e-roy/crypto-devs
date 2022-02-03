import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { utils } from "ethers";
import { useAccount, useContract, useSigner } from "wagmi";
import { Hero } from "@/components/sections";
import { Button, TextField } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/eth-devs-2.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [tokenAmount, setTokenAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [tokensClaimed, setTokensClaimed] = useState(0);
  const [maxTokensAvailable, setMaxTokensAvailable] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data, error, loading }, getSigner] = useSigner();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const CryptoDevToken = contracts[chainId][network].contracts.CryptoDevToken;

  const tokenContract = useContract({
    addressOrName: CryptoDevToken.address,
    contractInterface: CryptoDevToken.abi,
    signerOrProvider: data,
  });
  // console.log(tokenContract);

  const CryptoDevs = contracts[chainId][network].contracts.CryptoDevs;

  const mintContract = useContract({
    addressOrName: CryptoDevs.address,
    contractInterface: CryptoDevs.abi,
    signerOrProvider: data,
  });
  // console.log(mintContract);

  const fetchData = async () => {
    const [totalClaimed, maxSupply, userTokens] = await Promise.all([
      await tokenContract.totalSupply(),
      await tokenContract.maxTotalSupply(),
      await tokenContract.balanceOf(accountData.address),
    ]);
    setTokensClaimed(Number(utils.formatEther(totalClaimed)));
    setMaxTokensAvailable(Number(utils.formatEther(maxSupply)));
    setUserBalance(Number(utils.formatEther(userTokens)));
  };
  /**
   * getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
   */
  const getTokensToBeClaimed = async () => {
    try {
      // call the balanceOf from the NFT contract to get the number of NFT's held by the user
      const balance = await mintContract.balanceOf(accountData.address);
      // balance is a Big number and thus we would compare it with Big number `zero`
      if (balance === 0) {
        // setTokensToBeClaimed(zero);
      } else {
        // amount keeps track of the number of unclaimed tokens
        var amount = 0;
        // For all the NFT's, check if the tokens have already been claimed
        // Only increase the amount if the tokens have not been claimed
        // for a an NFT(for a given tokenId)
        for (var i = 0; i < balance; i++) {
          const tokenId = await mintContract.tokenOfOwnerByIndex(
            accountData.address,
            i
          );
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        //tokensToBeClaimed has been initialized to a Big Number, thus we would convert amount
        // to a big number and then set its value
        // setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (err) {
      console.error(err);
      // setTokensToBeClaimed(zero);
    }
  };

  /**
   * mintCryptoDevToken: mints `amount` number of tokens to a given address
   */
  const mintCryptoDevToken = async (amount: number) => {
    try {
      // Each token is of `0.001 ether`. The value we need to send is `0.001 * amount`
      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        // value signifies the cost of one crypto dev token which is "0.001" eth.
        // We are parsing `0.001` string to ether using the utils library from ethers.js
        value: utils.parseEther(value.toString()),
      });
      // setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      // setLoading(false);
      setTokenAmount(0);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * claimCryptoDevTokens: Helps the user claim Crypto Dev Tokens
   */
  const claimCryptoDevTokens = async () => {
    try {
      const tx = await tokenContract.claim();
      // setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      // setLoading(false);
      window.alert("Sucessfully claimed Crypto Dev Tokens");
      // await getBalanceOfCryptoDevTokens();
      // await getTotalTokensMinted();
      // await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // console.log(data);
    if (data) {
      fetchData();
    }
  }, [data]);

  const handleClaim = async () => {
    console.log("handleClaim");
    // const tokenId = await mintContract.tokenOfOwnerByIndex(
    //   accountData.address,
    //   1
    // );
    // console.log(tokenId);
    // const claimed = await tokenContract.tokenIdsClaimed(tokenId);
    // console.log(claimed);

    let available = maxTokensAvailable - tokensClaimed;

    if (tokenAmount === 0) setErrorMessage("Please enter a valid amount");
    else if (tokenAmount > available)
      setErrorMessage(`You can only claim upto ${available} tokens`);
    else {
      setErrorMessage("");
      mintCryptoDevToken(tokenAmount);
    }
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
        Crypto Devs
      </h1>
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        You can claim or mint Crypto Dev tokens here
      </h2>
      <CheckConnection>
        <div>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            You have minted {userBalance} Crypto Dev Tokens
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Overall {tokensClaimed} / {maxTokensAvailable} have been minted
          </p>
          <TextField
            className="my-4"
            placeholder="Amount of Tokens"
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(Number(e.target.value))}
          />
          <div className="flex">
            <Button onClick={() => handleClaim()}>mint tokens</Button>
          </div>
          {errorMessage && (
            <div className="my-4 p-2 rounded bg-red-700 text-white font-semibold">
              {errorMessage}
            </div>
          )}
        </div>
      </CheckConnection>
    </div>
  );
};

const RightSection = () => {
  return (
    <Image
      className="inline-block mt-24 md:mt-0 p-8"
      src={image}
      alt="Crypto Devs"
    />
  );
};
