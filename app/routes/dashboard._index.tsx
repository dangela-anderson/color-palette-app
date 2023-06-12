import type { ActionFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";

import { Form, Link, useLoaderData } from "@remix-run/react"
import Logo from "../../public/images/logo.png"
import { LoaderFunction, json } from "@remix-run/node"
import { getUser, logout } from "~/lib/auth.server"
import type { PaletteWithColors, UserWithPalettes } from "~/lib/types.server";
import { Palette } from "@prisma/client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Swatched - Dashboard" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return user ? json(user) : null
}

export const action: ActionFunction = async ({ request }: LoaderArgs) => {
    return await logout(request)
}



export default function Index() {
    const user = useLoaderData()

    return (
        <div className="flex flex-col items-center justify-items min-h-full bg-white pb-10">
            <header className="h-14 w-full bg-white shadow-sm border-slate-300">
                <nav className="flex items-center justify-between w-full h-14 px-10 font-bold text-2xl text-[#073442] gap-x-2"> 
                    <div className="flex gap-2">
                        <img width={32} height={24} src={Logo} alt="The swatched logo"/>
                        Swatched
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                        <Link className="flex" to="/create"><PlusCircleIcon className="text-white fill-sky-500 w-12 h-12"/></Link>
                        <Form method="delete">
                            <button type="submit" className="flex text-sm font-semibold rounded-md px-3 py-2 text-white bg-sky-500 hover:bg-sky-300 shadow-sm gap-x-2">
                                Log Out
                            </button>
                        </Form>
                    </div>
                </nav>
            </header>
            <main className="flex flex-col flex-1 w-full items-center justify-start min-w-lg mt-10 px-10">
                <h1 className="font-semibold text-2xl">Palettes</h1>
                <ul className="mt-20">
                    {   user.palettes.length ?
                        user.palettes.map((palette: PaletteWithColors) => {
                            return (
                                <li className="flex min-w-md flex-col bg-white h-32 border border-slate-300 shadow-md rounded-md shadow-sm p-4">
                                    { palette.title }
                                    <div className="flex min-w-sm">
                                    {
                                        palette.colors.map((color) => {
                                            return <div className="grow w-8 h-10" style={{backgroundColor: color.value}} key={color.id}></div>
                                        })
                                    }
                                    </div>
                                </li>
                            )
                        })
                        : <h1 className="font-semibold text-xl text-slate-700">Nothing to see yet!</h1>
                    }
                </ul>
            </main>
        </div>
    )
}