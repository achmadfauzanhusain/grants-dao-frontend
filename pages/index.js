import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import { BrowserProvider, Contract, formatUnits } from "ethers"
import { useEffect, useState } from "react"

import config from "../config.json"
import MyETHDAO from "../abis/MyETHDAO.json"

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '600', '800']
})

export default function Home() {
  const [signer, setSigner] = useState(null)
  const [grantsDao, setGrantsDao] = useState(null)

  const [proposals, setProposals] = useState([])

  const loadBlockchainData = async() => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
    })
  
    const provider = new BrowserProvider(window.ethereum)
    const network = await provider.getNetwork()

    console.log("Network dari provider:", network);
    console.log("chainId (number):", Number(network.chainId));
  
    const signer = await provider.getSigner()
    setSigner(signer)

    // cek config ada untuk chainId ini
    if (!config[network.chainId] || !config[network.chainId].MyETHDAO) {
      console.error("Kontrak untuk jaringan ini tidak ditemukan!");
      return;
    }
  
    const contract = new Contract(
      config[network.chainId].MyETHDAO.address,
      MyETHDAO,
      signer
    )
    setGrantsDao(contract)
  }

  // fetch all proposals data
  const fetchProposals = async() => {
    if (!grantsDao || !signer) return;

    try {
      const proposalsCount = await grantsDao.proposalCount();
      const proposals = [];
      for (let i = 1; i <= Number(proposalsCount); i++) {
        const proposal = await grantsDao.proposals(i);
        proposals.push({
          title: proposal[0],
          description: proposal[1],
          amount: formatUnits(proposal[2]), // ubah dari wei ke ETH
          summary: proposal[3],
          recipient: proposal[4],
          deadline: new Date(Number(proposal[5]) * 1000).toLocaleString(), // ubah timestamp ke tanggal
          votesFor: Number(proposal[6]),
          votesAgainst: Number(proposal[7]),
          executed: proposal[8]
        })
        setProposals(proposals.filter(p => !p.executed));
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])
  useEffect(() => {
    if (signer && grantsDao) {
      fetchProposals();
    }
  }, [signer, grantsDao]);
  return (
    <div>
      {/* Board */}
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className={`text-center text-7xl md:text-8xl font-bold ${playfair.className}`}>GRANTS DAO</h1>
        <p className="text-lg md:text-xl mt-4 text-center opacity-75">funding & supporting web3 <br /> projects</p>

        <div className="flex mt-8 gap-4">
          <Link href="/store" className="bg-[#627EEA] text-xs md:text-sm text-white px-7 md:px-9 py-4 rounded-md font-semibold hover:bg-[#4a5bbd] transition-all">
            STORE ETH
          </Link>

          <Link href="/stake" className="border-[#627EEA] text-xs md:text-sm border-2 text-[#627EEA] px-7 md:px-9 py-4 rounded-md font-semibold hover:bg-[#627EEA] hover:text-white transition-all">
            STAKE ETH
          </Link>
        </div>
      </div>

      {/* Proposal */}
      <div className='px-4 md:px-8 py-8 bg-white flex flex-col items-center'>
        {/* Head */}
        <div className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full max-w-6xl gap-4'>
          <div>
            <h1 className={`${playfair.className} font-bold text-4xl md:text-6xl`}>PROPOSAL</h1>
            <p className='text-sm md:text-base mt-4 opacity-60 w-[75%] sm:w-full'>
              you must stake 0.01 ETH for 1 vote & stake <br className='hidden sm:block' />
              min 0.1 ETH for create proposal
            </p>
          </div>
          <Link href="/proposal/create" className="bg-[#627EEA] hover:bg-[#4a5bbd] transition-all duration-300 text-white font-semibold rounded-md px-5 py-3 text-xs md:text-sm">
            Create Proposal
          </Link>
        </div>

        {/* List Proposals */}
        <div className="mt-6 w-full max-w-6xl flex flex-col gap-4">
          {proposals.map((proposal, index) => (
            <Link key={index} href={`/proposal/${index + 1}`} className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-6 bg-[#F6F6F6] rounded-2xl gap-6 shadow-sm">
              {/* Left Section */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-4xl font-bold">{proposal.title}</h2>
                <p className="mt-2 text-sm md:text-base text-gray-500 max-w-md">
                  {proposal.description}
                </p>
              </div>

              {/* Right Section */}
              <div className="text-left md:text-right min-w-[140px]">
                <h2 className="text-xl md:text-3xl font-bold">{proposal.amount} ETH</h2>
                <div className="mt-2 text-xs md:text-sm text-gray-600">
                  <p className="mb-1">vote for:</p>
                  <div className="flex gap-2 justify-end">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {proposal.votesFor} agree
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {proposal.votesAgainst} don't agree
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  <span className="font-semibold">Deadline:</span> {proposal.deadline}
                </p>
                <p className="mt-1 text-xs md:text-sm text-gray-500">
                  <span className="font-semibold">Recipient:</span> {proposal.recipient}
                </p>
                <p className="mt-1 text-xs md:text-sm text-gray-500">
                  <span className="font-semibold">Status:</span> {proposal.executed ? "Executed" : "Pending"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
