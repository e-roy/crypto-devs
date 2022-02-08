import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { utils } from "ethers";
import { useAccount, useContract, useSigner, useProvider } from "wagmi";
import { Hero } from "@/components/sections";
import { Button, TextField } from "@/components/elements";
import { CheckConnection } from "@/components/wallet";
import image from "@/images/eth-devs-2.svg";
import config from "@/config.json";
import contracts from "@/contracts/hardhat_contracts.json";

export default function WhitelistPage() {
  return <Hero child1={<LeftSection />} child2={<RightSection />} />;
}

const LeftSection = () => {
  const [nftBalance, setNftBalance] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [totalProposals, setTotalProposals] = useState(0);
  const [selectedTab, setSelectedTab] = useState("");
  const [proposals, setProposals] = useState([]);

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: false,
  });

  const [{ data, error, loading }, getSigner] = useSigner();

  const provider = useProvider();

  const chainId = Number(config.network.id);
  const network = config.network.name;

  const CryptoDevs = contracts[chainId][network].contracts.CryptoDevs;

  const NFTContract = useContract({
    addressOrName: CryptoDevs.address,
    contractInterface: CryptoDevs.abi,
    signerOrProvider: data,
  });
  // console.log("NFTContract", NFTContract);

  const CryptoDevsDAO = contracts[chainId][network].contracts.CryptoDevsDAO;

  const DAOContract = useContract({
    addressOrName: CryptoDevsDAO.address,
    contractInterface: CryptoDevsDAO.abi,
    signerOrProvider: data,
  });
  // console.log("DAOContract", DAOContract);

  const fetchData = async () => {
    const [nftBalance, treasuryBalance, totalProposals] = await Promise.all([
      await NFTContract.balanceOf(accountData.address),
      await provider.getBalance(DAOContract.address),
      await DAOContract.numProposals(),
    ]);
    setNftBalance(Number(nftBalance));
    // console.log("treasuryBalance", treasuryBalance);
    setTreasuryBalance(Number(utils.formatEther(treasuryBalance)));
    setTotalProposals(Number(totalProposals));
  };

  useEffect(() => {
    // console.log(data);
    if (data) {
      fetchData();
    }
  }, [data]);

  const fetchProposalById = async (id) => {
    try {
      const proposal = await DAOContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < totalProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals();
    }
  }, [selectedTab]);

  const RenderTab = () => {
    if (selectedTab === "Create Proposal") {
      return <CreateProposalTab />;
    } else if (selectedTab === "View Proposals") {
      return <ViewProposalsTab />;
    }
    return null;
  };

  const CreateProposalTab = () => {
    const [fakeNftTokenId, setFakeNftTokenId] = useState(0);

    const createProposal = async () => {
      try {
        const txn = await DAOContract.createProposal(fakeNftTokenId);
        // setLoading(true);
        await txn.wait();
        console.log(txn);
        // setLoading(false);
        setFakeNftTokenId(0);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className={"my-4"}>
        <label>Fake NFT Token ID to Purchase: </label>
        <TextField
          placeholder="0"
          type="number"
          value={fakeNftTokenId}
          onChange={(e) => setFakeNftTokenId(Number(e.target.value))}
        />
        <Button className={"my-4"} onClick={() => createProposal()}>
          Create
        </Button>
      </div>
    );
  };

  const ViewProposalsTab = () => {
    const voteOnProposal = async (proposalId, _vote) => {
      try {
        let vote = _vote === "YAY" ? 0 : 1;
        const txn = await DAOContract.voteOnProposal(proposalId, vote);
        // setLoading(true);
        await txn.wait();
        console.log(txn);
        // setLoading(false);
        await fetchAllProposals();
      } catch (error) {
        console.error(error);
        window.alert(error.data.message);
      }
    };
    const executeProposal = async (proposalId) => {
      try {
        const txn = await DAOContract.executeProposal(proposalId);
        // setLoading(true);
        await txn.wait();
        console.log(txn);
        // setLoading(false);
        await fetchAllProposals();
      } catch (error) {
        console.error(error);
        window.alert(error.data.message);
      }
    };
    return (
      <div
        className={
          "mt-4 h-72 border border-gray-400 text-gray-300 rounded overflow-y-scroll"
        }
      >
        {proposals.map((p, index) => (
          <div key={index} className="p-2 border border-gray-800">
            <div className="flex justify-between">
              <span>Proposal ID: {p.proposalId}</span>
              <span>Deadline: {p.deadline.toLocaleString()}</span>
            </div>
            <p>Fake NFT to Purchase: {p.nftTokenId}</p>
            <div className="flex">
              <span>Yay: {p.yayVotes}</span>
              <span className="pl-8">Nay: {p.nayVotes}</span>
            </div>
            <p>Executed?: {p.executed.toString()}</p>
            {p.deadline.getTime() > Date.now() && !p.executed ? (
              <div className={"flex"}>
                <Button onClick={() => voteOnProposal(p.proposalId, "YAY")}>
                  Vote YAY
                </Button>
                <Button
                  className={"ml-8"}
                  onClick={() => voteOnProposal(p.proposalId, "NAY")}
                >
                  Vote NAY
                </Button>
              </div>
            ) : p.deadline.getTime() < Date.now() && !p.executed ? (
              <div className={""}>
                <Button onClick={() => executeProposal(p.proposalId)}>
                  Execute Proposal {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                </Button>
              </div>
            ) : (
              <div className={""}>Proposal Executed</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-3xl leading-relaxed md:leading-snug mb-2">
        Welcome to the DAO!
      </h2>
      <CheckConnection>
        <div>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Your CryptoDevs NFT Balance: {nftBalance}
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Treasury Balance: {treasuryBalance} ETH
          </p>
          <p className="text-sm md:text-base text-gray-50 mb-4">
            Total Number of Proposals: {totalProposals}
          </p>
          <div className="flex">
            <Button onClick={() => setSelectedTab("Create Proposal")}>
              create proposal
            </Button>
            <Button
              className="ml-4"
              onClick={() => setSelectedTab("View Proposals")}
            >
              view proposals
            </Button>
          </div>
          <div>
            <RenderTab />
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
