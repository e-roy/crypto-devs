import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import WhiteList from "../../../hardhat/artifacts/contracts/Whitelist.sol/Whitelist.json";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import image from "../../images/crypto-devs.svg";

import { Button } from "../../components/elements";
import { Hero } from "../../components/sections";

const WHITELIST_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });
  const provider = useProvider();

  const [{ data, error, loading }, getSigner] = useSigner();

  const whitelistContract = useContract({
    addressOrName: WHITELIST_CONTRACT_ADDRESS,
    contractInterface: WhiteList.abi,
    signerOrProvider: data,
  });

  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      console.log("trying to get number of whitelisted");
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      // setNumberOfWhitelisted(_numberOfWhitelisted);
      console.log("_numberOfWhitelisted", _numberOfWhitelisted);
    } catch (err) {
      //   console.log("err", err);
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
      // setJoinedWhitelist(_joinedWhitelist);
      console.log("_joinedWhitelist", _joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // console.log(data);
    if (data) {
      getNumberOfWhitelisted();
      checkIfAddressInWhitelist();
    }
  }, [data]);

  const addAddressToWhitelist = async () => {
    try {
      const tx = await whitelistContract.addAddressToWhitelist();
      //   setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      //   setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      // setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    console.log("handleJoin");
    // checkIfAddressInWhitelist();
    addAddressToWhitelist();
  };
  return (
    <div>
      <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
        Crypto Devs
      </h1>
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        An NFT collection for developers in Crypto
      </h2>
      <p className="text-sm md:text-base text-gray-50 mb-4">
        1/10 have already joined the Whitelist
      </p>
      <Button onClick={() => handleJoin()}>join</Button>
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
