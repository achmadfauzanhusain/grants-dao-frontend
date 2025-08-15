import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getAddress } from "ethers";

export default function Navbar({ account, setAccount }) {
  const [isOpen, setIsOpen] = useState(false);

  const connectHandler = async () => {
    // fetch account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center px-6 py-6 md:py-8">
        <Link href="/treasury-balance" className="font-bold text-xs md:text-sm hover:bg-[#627EEA] hover:text-white p-1 px-2 rounded-lg cursor-pointer transition-all">TREASURY BALANCE</Link>

        {/* Desktop Button */}
        {account ? (
          <button className="hidden md:block p-1 px-2 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-[#627EEA] hover:text-white">
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button onClick={connectHandler} type="button" className="hidden md:block p-1 px-2 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-[#627EEA] hover:text-white">
            CONNECT
          </button>
        )}

        {/* Mobile Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="cursor-pointer">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Background overlay di kanan layar */}
      {isOpen && (
        <div
          className="fixed bg-white top-0 right-0 h-full w-3/5 bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-3/5 shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        {/* Tombol Close di dalam drawer */}
        <div className="flex justify-end p-4">
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
            <X size={24} />
            </button>
        </div>

        <div className="flex flex-col px-6 pt-4 gap-4 text-sm font-bold">
          {account ? (
            <button className="text-left p-2 rounded-lg hover:text-white hover:bg-[#627EEA] transition-all duration-300 cursor-pointer">
              {account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
          ) : (
            <button onClick={connectHandler} type="button" className="text-left p-2 rounded-lg hover:text-white hover:bg-[#627EEA] transition-all duration-300 cursor-pointer">
              CONNECT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}