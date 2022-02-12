import { useAccount, useNetwork } from "wagmi";
import { Button } from "@/components/elements";
import { WalletModal } from "@/components/wallet";
import config from "@/config.json";

export const CheckConnection = ({ children }) => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  // console.log(accountData);
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  if (!accountData)
    return (
      <div className="">
        <div className="my-8">Your wallet is not connected</div>
        <WalletModal />
      </div>
    );

  if (networkData.chain.id !== chainId)
    return (
      <div>
        <div className="my-8">
          <div className="font-semibold text-lg mb-2">
            Currently Connected to{" "}
            {networkData.chain?.name ?? networkData.chain?.id}{" "}
          </div>
          <div>
            You will need to switch to the{" "}
            <span className="font-semibold text-lg uppercase">{network}</span>{" "}
            network to use
          </div>
        </div>
        <Button onClick={() => switchNetwork(chainId)}>
          switch to {network}
        </Button>
      </div>
    );

  return children;
};
