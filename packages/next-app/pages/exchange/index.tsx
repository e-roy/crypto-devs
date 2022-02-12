import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useContract, useSigner } from "wagmi";
import { Hero } from "@/components/sections";
import { Button } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/eth-devs-2.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

import { LiquidityTokens, SwapTokens } from "@/components/exchange";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [tab, setTab] = useState("liquidity");

  const [{ data: signerData, error, loading }, getSigner] = useSigner();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const Exchange = contracts[chainId][network].contracts.Exchange;

  const ExchangeContract = useContract({
    addressOrName: Exchange.address,
    contractInterface: Exchange.abi,
    signerOrProvider: signerData,
  });

  const CryptoDevToken = contracts[chainId][network].contracts.CryptoDevToken;

  const CryptoDevTokenContract = useContract({
    addressOrName: CryptoDevToken.address,
    contractInterface: CryptoDevToken.abi,
    signerOrProvider: signerData,
  });

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        Exchange Ethereum for Crypto Dev Tokens
      </h2>
      <CheckConnection>
        <div>
          <div className="flex">
            <Button onClick={() => setTab("liquidity")}>Liquidity</Button>
            <Button className="ml-4" onClick={() => setTab("swap")}>
              Swap
            </Button>
          </div>
          {tab === "liquidity" && (
            <LiquidityTokens
              ExchangeContract={ExchangeContract}
              CryptoDevTokenContract={CryptoDevTokenContract}
            />
          )}
          {tab === "swap" && (
            <SwapTokens
              ExchangeContract={ExchangeContract}
              CryptoDevTokenContract={CryptoDevTokenContract}
            />
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
