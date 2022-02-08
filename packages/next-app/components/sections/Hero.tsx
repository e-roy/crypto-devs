import Link from "next/link";

export type HeroProps = {
  child1: React.ReactNode;
  child2: React.ReactNode;
};

export const Hero = ({ child1, child2 }: HeroProps) => {
  return (
    <div className="bg-gray-900 text-gray-200 h-screen">
      <Link href="/" passHref>
        <h1 className="pl-4 text-2xl md:text-4xl p-2 cursor-pointer font-medium text-yellow-300 hover:text-yellow-200 tracking-loose">
          Crypto Devs
        </h1>
      </Link>
      <div className="container mx-auto flex flex-col md:flex-row items-center my-6 md:my-12">
        <div className="flex flex-col w-full lg:w-2/3 justify-center items-start p-8">
          {child1}
        </div>
        <div className="p-8 mt-24 mb-6 md:mb-0 md:mt-12 ml-0 justify-center">
          <div className="h-48 flex flex-wrap content-center">{child2}</div>
        </div>
      </div>
    </div>
  );
};
