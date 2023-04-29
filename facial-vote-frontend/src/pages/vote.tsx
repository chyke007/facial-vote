import Head from 'next/head'
import { useEffect, useState } from 'react'
import Navbar from 'src/components/Navbar';
import VoteCategory from 'src/components/VoteCategory';
import config from 'src/utils/config';
import { s3UploadUnAuth } from "src/utils/helpers";
import Iot from 'src/utils/iot'

export default function Vote() {
    enum Stages {
        VALIDATE_PHOTO,
        VOTE
    }

    const [stage, setStage] = useState(Stages.VALIDATE_PHOTO);
    const [file, setFile] = useState(null as any);
    const [isloading, setIsloading] = useState(false)
    const [credentials, setCredentials] = useState(null as any);
    const [voting, setVoting] = useState([])
    const [votingCandidates, setVotingCandidates] = useState([])
    const [otp, setOtp] = useState("");
    const [mqttClient, setMqttClient] = useState(null as any)


    const setupIoT = async () => {
        setMqttClient(await Iot(addTopicListeners));
    }

    useEffect(() => {
        setupIoT().catch(console.error);
    }, [])

    const handleSubmit = async (event: any) => {
        switch (stage) {
            case Stages.VALIDATE_PHOTO:
                uploadImage(event)
                break;
            case Stages.VOTE:
                submitVote(event);
                break;
        }
    }

    const getMessage = () => {
        if (isloading) {
            return "loading..."
        }
        switch (stage) {
            case Stages.VALIDATE_PHOTO:
                return "Authenticate";
            case Stages.VOTE:
                return "Vote";
        }
    }

    const selectFile = (e: any) => {
        setFile(e.target.files);
    }


    const uploadImage = async (event: any) => {
        event.preventDefault();

        if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        setIsloading(true)

        try {
            const fileName = `${Date.now()}-${file[0].name}`;

            mqttClient.subscribe(fileName);

            await s3UploadUnAuth(file[0], fileName);
        } catch (e) {
            alert(e);
            setIsloading(false);
        }
    }

    const addTopicListeners = (client: any) => {
        client.on('message', function (topic: string, payload: any) {
            const payloadEnvelope = JSON.parse(payload.toString());

            setIsloading(false);
            switch (payloadEnvelope.status) {
                case 'ERROR':
                    alert(payloadEnvelope.data.key);
                    break
                case 'SUCCESS':
                    setCredentials(payloadEnvelope.data.value);
                    setStage(Stages.VOTE)
                    break
            }
        })
    }

    const handleOtpChange = (e: any) => {
        setOtp(e.target.value)
    }

    const updateCandidate = (e: any) => {
        const votingId = e.target.value;
        let currentVoting: any = voting.find((e: any) => e.id == votingId)

        setVotingCandidates(JSON.parse(currentVoting.candidates))
    }

    const submitVote = async (event: any) => {
        event.preventDefault();

        const voting_id = event.target.category.value;
        const candidate_id = event.target.candidate.value;
        const user_id = credentials?.userId;


        if (voting_id == 0 || candidate_id == 0 || !user_id || !otp) {
            return;
        }

        setIsloading(true);
        const postData = async () => {
            const response = await fetch("/api/vote", {
                method: "POST",
                body: JSON.stringify({ voting_id, candidate_id, user_id, otp, credentials })
            });
            return response.json();
        };
        postData().then((data) => {
            setIsloading(false);
            if (data.message || data.error) {
                alert(data.message || data.error)
                return;
            }
        });
    }

    return (
        <>
            <Head>
                <title>Vote - FacePolls</title>
                <meta name="description" content="Vote - Facial Recognition Voting Application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col justify-center h-screen">
                <Navbar />
                <section className="flex lg:flex-row flex-col flex-col-reverse py-4 justify-center lg:mt-0 lg:h-screen h-auto overflow-hidden  text-white px-6">

                    <form onSubmit={handleSubmit} className="flex flex-col justify-center lg:w-1/3 px-4 pt-2 pb-8 mb-4 h-full ">
                        <p className="text-black bg-white p-2 rounded-md">
                            <b>Step 1: Upload face to validate</b> <br /> <br />
                            <b>Step 2: Select voting process to participate in </b> <br /> <br />
                            <b>Step 3: Provide your choices and submit</b> <br /> <br />
                        </p>
                        {stage == Stages.VALIDATE_PHOTO &&

                            <div className="my-2">
                                <input className="border border-2 border-black text-black w-full py-2 px-3" required onChange={selectFile} id="file" type="file" name="file" accept="image/png,  image/jpg, image/jpeg" />
                            </div>
                        }

                        {stage == Stages.VOTE &&

                            <VoteCategory voting={voting} setVoting={setVoting} updateVoting={updateCandidate}>
                                <select defaultValue={0} className="block font-bold w-1/2 bg-green-600 text-white py-3 px-4 m-2 rounded leading-tight focus:outline-none focus:bg-blue-600" name="candidate">
                                    <option disabled value={0}>Select Candidate</option>
                                    {
                                        votingCandidates.map((candidate: { id: string, name: string }) =>
                                            <option key={candidate.id} value={candidate.id} onChange={() => candidate.id}>{candidate.name}</option>)
                                    }

                                </select>
                                <div className="my-2">
                                    <input className=" appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={otp} onChange={handleOtpChange} id="otp" type="text" name="otp" placeholder="Enter OTP (check email)" />
                                </div>
                            </VoteCategory>
                        }

                        {stage == Stages.VOTE && voting.length == 0 ?
                            '' :
                            (<div className="flex">
                                <button className="bg-green-500 w-full hover:bg-white-700 text-white hover:text-green-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" disabled={isloading}>
                                    {getMessage()}
                                </button>
                            </div>
                            )
                        }
                    </form>

                </section>
            </main>
        </>
    )
}
