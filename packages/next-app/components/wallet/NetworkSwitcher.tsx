import * as React from "react";
import { useNetwork } from "wagmi";

export const NetworkSwitcher = () => {
  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  return (
    <div>
      <div>
        Connected to {networkData.chain?.name ?? networkData.chain?.id}{" "}
        {networkData.chain?.unsupported && "(unsupported)"}
      </div>

      {switchNetwork &&
        networkData.chains.map((x) =>
          x.id === networkData.chain?.id ? null : (
            <button
              key={x.id}
              onClick={() => switchNetwork(x.id)}
              className={
                "m-2 p-2 border rounded text-white bg-blue-400 hover:bg-blue-500"
              }
            >
              Switch to {x.name}
            </button>
          )
        )}

      {switchNetworkError && switchNetworkError?.message}
    </div>
  );
};
