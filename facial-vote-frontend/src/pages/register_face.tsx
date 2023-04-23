import { Auth } from 'aws-amplify'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from 'src/components/Navbar';
import config from 'src/utils/config';
import { s3Upload } from "src/utils/helpers";
import Iot from 'src/utils/iot'

export default function Register_Face() {
    enum Stages {
        RETRIEVE_ACCOUNT,
        VALIDATE_OTP,
        ADD_PHOTO
    }
    
    const [stage, setStage] = useState(Stages.RETRIEVE_ACCOUNT);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [file, setFile] = useState(null as any);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isloading, setIsloading] = useState(false)
    const [cognitoUser, setCognitoUser] = useState(null as any);
    const [mqttClient, setMqttClient] = useState(null as any)

    const [attemptsLeft, setAttemptsLeft] = useState(3);

    const setupIoT = async () => {
        setMqttClient(await Iot(addTopicListeners))
    }
    useEffect(() => {
        setupIoT().catch(console.error);
      }, [])

    const handleSubmit = async (event: any) => {
        switch (stage) {
            case Stages.ADD_PHOTO:
                uploadImage(event)
                break;
            case Stages.VALIDATE_OTP:
                validateOtp(event);
                break;
            case Stages.RETRIEVE_ACCOUNT:
                retrieveAccount(event);
                break;
        }
    }

    const getMessage = () => {
        if (isloading) {
            return "loading..."
        }
        switch (stage) {
            case Stages.ADD_PHOTO:
                return "Add Photo";
            case Stages.VALIDATE_OTP:
                return "Validate OTP";
            case Stages.RETRIEVE_ACCOUNT:
                return "Retrieve Account";
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

    const retrieveAccount = async (event: any) => {
        event.preventDefault();
        const email = event.target.email.value;
        try {
            setIsloading(true);
            let user = await Auth.signIn(email);
            setCognitoUser(user);
            setIsloading(false);
            setStage(Stages.VALIDATE_OTP);
        } catch (error: any) {
            console.log(error.message)
            alert(error.message);
            setIsloading(false);
        }
    }

    const uploadImage = async (event: any) => {
        event.preventDefault();

        if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }
        setIsloading(true);
        try {
            await s3Upload(file[0], await Auth.currentUserInfo());
        } catch (e) {
            alert(e);
            setIsloading(false);
        }
    }
    
    async function signOut() {
        try{
            await Auth.signOut()
        }catch(err){
            console.log(err)
        }
        setCognitoUser(null);
        setOtp("");
        setEmail("")
        setIsSignedIn(false);
        setStage(Stages.RETRIEVE_ACCOUNT);
    }

    const validateOtp = async (event: any) => {
        event.preventDefault();

        const otp = event.target.otp.value;

        try {
            setIsloading(true);
            const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, otp)
            if (challengeResult.challengeName) {
                setIsloading(false);
                setOtp("");
                setAttemptsLeft(parseInt(challengeResult.challengeParam?.attemptsLeft))
                alert(`The code you entered is incorrect. ${attemptsLeft} attempts left.`)
            } else {
                setIsSignedIn(true);
                setIsloading(false);
                setStage(Stages.ADD_PHOTO);
                mqttClient.subscribe(cognitoUser.username);
            }
        } catch (error) {
            console.log(error)
            setOtp("");
            setIsloading(false);
            setCognitoUser(null);
            setEmail("")
            setIsSignedIn(false);
            setStage(Stages.RETRIEVE_ACCOUNT);
            alert('Too many failed attempts. Please try again.');
        }
    }

    const addTopicListeners = (client: any) => {
        client.on('message', function (topic: string, payload: any) {
            const payloadEnvelope = JSON.parse(payload.toString())

            setIsloading(false);
            switch (payloadEnvelope.status) {
                case 'ERROR':
                  alert(payloadEnvelope.data.key);
                  break
                case 'SUCCESS':
                  alert("Face added successfully!")
                  signOut();
                  break
            }
        })
    }

    return (
        <>
            <Head>
                <title>Retrieve Account - Facial Recognition Voting Application</title>
                <meta name="description" content="Retrieve Account - Facial Recognition Voting Application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col justify-center h-screen">
                <Navbar />
                <section className="flex lg:flex-row flex-col flex-col-reverse py-4 justify-center lg:mt-0 lg:h-screen h-auto overflow-hidden  text-white px-6">

                    <form onSubmit={handleSubmit} className="flex flex-col justify-center lg:w-1/3 px-4 pt-2 pb-8 mb-4 h-full ">
                        <p className="text-black bg-white p-2 rounded-md">
                            <b>Step 1: Enter email to retrieve account</b> <br /> <br />
                            <b>Step 2: Enter OTP sent to email into OTP text field </b> <br /> <br />
                            <b>Step 3: Upload face to attach to email account</b> <br /> <br />
                        </p>
                        {!isSignedIn &&
                            <div className="my-4">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={email} onChange={handleEmailChange} id="email" type="email" name="email" placeholder="Email" />
                            </div>
                        }
                        {stage == Stages.VALIDATE_OTP &&

                            <div className="my-2">
                                <input className=" appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={otp} onChange={handleOtpChange} id="otp" type="text" name="otp" placeholder="Enter OTP (check email)" />
                            </div>
                        }

                        {stage == Stages.ADD_PHOTO && isSignedIn &&

                            <div className="my-2">
                                <input className="border border-2 border-black text-black w-full py-2 px-3" required onChange={selectFile} id="file" type="file" name="file" accept="image/png,  image/jpg, image/jpeg" />
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
