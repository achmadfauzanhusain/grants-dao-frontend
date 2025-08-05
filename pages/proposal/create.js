import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '800']
})

const CreateProposal = () => {
  return (
    <div className="px-4 md:px-8 py-12 md:py-24 bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h2 className={`${playfair.className} text-3xl sm:text-5xl md:text-6xl mt-10 font-bold`}>
          CREATE PROPOSAL
        </h2>

        {/* form */}
        <div className="mt-10 md:mt-14 flex flex-col gap-10 md:gap-14">
          {/* title */}
          <input
            type="text"
            placeholder="What is the name of your proposal?"
            className="outline-none border-b-2 w-full sm:w-[90%] text-2xl sm:text-3xl md:text-4xl py-3 font-semibold"
          />

          {/* summary */}
          <input
            type="text"
            placeholder="What is the proposal summary?"
            className="outline-none border-b-2 w-full sm:w-[90%] text-2xl sm:text-3xl md:text-4xl py-3 font-semibold"
          />

          {/* eth amount */}
          <div>
            <h2 className={`${playfair.className} uppercase text-base sm:text-xl md:text-2xl font-bold`}>
              How much ETH do you need?
            </h2>
            <input
              type="number"
              placeholder="0"
              className="outline-none border-b-2 text-2xl sm:text-3xl md:text-4xl py-3 font-semibold w-32"
            />
          </div>

          {/* about owner */}
          <div>
            <h2 className={`${playfair.className} uppercase text-base sm:text-xl md:text-2xl font-bold`}>
              Explain yourself as proposal owner
            </h2>
            <input
              type="text"
              placeholder="Whats your name? education? social media? etc"
              className="outline-none border-b-2 w-full sm:w-[90%] text-base sm:text-xl md:text-2xl py-3 font-semibold"
            />
          </div>

          {/* recipient */}
          <div>
            <h2 className={`${playfair.className} uppercase text-base sm:text-xl md:text-2xl font-bold`}>
              RECIPIENT
            </h2>
            <h2 className="uppercase opacity-50 text-base sm:text-xl md:text-2xl font-bold">
              Address Your Account Now
            </h2>
          </div>

          {/* deadline */}
          <div>
            <h2 className={`${playfair.className} uppercase text-base sm:text-xl md:text-2xl font-bold`}>
              Deadline
            </h2>
            <h2 className="uppercase opacity-50 text-base sm:text-xl md:text-2xl font-bold">
              3 Days
            </h2>
          </div>

            {/* submit button */}
            <button className="bg-[#627EEA] hover:bg-[#4a5bbd] transition-all duration-300 font-semibold rounded-md text-white px-6 py-3 text-sm cursor-pointer">
                Create Proposal
            </button>
        </div>
      </div>
    </div>
  )
}

export default CreateProposal
