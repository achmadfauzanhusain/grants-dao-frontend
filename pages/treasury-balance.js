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

const TreasuryBalance = () => {
    const [signer, setSigner] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const [treasuryBalance, setTreasuryBalance] = useState(0)

    const loadBlockchainData = async() => {
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

    const fetchTreasuryBalance = async() => {
        if (!grantsDao || !signer) return;

        try {
            const balance = await grantsDao.treasuryBalance();
            setTreasuryBalance(formatUnits(balance, 18)); // ubah dari wei ke ETH
        } catch (error) {
            console.error("Error fetching treasury balance:", error);
        }
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])
    useEffect(() => {
        if (signer && grantsDao) {
          fetchTreasuryBalance()
        }
    }, [signer, grantsDao])
    return (
        <div className="flex justify-center flex-col items-center h-screen">
            <h1 className={`${playfair.className} text-2xl md:text-3xl font-bold`}>Total Treasury Balance</h1>
            <p className='text-2xl md:text-4xl font-bold mt-3'>{treasuryBalance} ETH</p>
        </div>
    );
}

export default TreasuryBalance;