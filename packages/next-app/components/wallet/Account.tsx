import * as React from "react";
import { useAccount } from "wagmi";
import { Button } from "../elements";
import Image from "next/image";

export const Account = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  console.log("accountData", accountData);

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
        <Image
          width={40}
          height={40}
          src={accountData.ens.avatar}
          alt="Crypto Devs"
        />
      )}
    </div>
  );
};
