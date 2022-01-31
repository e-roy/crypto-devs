import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Hero } from "@/components/sections";
import image from "@/images/eth-devs-2.svg";

import { Button, TextField } from "@/components/elements";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [tokenAmount, setTokenAmount] = useState("");

  const handleJoin = async () => {
    console.log("handleJoin");
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
        Crypto Devs
      </h1>
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        Exchange Ethereum for Crypto Dev Tokens
      </h2>
      <div className="flex">
        <Button onClick={() => handleJoin()}>Liquidity</Button>
        <Button className="ml-4" onClick={() => handleJoin()}>
          Swap
        </Button>
      </div>
      <p className="text-sm md:text-base text-gray-50">You have:</p>
      <p className="text-sm md:text-base text-gray-50">0 Crypto Dev Tokens</p>
      <p className="text-sm md:text-base text-gray-50">0 Ether</p>
      <p className="text-sm md:text-base text-gray-50 mb-4">
        0 Crypto Dev LP Tokens
      </p>
      <TextField
        className="my-4"
        placeholder="Amount of Ether"
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <p className="text-sm md:text-base text-gray-50">You will need 0</p>
      <p className="text-sm md:text-base text-gray-50">Crypto Dev Tokens</p>
      <div className="flex">
        <Button onClick={() => handleJoin()}>add</Button>
      </div>
      <TextField
        className="my-4"
        placeholder="Amount of LP Tokens"
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <p className="text-sm md:text-base text-gray-50">You will get 0</p>
      <p className="text-sm md:text-base text-gray-50">Crypto Dev Tokens</p>
      <p className="text-sm md:text-base text-gray-50">and 0 ETH</p>
      <Button onClick={() => handleJoin()}>remove</Button>
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
