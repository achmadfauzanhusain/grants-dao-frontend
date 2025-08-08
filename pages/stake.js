import { Playfair_Display } from 'next/font/google'
import { BrowserProvider, Contract, parseEther, parseUnits, formatUnits } from "ethers"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

import config from "../config.json"
import MyETHDAO from "../abis/MyETHDAO.json"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const Stake = () => {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const [amount, setAmount] = useState("");
    const [staked, setStaked] = useState("0");

    const loadBlockchainData = async() => {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new BrowserProvider(window.ethereum)
        setProvider(provider)

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

    const amountStaked = async() => {
        if (!grantsDao || !signer) return;

        const amountInWei = await grantsDao.stakes(signer.address);
        const amountInGwei = formatUnits(amountInWei, "gwei")
        setStaked(amountInGwei)
    }

    const stakeETH = async() => {
        if (!grantsDao) return

        const cleanedAmount = amount.replace(",", ".").trim()
        if (!/^\d+$/.test(cleanedAmount)) {
            alert("Input harus berupa angka bulat dalam Gwei (tanpa titik atau koma)")
            return
        }
        
        // konvert amount to wei
        let amountInWei
        try {
            amountInWei = parseUnits(amount, "gwei")
        } catch (err) {
            alert("Invalid input")
            return
        }

        // Minimal stake = 0.01 ETH = 10_000_000 Gwei = 10_000_000_000_000_000 wei
        const minStakeInWei = parseEther("0.01")
        if (amountInWei < minStakeInWei) {
            alert("Minimal stake 0.01 ETH")
            return
        }

        const tx = await grantsDao.deposit({ value: amountInWei })
        await tx.wait()

        alert("Stake sukses")
    }

    useEffect(() => {
    loadBlockchainData();
    }, []);

    useEffect(() => {
    if (signer && grantsDao) {
        amountStaked();
    }
    }, [signer, grantsDao]);
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
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type='number'
                            className='border-b-2 py-3 mt-14 outline-none w-[300px]'
                        />
                        <h2 className='text-2xl font-bold'>GWEI</h2>
                    </div>
                    <p className='mt-2'>Jumlah hak voting anda sekarang : {staked / 10000000}</p>
                    <button onClick={stakeETH} className='mt-12 w-full py-4 cursor-pointer transition-all duration-300 rounded-md text-sm font-bold bg-[#627EEA] hover:bg-[#4a5bbd] text-white'>stake</button>
                </div>
            </div>
        </div>
    )
}

export default Stake