import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function Navbar() {

    const [toggle, setToggle] = useState(false);
    const router = useRouter();
    const active =  "text-sm font-semibold  px-6 py-2 rounded-md text-white uppercase hover:text-green-500 hover:bg-white bg-green-500";
    const passive =  "text-sm font-semibold  px-6 py-2 rounded-md text-green-500 uppercase hover:text-white hover:bg-green-500 bg-white text-green-500";
    function handleClick() {
        setToggle(!toggle)
    }

    return (
        <>
            <header className="bg-transparent">
                <nav className="mx-auto flex max-w-7xl items-center justify-between lg:px-8 " aria-label="Global">
                    <div className="hidden lg:flex items-center lg:justify-between lg:my-4 lg:gap-x-14">
                        <Link
                            href="/"
                            rel="noopener noreferrer"
                            className="lg:mr-10"
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={50}
                                height={50}
                                priority
                            />
                        </Link>
                        <Link href="/" className={router.pathname == "/" ? active: passive }>Home</Link>
                        <Link href="/register_face" className={router.pathname == "/register_face" ? active: passive }>Register Face</Link>
                        <Link href="/vote" className={router.pathname == "/vote" ? active: passive }>Vote Now</Link>
                        <Link href="/live" className={router.pathname == "/live" ? active: passive }>Live Result</Link>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <Link href="https://github.com/chyke007/facial-vote" rel="noopener noreferrer" target="_blank">
                            <button className="text-sm font-semibold px-12 py-2 rounded-sm  leading-6 bg-black text-white hover:text-green-500 hover:bg-white">
                                GITHUB
                            </button>
                        </Link>
                    </div>
                </nav>


                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        className="fixed  inset-y-0 left-2 z-10 my-6 mx-4"
                        width={50}
                        height={50}
                        priority
                    />
                    <button type="button" className="w-10 h-10 mt-8 ml-14 mr-4 bg-white absolute inset-y-0 right-0 z-10 text-white rounded-md p-2.5 text-gray-700" onClick={handleClick}>
                        <span className="sr-only">Open menu</span>
                        <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                        </svg>
                    </button>
                    {toggle &&
                        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10" style={{ backgroundColor: "#01081F" }}>
                            <div className="flex items-center justify-between">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                    priority
                                />
                                {toggle &&
                                    <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={handleClick}>
                                        <span className="sr-only">Close menu</span>
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                }
                            </div>

                            <div className="mt-6 flow-root text-white">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <Link href="/" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 hover:bg-white hover:text-black">Home</Link>
                                        <Link href="/register_face" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 hover:bg-white hover:text-black">Register Face</Link>
                                        <Link href="/vote" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 hover:bg-white hover:text-black">Vote Now</Link>
                                        <Link href="/live" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 hover:bg-white hover:text-black">Live Result</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </header>
        </>
    )
}
