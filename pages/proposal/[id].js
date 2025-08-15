import { Playfair_Display } from 'next/font/google'
import { BrowserProvider, Contract, formatUnits } from "ethers"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

import config from "../../config.json"
import MyETHDAO from "../../abis/MyETHDAO.json"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const Proposal = () => {
    const [signer, setSigner] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const [proposal, setProposal] = useState({})

    const router = useRouter()
    const { id } = router.query

    const loadBlockchainData = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()

        const signer = await provider.getSigner()
        setSigner(signer)

        const contract = new Contract(
            config[network.chainId].MyETHDAO.address,
            MyETHDAO,
            signer
        )
        setGrantsDao(contract)
    }

    const fetchDetailProposal = async () => {
        if (!grantsDao || !signer) return;

        try {
            const proposalData = await grantsDao.proposals(id);
            const proposalDetail = {
                title: proposalData[0],
                summary: proposalData[1],
                amount: formatUnits(proposalData[2]), // convert from wei to ETH
                aboutOwner: proposalData[3],
                recipient: proposalData[4],
                deadline: new Date(Number(proposalData[5]) * 1000).toLocaleString(), // convert timestamp to date
                votesFor: Number(proposalData[6]),
                votesAgainst: Number(proposalData[7]),
                executed: proposalData[8]
            };
            setProposal(proposalDetail);
        } catch (error) {
            console.error("Error fetching proposal details:", error);
        }
    }

    const voteProposal = async (support) => {
        if (!grantsDao || !signer) return;

        try {
            const tx = await grantsDao.vote(id, support)
            await tx.wait();
            console.log("Vote successful:", tx);
        } catch (error) {
            alert(error.message);
        }
    }

    const executeProposal = async () => {
        if (!grantsDao || !signer) return;
        try {
            const tx = await grantsDao.executeProposal(id)
            await tx.wait();
            console.log("Proposal executed successfully:", tx);
            router.push('/');
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])
    useEffect(() => {
        if (signer && grantsDao) {
          fetchDetailProposal()
        }
    }, [signer, grantsDao])
    return (
        <div className="px-4 md:px-8 py-24 bg-white flex flex-col items-center pb-24">
            <div className="w-full max-w-6xl">
                {/* Title and Needs */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <h1 className={`${playfair.className} text-4xl sm:text-6xl md:text-7xl font-bold`}>
                    {proposal.title}
                </h1>
                <div className="text-left md:text-right">
                    <p className="font-semibold opacity-50">needs:</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">{proposal.amount} ETH</h2>
                </div>
                </div>

                {/* Summary */}
                <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
                SUMMARY
                </h2>
                <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
                {proposal.summary}
                </p>

                {/* Vote Section */}
                <div className="flex gap-4 mt-6">
                    <div>
                        <button onClick={() => voteProposal(true)} className="bg-green-100 text-green-700 hover:bg-green-200 transition-all px-4 py-2 text-base rounded-full cursor-pointer">
                        agree
                        </button>
                        <p className="text-center mt-1">{proposal.votesFor}</p>
                    </div>
                    <div>
                        <button onClick={() => voteProposal(false)} className="bg-red-100 text-red-700 hover:bg-red-200 transition-all px-4 py-2 text-base rounded-full cursor-pointer">
                        disagree
                        </button>
                        <p className="text-center mt-1">{proposal.votesAgainst}</p>
                    </div>
                </div>

                {/* About Owner */}
                <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
                ABOUT OWNER
                </h2>
                <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
                {proposal.aboutOwner}
                </p>

                {/* Address Owner */}
                <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
                ADDRESS OWNER
                </h2>
                <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
                {proposal.recipient}
                </p>

                {/* Deadline */}
                <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
                Deadline
                </h2>
                <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
                {proposal.deadline}
                </p>

                <button onClick={() => executeProposal(id)} className='bg-[#627EEA] hover:bg-[#4a5bbd] text-white transition-all duration-300 text-center w-full mt-8 py-4 text-xs md:text-sm font-semibold rounded-md cursor-pointer'>Execute Proposal</button>
            </div>
        </div>
    )
}

export default Proposal