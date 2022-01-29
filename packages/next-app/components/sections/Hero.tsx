export type HeroProps = {
  child1: React.ReactNode;
  child2: React.ReactNode;
};

export const Hero = ({ child1, child2 }: HeroProps) => {
  return (
    <div className="bg-gray-900 text-white py-20 h-screen">
      <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
        <div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8">
          {child1}
        </div>
        <div className="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 justify-center">
          <div className="h-48 flex flex-wrap content-center">{child2}</div>
        </div>
      </div>
    </div>
  );
};
