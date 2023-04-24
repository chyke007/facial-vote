import { Auth } from 'aws-amplify'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from 'src/components/Navbar';

import DataTable from 'react-data-table-component';

export default function Users() {
    enum Stages {
        SIGN_IN,
        ADD_USER
    }

    const [stage, setStage] = useState(Stages.ADD_USER);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(true);
    const [isloading, setIsloading] = useState(false)
    const [cognitoUser, setCognitoUser] = useState(null as any);

    const handleSubmit = async (event: any) => {
        switch (stage) {
            case Stages.SIGN_IN:
                signIn(event)
                break;
            case Stages.ADD_USER:
                addUser(event);
                break;
        }
    }

    useEffect(() => {
        //would remove this after auth is enabled
        getUsers();

    }, [])
    const columns = [
        {
            id: 1,
            name: 'S/N',
            selector: (row: any) => row.id,
            sortable: true,
        },
        {
            id: 2,
            name: 'Email',
            selector: (row: any) => row.Value,
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
            case Stages.ADD_USER:
                return "Add User";
        }
    }

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value)
    }

    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value)
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
            setStage(Stages.ADD_USER);
            getUsers();
            setIsSignedIn(true);
        } catch (error: any) {
            console.log(error.message)
            alert(error.message);
            setIsloading(false);
        }
    }

    const getUsers = async () => {

        const getData = async () => {
            const response = await fetch("/api/user", {
                method: "GET"
            });
            return response.json();
        };

        getData().then((data) => {

            if (data.message) {
                const reformedUser = data.message.map((user: any, i: number) => {
                    let innerData = user.Attributes.find((e: any) => e.Name == 'email');
                    delete innerData.Name;
                    innerData.id = (i + 1)
                    return innerData;
                })

                setUsers(reformedUser);
                return;

            } else if (data.error) {
                alert(data?.error?.message || data.error);
                return;
            }

            alert("Unknown error!")
        });
    }

    const addUser = async (event: any) => {
        event.preventDefault();
        
        if (!username) {
            return;
        }

        setIsloading(true);

        const postData = async () => {
            const response = await fetch("/api/user", {
                method: "POST",
                body: JSON.stringify({ email: username })
            });
            return response.json();
        };

        postData().then((data) => {
            setIsloading(false);

            if (data.message) {
                alert(data?.message?.message || data.message);
                setUsername("");
                getUsers();
                return;
            } else if (data.error) {
                alert(data?.error?.message || data.error);
                setUsername("");
                return;
            }

            alert("Unknown error!")
        });
    }

    return (
        <>
            <Head>
                <title>Admin - Facial Recognition Voting Application</title>
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
                            <b>Step 2: Enter users email and submit</b> <br /> <br />

                        </p>
                        {!isSignedIn &&
                            <div className="my-4">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={email} onChange={handleEmailChange} id="email" type="email" name="email" placeholder="Your Email" />
                                <input className="appearance-none border w-full py-2 px-3 mt-4  text-black leading-tight focus:outline-none focus:shadow-outline" required value={password} onChange={handlePasswordChange} id="password" type="password" name="password" placeholder="Password" />
                            </div>


                        }
                        {stage == Stages.ADD_USER && isSignedIn &&

                            <div className="my-2">
                                <input className="appearance-none border w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required value={username} onChange={handleUsernameChange} id="username" type="email" name="username" placeholder="User Email" />
                            </div>
                        }
                        <div className="flex">
                            <button className="bg-green-500 w-full hover:bg-white-700 text-white hover:text-green-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" disabled={isloading}>
                                {getMessage()}
                            </button>
                        </div>
                    </form>

                    <aside className="lg:w-1/2 w-full h-full pt-12">
                        <DataTable
                            title="Users"
                            columns={columns}
                            data={users}
                            defaultSortFieldId={1}
                        />
                    </aside>
                </section>
            </main>
        </>
    )
}
