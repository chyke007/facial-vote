import { Amplify, Auth } from 'aws-amplify'
import Head from 'next/head'
import { useState } from 'react'
import Navbar from 'src/components/Navbar';
import { awsExport } from 'src/utils/aws-export';
import config from 'src/utils/config';
import { s3Upload } from "src/utils/helpers";

export default function Vote() {
    Amplify.configure(awsExport);
    enum Stages {
        VALIDATE_PHOTO,
        SELECT_VOTE,
        VOTE
    }

    const [stage, setStage] = useState(Stages.VALIDATE_PHOTO);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [file, setFile] = useState(null as any);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isloading, setIsloading] = useState(false)
    const [cognitoUser, setCognitoUser] = useState(null as any);

    const [attemptsLeft, setAttemptsLeft] = useState(3);

    const handleSubmit = async (event: any) => {
        switch (stage) {
            case Stages.VALIDATE_PHOTO:
                uploadImage(event)
                break;
            case Stages.SELECT_VOTE:
                retrieveVoteDetails(event);
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
            case Stages.SELECT_VOTE:
                return "Next";
            case Stages.VOTE:
                return "Submit";
        }
    }

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    const handleOtpChange = (e: any) => {
        setOtp(e.target.value)
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
            await s3Upload(file[0], await Auth.currentUserInfo());
            alert("Success");
            setIsloading(false);

            //Wait for AWS IoT before proceeding with an error message or success
            //if succes, then signout user
            //else remain on this step
            //signOut();
        } catch (e) {
            alert(e);
            setIsloading(false);
        }
    }
    //sign out after image successful upload
    //move back to step 1
    async function signOut() {
        await Auth.signOut()
        setCognitoUser(null);
        setOtp("");
        setIsSignedIn(false);
        setStage(Stages.VALIDATE_PHOTO);
        console.log(await Auth.currentUserInfo())
    }

    const retrieveVoteDetails = async (event: any) => {
        event.preventDefault();

        const vote = event.target.vote.value;    
    }

    const submitVote = async (event: any) => {
        event.preventDefault();

        const vote = event.target.vote.value;    
    }

    return (
        <>
            <Head>
                <title>Vote</title>
                <meta name="description" content="Vote Now" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-full">
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

                        {stage == Stages.SELECT_VOTE &&
                            <div className="my-4">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={email} onChange={handleEmailChange} id="email" type="email" name="email" placeholder="Email" />
                            </div>
                        }
                        {stage == Stages.VOTE &&

                            <div className="my-2">
                                <input className=" appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={otp} onChange={handleOtpChange} id="otp" type="text" name="otp" placeholder="Enter OTP (check email)" />
                            </div>
                        }

                        
                        <div className="flex">
                            <button className="bg-green-500 w-full hover:bg-white-700 text-white hover:text-green-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" disabled={isloading}>
                                {getMessage()}
                            </button>
                        </div>
                    </form>

                </section>
            </main>
        </>
    )
}
