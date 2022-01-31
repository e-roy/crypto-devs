import Head from "next/head";
import Image from "next/image";
import { Hero } from "@/components/sections";
import { Button } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/eth-devs-2.svg";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const handleJoin = async () => {
    console.log("handleJoin");
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
        Crypto Devs
      </h1>
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        Welcome to the DAO!
      </h2>
      <CheckConnection>
        <div>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Your CryptoDevs NFT Balance: 0
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Treasury Balance: 0 ETH
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Total Number of Proposals: 0
          </p>
          <div className="flex">
            <Button onClick={() => handleJoin()}>create proposal</Button>
            <Button className="ml-4" onClick={() => handleJoin()}>
              view proposals
            </Button>
          </div>
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
