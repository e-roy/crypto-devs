import Head from "next/head";
import Image from "next/image";
// import { providers, Contract } from "ethers";
import { useEffect } from "react";
// import Mint from "../../../hardhat/artifacts/contracts/Whitelist.sol/Whitelist.json";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { Hero } from "../../components/sections";
import image from "../../images/eth-devs-2.svg";

// import { Account, Connect, NetworkSwitcher } from "../components/wallet";

import { Button } from "../../components/elements";

const MINT_CONTRACT_ADDRESS = "";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });
  const provider = useProvider();

  const [{ data, error, loading }, getSigner] = useSigner();

  // const mintContract = useContract({
  //   addressOrName: MINT_CONTRACT_ADDRESS,
  //   contractInterface: Mint.abi,
  //   signerOrProvider: data,
  // });

  useEffect(() => {
    // console.log(data);
    if (data) {
    }
  }, [data]);

  const handleJoin = async () => {
    console.log("handleJoin");
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
      <Button onClick={() => handleJoin()}>mint</Button>
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
