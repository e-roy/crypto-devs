import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner, useNetwork } from "wagmi";
import { Hero } from "@/components/sections";
import { Button } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/crypto-devs.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [maxNumberOfWhitelisted, setMaxNumberOfWhitelisted] = useState(0);
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data, error, loading }, getSigner] = useSigner();
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const Whitelist = contracts[chainId][network].contracts.Whitelist;
  // console.log(Whitelist);

  const whitelistContract = useContract({
    addressOrName: Whitelist.address,
    contractInterface: Whitelist.abi,
    signerOrProvider: data,
  });

  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInWhitelist = async () => {
    try {
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        accountData.address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const checkMaxNumberOfWhitelisted = async () => {
    try {
      // call the whitelistedAddresses from the contract
      const _maxNumberOfWhitelisted =
        await whitelistContract.maxWhitelistedAddresses();
      setMaxNumberOfWhitelisted(_maxNumberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data && networkData.chain.id === chainId) {
      getNumberOfWhitelisted();
      checkIfAddressInWhitelist();
      checkMaxNumberOfWhitelisted();
    }
  }, [data]);

  const addAddressToWhitelist = async () => {
    try {
      const tx = await whitelistContract.addAddressToWhitelist();
      setJoinLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setJoinLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    addAddressToWhitelist();
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
        Crypto Devs
      </h1>
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        An NFT collection for developers in Crypto
      </h2>
      <CheckConnection>
        <div>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            {numberOfWhitelisted}/{maxNumberOfWhitelisted} have already joined
            the Whitelist
          </p>
          {!joinedWhitelist ? (
            <Button disabled={joinLoading} onClick={() => handleJoin()}>
              join
            </Button>
          ) : (
            <div className="uppercase">You are on the whitelist</div>
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
