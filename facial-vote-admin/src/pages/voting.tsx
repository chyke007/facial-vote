import { Auth } from 'aws-amplify'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from 'src/components/Navbar';

import DataTable from 'react-data-table-component';

export default function Voting() {
    enum Stages {
        SIGN_IN,
        ADD_CATEGORY
    }
    
    const [stage, setStage] = useState(Stages.ADD_CATEGORY);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [voting , setVoting] = useState([])
    const [time_start, setTimeStart] = useState("");
    const [time_end, setTimeEnd] = useState("");
    const [description, setDescription] = useState("");
    const [candidates, setCandidates] = useState("");
    const [name, setName] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(true);
    const [isloading, setIsloading] = useState(false)
    const [cognitoUser, setCognitoUser] = useState(null as any);

    const handleSubmit = async (event: any) => {
        switch (stage) {
            case Stages.SIGN_IN:
                signIn(event)
                break;
            case Stages.ADD_CATEGORY:
                addVoting(event);
                break;
        }
    }

    useEffect(() => {
        //would remove this after auth is enabled
        getVotingCategory();

    }, [])
    const columns = [
        {
            id: 1,
            name: 'S/N',
            selector: (row: any, i:any) => (i+1),
            sortable: true,
        },
        {
            id: 2,
            name: 'Name',
            selector: (row: any) => row.name,
            sortable: true,
        },
        {
            id: 3,
            name: 'Description',
            selector: (row: any) => row.description,
            sortable: true,
        },
        {
            id: 4,
            name: 'Start Time',
            selector: (row: any) => row.time_start,
            sortable: true,
        },
        {
            id: 5,
            name: 'End Time',
            selector: (row: any) => row.time_end,
            sortable: true,
        },
        {
            id: 6,
            name: 'Candidates',
            selector: (row: any) => {
                let candidates = JSON.parse(row.candidates);
                return candidates.map((person: any) => person.name).join(',')
            },
            sortable: true,
        },
    ];

    const getMessage = () => {
        if (isloading) {
            return "loading..."
        }
        switch (stage) {
            case Stages.SIGN_IN:
                return "Sign In";
            case Stages.ADD_CATEGORY:
                return "Add Voting Category";
        }
    }

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value)
    }

    const handleTimeStartChange = (e: any) => {
        setTimeStart(e.target.value)
    } 

    const handleTimeEndChange = (e: any) => {
        setTimeEnd(e.target.value)
    }

    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value)
    }
     
    const handleCandidatesChange = (e: any) => {
        setCandidates(e.target.value)
    }

    const handleNameChange = (e: any) => {
        setName(e.target.value)
    }
    
    const signIn = async (event: any) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            setIsloading(true);
            let user = await Auth.signIn(email, password);

            console.log(user)
            setCognitoUser(user);
            setIsloading(false);
            setStage(Stages.ADD_CATEGORY);
            getVotingCategory();
            setIsSignedIn(true);
        } catch (error: any) {
            console.log(error.message)
            alert(error.message);
            setIsloading(false);
        }
    }

    const getVotingCategory = async () => {

        const getData = async () => {
            const response = await fetch("/api/voting", {
                method: "GET"
            });
            return response.json();
        };

        getData().then((data) => {
            if(data.Items){
                setVoting(data.Items)
                return;
            } else if (data.error) {
                alert(data?.error?.message || data.error);
                return;
            }

            alert("Unknown error!")
        });
    }

    const emptyVotingForm = async (event: any) => {
        
        setTimeStart("");
        setTimeEnd("");
        setCandidates("");
        setName("");
        setDescription("");
    }

    const addVoting = async (event: any) => {
        event.preventDefault();

        if (!name || !time_start || !time_end || !candidates || !description) {
            return;
        }

        setIsloading(true);

        const postData = async () => {
            const response = await fetch("/api/voting", {
                method: "POST",
                body: JSON.stringify({ name, time_start, time_end, candidates, description })
            });
            return response.json();
        };

        postData().then((data) => {
            setIsloading(false);

            if (data.message) {
                alert(data?.message?.message || data.message);
                emptyVotingForm("");
                getVotingCategory();
                return;
            } else if (data.error) {
                alert(data?.error?.message || data.error);
                return;
            }

            alert("Unknown error!")
        });
    }

    return (
        <>
            <Head>
                <title>Admin - FacePolls</title>
                <meta name="description" content="Admin - Facial Recognition Voting Application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col justify-center h-full">
                <Navbar />
                <section className="flex flex-wrap py-4 justify-center items-center lg:mt-0 lg:h-screen h-auto text-white px-6 pt-16">

                    <form onSubmit={handleSubmit} className="flex flex-col justify-center lg:w-1/2 px-4 pt-2 pb-8 mb-4 h-full w-full">
                        <p className="text-black bg-white p-2 rounded-md">
                            <b>Step 1: Log in</b> <br /> <br />
                            <b>Step 2: Enter Voting details and submit</b> <br /> <br />
                           
                        </p>
                        {!isSignedIn &&
                            <div className="my-4">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={email} onChange={handleEmailChange} id="email" type="email" name="email" placeholder="Your Email" />
                                <input className="appearance-none border w-full py-2 px-3 mt-4  text-black leading-tight focus:outline-none focus:shadow-outline" required value={password} onChange={handlePasswordChange} id="password" type="password" name="password" placeholder="Password" />
                            </div>

                            
                        }
                        {stage == Stages.ADD_CATEGORY && isSignedIn &&
                            <>
                            <div className="my-2">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={name} onChange={handleNameChange} id="name" type="text" name="name" placeholder="Category Name" />
                            </div>

                            <div className="my-2">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={time_start} onChange={handleTimeStartChange} id="time_start" type="text" name="time_start" placeholder="StartTime (Example: 2023-04-25 10:30)" />
                            </div>

                            <div className="my-2">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={time_end} onChange={handleTimeEndChange} id="time_end" type="text" name="time_end" placeholder="EndTime (Example: 2023-04-25 16:30)" />
                            </div>

                            <div className="my-2">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={candidates} onChange={handleCandidatesChange} id="candidates" type="text" name="candidates" placeholder="Candidates (Example: John,Jane,Jack)" />
                            </div>

                            <div className="my-2">
                                <textarea className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={description} onChange={handleDescriptionChange} id="username" cols={3} rows={3} name="description" placeholder="Category Description" />
                            </div>

                            </>
                            
                        }
                        <div className="flex">
                            <button className="bg-green-500 w-full hover:bg-white-700 text-white hover:text-green-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" disabled={isloading}>
                                {getMessage()}
                            </button>
                        </div>
                    </form>

                    <aside className="lg:w-1/2 w-full h-full pt-12">
                    <DataTable
                            title="Voting Category"
                            columns={columns}
                            data={voting}
                            defaultSortFieldId={2}
                        />
                    </aside>
                </section>
            </main>
        </>
    )
}
