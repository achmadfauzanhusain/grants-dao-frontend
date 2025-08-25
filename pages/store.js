import { Playfair_Display } from 'next/font/google'
import { BrowserProvider, Contract, parseEther, parseUnits, formatUnits } from "ethers"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import config from "../config.json"
import MyETHDAO from "../abis/MyETHDAO.json"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const Treasury = () => {
    const [signer, setSigner] = useState(null)
    const [grantsDao, setGrantsDao] = useState(null)

    const [amount, setAmount] = useState("")
    const [stored, setStored] = useState("0")

    const loadBlockchainData = async() => {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
        })

        const provider = new BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()

        const signer = await provider.getSigner()
        setSigner(signer)
    
        // cek config ada untuk chainId ini
        if (!config[network.chainId] || !config[network.chainId].MyETHDAO) {
          toast.error("No contract found for this network!");
          return;
        }

        const contract = new Contract(
            config[network.chainId].MyETHDAO.address,
            MyETHDAO,
            signer
        )
        setGrantsDao(contract)
    }

    const amountStored = async() => {
        if (!grantsDao || !signer) return;

        const amountInWei = await grantsDao.treasuryBalance();
        const amountInGwei = formatUnits(amountInWei, "gwei")
        setStored(amountInGwei)
    }

    const storeETH = async() => {
        if(!grantsDao) return

        const cleanedAmount = amount.replace(",", ".").trim()
        if (!/^\d+$/.test(cleanedAmount)) {
            toast.warn("Input must be an integer in Gwei (without periods or commas)")
            return
        }

        // konvert amount to wei
        let amountInWei
        try {
            amountInWei = parseUnits(amount, "gwei")
        } catch (err) {
            toast.warn("Invalid input")
            return
        }
        
        // Minimal store = 0.01 ETH = 10_000_000 Gwei = 10_000_000_000_000_000 wei
        const minStoreInWei = parseEther("0.01")
        if (amountInWei < minStoreInWei) {
            toast.warn("Minimal store 0.01 ETH")
            return
        }

        const tx = await grantsDao.donateToTreasury({ value: amountInWei })
        await tx.wait()

        toast.success("Store sukses")
    }
    
    useEffect(() => {
        loadBlockchainData()
    }, [])

    useEffect(() => {
        if (signer && grantsDao) {
            amountStored()
        }
    }, [signer, grantsDao]);
    return (
        <div className="px-4 md:px-8 py-12 md:py-24 bg-white flex flex-col items-center">
            <div className="w-full max-w-6xl">
                <h2 className={`${playfair.className} text-3xl sm:text-5xl md:text-6xl mt-10 font-bold`}>
                DONATE ETH TO TREASURY
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
                    <p className='mt-2'>Total Treasury Balance : {stored} GWEI</p>
                    <button onClick={storeETH} className='mt-12 w-full py-4 cursor-pointer transition-all duration-300 rounded-md text-sm font-bold bg-[#627EEA] hover:bg-[#4a5bbd] text-white'>donate to treasury</button>
                </div>
            </div>
        </div>
    )
}

export default Treasury