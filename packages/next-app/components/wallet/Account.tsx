import * as React from "react";
import { useAccount } from "wagmi";
import { Button } from "../elements";

export const Account = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  if (!accountData) return <div>No account connected</div>;

  return (
    <div>
      <div>
        <Button onClick={() => disconnect()}>
          Disconnect from {accountData?.connector?.name}
        </Button>
      </div>

      <div>
        {accountData?.ens?.name ?? accountData?.address}
        {accountData?.ens ? ` (${accountData?.address})` : null}
      </div>

      {accountData?.ens?.avatar && (
        <img src={accountData.ens.avatar} style={{ height: 40, width: 40 }} />
      )}
    </div>
  );
};
