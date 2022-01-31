import { useAccount, useNetwork } from "wagmi";
import { Button } from "@/components/elements";
import { WalletModal } from "@/components/wallet";
import config from "@/config.json";

export const CheckConnection = ({ children }) => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  // console.log(config);

  if (!accountData)
    return (
      <div className="">
        <div className="my-8">Your wallet is not connected</div>
        <WalletModal />
      </div>
    );

  if (networkData.chain.id !== config.network.id)
    return (
      <div>
        <div className="my-8">
          <div className="font-semibold text-lg mb-2">
            Currently Connected to{" "}
            {networkData.chain?.name ?? networkData.chain?.id}{" "}
          </div>
          <div>
            You will need to switch to the{" "}
            <span className="font-semibold text-lg uppercase">
              {config.network.name}
            </span>{" "}
            network to use
          </div>
        </div>
        <Button onClick={() => switchNetwork(config.network.id)}>
          switch to {config.network.name}
        </Button>
      </div>
    );

  return children;
};
