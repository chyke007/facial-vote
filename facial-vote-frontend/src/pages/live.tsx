import Head from 'next/head'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Navbar from 'src/components/Navbar';
import VoteCategory from 'src/components/VoteCategory';

import Chart from 'src/components/Chart';
import Iot from 'src/utils/iot';
import config from 'src/utils/config';

export default function Live() {

    const [voting, setVoting] = useState([] as any)
    const [votes, setVotes] = useState([] as any)
    const [votingId, setVotingId] = useState(0)
    const [realtime, setRealtime] = useState(null)
    const [mqclient, setMqClient] = useState(null)
    const [chartData, setChartData] = useState({} as any)
    const [loading, isloading] = useState(false);

    const setupIoT = async () => {
        let mqclient = await Iot(addTopicListeners);
        setMqClient(mqclient)
        mqclient.subscribe(config.IoT.VOTE_ADDED);
    }

    useEffect(() => {
        if (!mqclient) {
            setupIoT().catch(console.error);
        } else {
            updateVote(realtime)
        }
    }, [realtime])


    const chartRaw = {
        version: 1.0,
        totalCharts: 2,
        charts: [
            {
                name: "Pie",
                chartType: "PieChart",
                data: [
                    ["Candidate", "Votes"]
                ],
                options: {
                    "title": "Stats"
                },
                width: "100%",
                height: "300px"
            },
            {
                name: "Bar",
                chartType: "BarChart",
                data: [
                    ["Candidate", "Votes"]
                ],
                options: {
                    "title": "Stats"
                },
                width: "100%",
                height: "300px"
            }
        ]
    }


    const columns = [
        {
            id: 1,
            name: 'Candidate',
            selector: (row: any) => row.candidate_name,
            sortable: true,
        },
        {
            id: 2,
            name: 'Votes',
            selector: (row: any) => row.candidate_vote,
            sortable: true,
        },
    ];

    const updateCharts = (data: Array<any>) => {
        data.forEach((val: any) => {
            chartRaw.charts[0].data.push([val.candidate_name, val.candidate_vote])
            chartRaw.charts[1].data.push([val.candidate_name, val.candidate_vote])
        })

        setChartData(chartRaw)
    }

    const updateChartsReal = (data: Array<any>) => {
        chartRaw.charts[0].data = [["Candidate", "Votes"]]
        chartRaw.charts[1].data = [["Candidate", "Votes"]]

        data.forEach((val: any) => {
            chartRaw.charts[0].data.push([val.candidate_name, val.candidate_vote])
            chartRaw.charts[1].data.push([val.candidate_name, val.candidate_vote])
        })

        setChartData(chartRaw)
    }

    const updateVoting = (e: any) => {
        const votingIdLo = e.target.value;

        setVotingId(votingIdLo);
        isloading(true)

        const postData = async () => {
            const response = await fetch(`/api/vote/${votingIdLo}`, {
                method: "GET"
            });
            return response.json();
        };
        postData().then((data) => {
            if (data.message || data.error) {
                alert("Error fetching votes");
                return;
            }
            isloading(false);

            if (data.Count == 0) {
                setVotes([]);
            } else {
                setVotes(data.Items);
                updateCharts(data.Items);

            }
        });


    }

    const updateVote = (data: any) => {
        if (Number(votingId) != Number(data.voting_id)) {
            return
        }

        delete data.voting_id;

        if (votes.length == 0) {
            let newVote: any = [{ ...data, candidate_vote: 1 }]

            setVotes(newVote);
            updateCharts(newVote)
        } else {

            const id = votes.findIndex((vote: any) => Number(vote.candidate_id) == Number(data.candidate_id));
            let newVote: any = [...votes]

            if (id != -1) {

                newVote[id].candidate_vote += 1
            } else {
                newVote.push({ ...data, candidate_vote: 1 })
            }

            setVotes(newVote);
            updateChartsReal(newVote)
        }
    }

    const customSort = (rows: any, selector: any, direction: any) => {
        return rows.sort((rowA: any, rowB: any) => {
            const aField = selector(rowA)
            const bField = selector(rowB)

            let comparison = 0;

            if (aField > bField) {
                comparison = 1;
            } else if (aField < bField) {
                comparison = -1;
            }

            return direction === 'asc' ? comparison * -1 : comparison;
        });
    };

    const addTopicListeners = (client: any) => {
        client.on('message', (topic: string, payload: any) => {
            const payloadEnvelope = JSON.parse(payload.toString())

            switch (payloadEnvelope.status) {
                case 'ERROR':
                    alert(payloadEnvelope.data.key);
                    break
                case 'SUCCESS':
                    setRealtime(payloadEnvelope.data.value)
                    break
            }
        })
    }

    return (
        <>
            <Head>
                <title>Live Result - Facial Recognition voting application</title>
                <meta name="description" content="Retrieve Account" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                <Navbar />
                <section className="flex lg:flex-row flex-col flex-col-reverse py-4 justify-center overflow-hidden  text-white px-6">

                    <div className="flex flex-col justify-center w-full px-4 pt-2 pb-8 mb-4 h-1/2 ">
                        <VoteCategory voting={voting} setVoting={setVoting} updateVoting={updateVoting} />

                        {

                            loading ? (
                                <span className="flex justify-center  h-1/3 w-full mt-8">
                                    <p className="bold  rounded-md p-4 mb-4 text-black bg-white">Loading votes ...</p> <br />
                                </span>
                            ) : ''
                        }

                        <DataTable
                            title="Voting Result"
                            columns={columns}
                            data={votes}
                            defaultSortFieldId={2}
                            sortFunction={customSort}
                        />

                        {votes && votes.length > 0 && chartData.charts && chartData.charts.map((data: any, i: number) => (
                            <Chart chart={data} key={i} />
                        ))}
                        <div className="flex mt-12">
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
