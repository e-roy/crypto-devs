import Head from "next/head";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Button } from "@/components/elements";

const navItems = [
  {
    label: "WhiteList",
    href: "/whitelist",
  },
  {
    label: "Mint",
    href: "/mint",
  },
  {
    label: "ICO",
    href: "/ico",
  },
  {
    label: "DAO",
    href: "/dao",
  },
  {
    label: "Exchange",
    href: "/exchange",
  },
];

export default function Home() {
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  return (
    <div className={"bg-gray-900 text-white h-screen"}>
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className={""}>
        <h1 className="text-3xl font-bold text-center">Crypto Devs</h1>
        <div className={"my-4 p-4"}>
          {navItems.map((nav, id) => (
            <Button
              key={id}
              className="my-2"
              onClick={() => router.push(`${nav.href}`)}
            >
              {nav.label}
            </Button>
          ))}
        </div>
      </main>

      <footer className={""}></footer>
    </div>
  );
}
