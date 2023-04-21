import Head from 'next/head'
import { useEffect, useState } from 'react';
import Navbar from 'src/components/Navbar';
import VoteCategory from 'src/components/VoteCategory';

const dayjs = require('dayjs')

export default function Live() {

    const [voting, setVoting] = useState([])
    const [votes, setVotes] = useState([])
    const [loading, isloading] = useState(true);
    
    const updateVoting = (e: any) => {
        const votingId = e.target.value;
        

        const postData = async () => {
            console.log("Fetching results...")
            const response = await fetch(`/api/vote/${votingId}`, {
                method: "GET"
            });
            return response.json();
        };
        postData().then((data) => {
            if (data.message || data.error) {
                alert("Error fetching votes");
                return;
            }
            isloading(false)
            setVotes(data);
        });
    }

    return (
        <>
            <Head>
                <title>Live Result - Facial Recognition voting application</title>
                <meta name="description" content="Retrieve Account" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-full">
                <Navbar />
                <section className="flex lg:flex-row flex-col flex-col-reverse py-4 justify-center lg:mt-0 lg:h-screen h-auto overflow-hidden  text-white px-6">

                    <div className="flex flex-col justify-center lg:w-1/3 px-4 pt-2 pb-8 mb-4 h-1/2 ">
                        <p className="text-black bg-white p-2 h-1/3 mb-4 rounded-md">
                            <b>Step 1: Select Category to view result</b> <br /> <br />
                            <b>Step 2: Real-time result would also be shown </b> <br /> <br />
                        </p>

                        <VoteCategory voting={voting} setVoting={setVoting} updateVoting={updateVoting} />
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
