import type { ActionFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";

import { Form, Link, useLoaderData } from "@remix-run/react"
import Logo from "../../public/images/logo.png"
import { LoaderFunction, json } from "@remix-run/node"
import { getUser, logout } from "~/lib/auth.server"
import type { UserWithPalettes } from "~/lib/types.server";
import { Palette } from "@prisma/client";

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
        <div className="flex flex-col items-center justify-items min-h-full min-w-full bg-gradient-to-b from-sky-50 to-sky-500 pb-10">
            <header className="h-14 w-full bg-white border-b border-slate-300 shadow-sm">
                <nav className="flex items-center justify-between w-full h-14 px-10 font-bold text-2xl text-[#073442] gap-x-2"> 
                    <div className="flex gap-2">
                        <img width={32} height={24} src={Logo} alt="The swatched logo"/>
                        Swatched
                    </div>
                    <Form method="delete">
                        <button type="submit" className="flex text-sm font-semibold rounded-md px-3 py-2 text-white bg-sky-500 hover:bg-sky-300 shadow-sm gap-x-2">
                            Log Out
                        </button>
                    </Form>
                </nav>
            </header>
            <main className="flex flex-col flex-1 w-full items-center justify-center">
                { user.username }
                <ul>
                    {
                        user.palettes.map((palette: Palette) => {
                            return (
                                <li>
                                    { palette.title }
                                </li>
                            )
                        })
                    }
                </ul>
            </main>
        </div>
    )
}