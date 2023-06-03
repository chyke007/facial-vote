import { useEffect, useState } from 'react';
const dayjs = require('dayjs');

interface Row {
    [key: string]: any
}

export default function VoteCategory({ voting, setVoting, updateVoting, children, shouldDisable = true }: Row) {

    const [loading, isloading] = useState(true);

    const initialize = async () => {
        await retrieveVoteDetails()

    }
    useEffect(() => {
        initialize().catch(console.error);
    }, [])

    const checkDateRange = (voting: Row) => {
        if (dayjs().isBefore(dayjs(voting.time_start))) {
            return "Voting hasn't begun";
        } else if (dayjs().isAfter(dayjs(voting.time_end))) {
            return "Voting has ended";
        }
        return true
    }

    const retrieveVoteDetails = async () => {
        const postData = async () => {
            const response = await fetch("/api/voting", {
                method: "GET"
            });
            return response.json();
        };
        postData().then((data) => {
            if (data.message || data.error) {
                alert("Error fetching voting process");
                return;
            }
            isloading(false)
            loadVotingData(data);
        });

    }


    const loadVotingData = (data: { Items: Array<Row>, Count: number }) => {
        if (data.Count == 0) {
            setVoting([])
            return;
        }

        data.Items.map(async (item: Row) => {
            const check = checkDateRange(item);
            item.disabled = false

            if (check !== true) {
                item.name = `${item.name} (${check})`
                item.disabled = true
            }
        })
        setVoting(data.Items)
    }
    return (
        <>
            <div className="my-2 text-black">
                {
                    voting.length == 0 ?
                        (
                            <p className="text-black bg-white p-2 h-1/3 mb-4 rounded-md mt-8">
                                <b>{loading ? 'loading...' : 'No voting process exist'}</b><br /> <br />
                            </p>
                        ) :
                        (
                            <section className='flex flex-wrap items-center w-full justify-center'>
                                <select defaultValue={0} onChange={(e) => updateVoting(e)} className="block font-bold w-1/2 bg-green-600 text-white py-3 px-4 m-2 rounded leading-tight focus:outline-none focus:bg-green-600" name="category">
                                    <option disabled value={0}>Select Category</option>
                                    {
                                        voting && voting.map((category: { id: string, name: string, disabled: boolean }) =>
                                            <option key={category.id} value={category.id} disabled={shouldDisable && category.disabled}>{category.name}</option>)
                                    }

                                </select>

                                {children}
                            </section>
                        )
                }

            </div>

        </>
    )
}
