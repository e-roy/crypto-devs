import Head from "next/head";
import Image from "next/image";
// import { providers, Contract } from "ethers";
import { useEffect } from "react";
// import Mint from "../../../hardhat/artifacts/contracts/Whitelist.sol/Whitelist.json";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import image from "../../images/eth-devs-2.svg";

// import { Account, Connect, NetworkSwitcher } from "../components/wallet";

import { Button } from "../../components/elements";

const MINT_CONTRACT_ADDRESS = "";

export default function WhitelistPage() {
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

  const handleJoin = async () => {
    console.log("handleJoin");
  };

  useEffect(() => {
    console.log(data);
    // if (data) {

    // }
  }, [data]);

  return (
    <div className="bg-gray-900 text-white py-20 h-screen">
      <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
        <div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8">
          <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
            Crypto Devs
          </h1>
          <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
            An NFT collection for developers in Crypto
          </h2>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            0/100 have been minted
          </p>
          <Button>Mint</Button>
        </div>
        <div className="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 justify-center">
          <div className="h-48 flex flex-wrap content-center">
            <div>
              <Image
                className="inline-block mt-24 md:mt-0 p-8"
                src={image}
                alt="Crypto Devs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
