import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner, useNetwork } from "wagmi";
import { Hero } from "@/components/sections";
import { Button, Loading } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/crypto-devs.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [maxNumberOfWhitelisted, setMaxNumberOfWhitelisted] = useState(0);
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }] = useNetwork();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const Whitelist = contracts[chainId][network].contracts.Whitelist;

  const whitelistContract = useContract({
    addressOrName: Whitelist.address,
    contractInterface: Whitelist.abi,
    signerOrProvider: signerData,
  });

  const fetchData = async () => {
    try {
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        accountData.address
      );
      setJoinedWhitelist(_joinedWhitelist);
      const _maxNumberOfWhitelisted =
        await whitelistContract.maxWhitelistedAddresses();
      setMaxNumberOfWhitelisted(_maxNumberOfWhitelisted);
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
      setLoadingData(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (signerData && networkData.chain.id === chainId) {
      fetchData();
    }
  }, [signerData]);

  const addAddressToWhitelist = async () => {
    try {
      setJoinLoading(true);
      const tx = await whitelistContract.addAddressToWhitelist();
      // wait for the transaction to get mined
      await tx.wait();
      setJoinLoading(false);
      // get the updated number of addresses in the whitelist
      await fetchData();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
      setJoinLoading(false);
    }
  };

  const handleJoin = async () => {
    addAddressToWhitelist();
  };

  // if (loadingData) {
  //   return <Loading />;
  // }
  return (
    <div className="w-full">
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
            <>
              {joinLoading ? (
                <Loading message="Confirm or Reject" />
              ) : (
                <Button disabled={joinLoading} onClick={handleJoin}>
                  Join
                </Button>
              )}
            </>
          ) : (
            <div className="uppercase text-xl text-yellow-300">
              You are on the whitelist
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
