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
        You can claim or mint Crypto Dev tokens here
      </h2>
      <p className="text-sm md:text-base text-gray-50 mb-4">
        You have minted 0.0 Crypto Dev Tokens
      </p>
      <p className="text-sm md:text-base text-gray-50 mb-4">
        Overall 164.0/ 10000 have been minted
      </p>
      <TextField
        className="my-4"
        placeholder="Amount of Tokens"
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <div className="flex">
        <Button onClick={() => handleJoin()}>mint tokens</Button>
      </div>
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
