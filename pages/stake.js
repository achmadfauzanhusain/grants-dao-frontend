import { Playfair_Display } from 'next/font/google'
import { BrowserProvider, Contract, Interface, parseEther } from "ethers";
import { useEffect, useState } from "react";

import config from "../config.json";
import MyETHDAO from "../abis/MyETHDAO.json";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const Stake = () => {
    const [provider, setProvider] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const loadBlockchainData = async() => {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new BrowserProvider(window.ethereum)
        setProvider(provider)

        const network = await provider.getNetwork();
        const signer = await provider.getSigner();

        const contract = new Contract(
            config[network.chainId].MyETHDAO.address,
            FauzanChenko,
            signer
        )
        setGrantsDao(contract);
    }

    const stakeETH = async (amount) => {
        if (!grantsDao) return;
        
    }

    useEffect(() => {
      loadBlockchainData();
    }, [])
    return (
        <div className="px-4 md:px-8 py-12 md:py-24 bg-white flex flex-col items-center">
            <div className="w-full max-w-6xl">
                <h2 className={`${playfair.className} text-3xl sm:text-5xl md:text-6xl mt-10 font-bold`}>
                STAKE ETH
                </h2>
                <p className="mt-2">0.01 ETH = 10000000  GWEI</p>

                <div>
                    <div className='flex items-end gap-2'>
                        <input 
                            type='number'
                            className='border-b-2 py-3 mt-14 outline-none w-[300px]'
                        />
                        <h2 className='text-2xl font-bold'>GWEI</h2>
                    </div>
                    <button className='mt-12 w-full py-4 cursor-pointer transition-all duration-300 rounded-md text-sm font-bold bg-[#627EEA] hover:bg-[#4a5bbd] text-white'>stake</button>
                </div>
            </div>
        </div>
    )
}

export default Stake