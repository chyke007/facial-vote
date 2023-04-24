import Head from 'next/head'
import Navbar from 'src/components/Navbar';

export default function Home() {

  return (
    <>
      <Head>
        <title>Admin - Facial Recognition Voting Application</title>
        <meta name="description" content="Home - Facial Recognition Voting Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center h-screen">

        <Navbar />
        <section className="flex lg:flex-row flex-col flex-col-reverse py-4 justify-center lg:mt-0 lg:h-screen h-auto overflow-hidden  text-white px-6">

          <div className="flex flex-col justify-center lg:w-1/3 px-4 pt-2 pb-8 mb-4 h-full ">
            <p className="text-black bg-white p-2 h-1/3 mb-4 h-auto -rounded-md">
              <b>Admin - Facial Recognition voting application</b> <br /> <br />
            </p>



            <div className="flex">
              <button className="bg-green-500 w-full hover:bg-white-700 text-white hover:text-green-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline" type="submit">
                Powered by AWS
              </button>
            </div>
          </div>

        </section>
      </main>
    </>
  )
}
