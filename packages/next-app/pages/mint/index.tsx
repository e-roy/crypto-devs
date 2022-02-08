import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner, useNetwork } from "wagmi";
import { Hero } from "@/components/sections";
import { Button } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import { utils } from "ethers";
import image from "@/images/eth-devs-2.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxMintable, setMaxMintable] = useState(0);
  const [mintPrice, setMintPrice] = useState("");
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data, error, loading }, getSigner] = useSigner();
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const CryptoDevs = contracts[chainId][network].contracts.CryptoDevs;

  const mintContract = useContract({
    addressOrName: CryptoDevs.address,
    contractInterface: CryptoDevs.abi,
    signerOrProvider: data,
  });
  // console.log(mintContract);

  const fetchData = async () => {
    const [totalClaimed, maxSupply, mintPrice, contractOwner] =
      await Promise.all([
        await mintContract.tokenIds(),
        await mintContract.maxTokenIds(),
        await mintContract._price(),
        await mintContract.owner(),
      ]);
    setTotalMinted(totalClaimed.toString());
    setMaxMintable(maxSupply.toString());
    setMintPrice(utils.formatEther(mintPrice.toString()));
    if (accountData.address.toLowerCase() === contractOwner.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  };

  /**
   * startPresale: starts the presale for the NFT Collection
   */
  const startPresale = async () => {
    console.log("startPresale");
    try {
      const tx = await mintContract.startPresale();
      // setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      // setLoading(false);
      // set the presale started to true
      await checkIfPresaleStarted();
      await checkIfPresaleEnded();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfPresaleStarted: checks if the presale has started by quering the `presaleStarted`
   * variable in the contract
   */
  const checkIfPresaleStarted = async () => {
    // console.log("checkIfPresaleStarted");
    try {
      // call the presaleStarted from the contract
      const _presaleStarted = await mintContract.presaleStarted();
      // console.log(_presaleStarted);
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  /**
   * checkIfPresaleEnded: checks if the presale has ended by quering the `presaleEnded`
   * variable in the contract
   */
  const checkIfPresaleEnded = async () => {
    // console.log("checkIfPresaleEnded");
    try {
      // call the presaleEnded from the contract
      const _presaleEnded = await mintContract.presaleEnded();
      // _presaleEnded is a Big Number, so we are using the lt(less than function) insteal of `<`
      // Date.now()/1000 returns the current time in seconds
      // We compare if the _presaleEnded timestamp is less than the current time
      // which means presale has ended
      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      // console.log(_presaleEnded.toNumber() * 1000);
      // console.log(Date.now());
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    // console.log(data);
    if (data && networkData.chain.id === chainId) {
      checkIfPresaleStarted();
      checkIfPresaleEnded();
      fetchData();
    }
  }, [data]);

  /**
   * presaleMint: Mint an NFT during the presale
   */
  const presaleMint = async () => {
    try {
      // call the presaleMint from the contract, only whitelisted addresses would be able to mint
      const tx = await mintContract.presaleMint({
        // value signifies the cost of one crypto dev which is "0.01" eth.
        // We are parsing `0.01` string to ether using the utils library from ethers.js
        value: utils.parseEther(mintPrice),
      });
      // setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      // setLoading(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * publicMint: Mint an NFT after the presale
   */
  const publicMint = async () => {
    try {
      // call the mint from the contract to mint the Crypto Dev
      const tx = await mintContract.mint({
        // value signifies the cost of one crypto dev which is "0.01" eth.
        // We are parsing `0.01` string to ether using the utils library from ethers.js
        value: utils.parseEther(mintPrice),
      });
      // setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      // setLoading(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        An NFT collection for developers in Crypto
      </h2>
      <CheckConnection>
        <div>
          {isOwner && presaleEnded ? (
            <Button
              onClick={() => {
                startPresale();
              }}
            >
              Start Presale
            </Button>
          ) : null}
        </div>
        <div>
          <p className="text-sm md:text-base text-gray-50 mt-4">
            {totalMinted} / {maxMintable} have been minted
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Mint an NFT for {mintPrice} ETH
          </p>
          {presaleStarted && !presaleEnded ? (
            <Button onClick={() => presaleMint()}>presale mint</Button>
          ) : presaleStarted ? (
            <Button onClick={() => publicMint()}>public mint</Button>
          ) : (
            <div>minting is not available</div>
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
