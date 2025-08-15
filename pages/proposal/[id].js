import { Playfair_Display } from 'next/font/google'
import { BrowserProvider, Contract, formatUnits } from "ethers"
import { useEffect, useState } from "react"

import config from "../config.json"
import MyETHDAO from "../abis/MyETHDAO.json"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const Proposal = () => {
    const [signer, setSigner] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const [proposal, setProposal] = useState({})

    return (
        <div className="px-4 md:px-8 py-24 bg-white flex flex-col items-center pb-24">
        <div className="w-full max-w-6xl">
            {/* Title and Needs */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <h1 className={`${playfair.className} text-4xl sm:text-6xl md:text-7xl font-bold`}>
                EDUCATION DAPP
            </h1>
            <div className="text-left md:text-right">
                <p className="font-semibold opacity-50">needs:</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">2 ETH</h2>
            </div>
            </div>

            {/* Summary */}
            <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
            SUMMARY
            </h2>
            <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
            Aplikasi pembelajaran interaktif (misalnya pakai NFT badge) untuk mengajarkan dasar Ethereum, wallet, smart contract.
            </p>

            {/* Vote Section */}
            <div className="flex gap-4 mt-6">
            <div>
                <button className="bg-green-100 text-green-700 px-5 py-2 text-base sm:text-lg rounded-full cursor-pointer">
                agree
                </button>
                <p className="text-center mt-1">170</p>
            </div>
            <div>
                <button className="bg-red-100 text-red-700 px-5 py-2 text-base sm:text-lg rounded-full cursor-pointer">
                disagree
                </button>
                <p className="text-center mt-1">69</p>
            </div>
            </div>

            {/* About Owner */}
            <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
            ABOUT OWNER
            </h2>
            <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
            Saya Achmad Fauzan Husain lulusan jurusan rekayasa perangkat lunak di smk telkom makassar dan melanjutkan pendidikan tinggi di telkom university bandung dengan jurusan yang sama.
            </p>

            {/* Address Owner */}
            <h2 className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl mt-10 font-bold`}>
            ADDRESS OWNER
            </h2>
            <p className="w-full md:w-[75%] text-base sm:text-lg md:text-xl mt-2 opacity-65">
            084C......87654
            </p>
        </div>
        </div>
    )
}

export default Proposal