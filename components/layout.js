import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { getAddress } from 'ethers'

import Navbar from './navbar'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['200', '400', '600', '800']
})

const Layout = ({ children }) => {
    const [account, setAccount] = useState(null)

    const loadBlockchainData = async () => {
        // refresh account
        window.ethereum.on("accountsChanged", async() => {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
            const account = await getAddress(accounts[0])
            setAccount(account)
        })
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])
    return (
        <>
            <Head>
                <title>Grants DAO</title>
            </Head>
            <div className={poppins.className}>
                <Navbar account={account} setAccount={setAccount} />
                {children}
            </div>
        </>
    )
}

export default Layout;