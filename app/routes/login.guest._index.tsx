
import { ActionFunction, LoaderFunction, V2_MetaFunction, json, redirect } from "@remix-run/node"
import { validateUsername } from "~/lib/validators.server"
import { getUser, guestLogin } from "~/lib/auth.server"
import { Form, Link, useActionData } from "@remix-run/react"
import Logo from "../../public/images/logo.png"
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline"
import { useRef, useEffect, useState } from "react"


export const meta: V2_MetaFunction = () => {
    return [
      { title: "Swatched - Guest Login" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    return (await getUser(request)) ? redirect("/dashboard") : null
}

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const username = form.get("username")

    if (typeof username !== "string") {
        return json({ error: `Invalid Form Data`, form: action }, { status: 400 })
    }

    const errors = {
        username: validateUsername(username)
    }

    if (Object.values(errors).some(Boolean)) {
        return json({ errors, fields: { username }, form: action }, { status: 400 })
    }

    return await guestLogin({ username })
}


export default function GuestLogin() {
    const actionData = useActionData()

    const firstLoad = useRef(true)
    const [errors, setErrors] = useState(actionData?.errors || {})
    const [formError, setFormError] = useState(actionData?.error || "")
    const [formData, setFormData] = useState({
        username: actionData?.fields?.username || ""
    })

    useEffect(() => {
        if (!firstLoad.current) {
            const newState = {
                username: "",
            }
            setErrors(newState)
            setFormError("")
            setFormData(newState)
        }
    }, [])

    useEffect(() => {
        if (!firstLoad.current) {
            setFormError("")
        }
    }, [formData])

    useEffect(() => { firstLoad.current = false }, [])

    return (
        <div className="flex flex-col items-center justify-items min-h-full min-w-full">
            <header className="h-14 w-full border-b border-slate-300 shadow-sm">
                <nav className="flex items-center justify-between w-full h-14 px-10 font-bold text-2xl text-[#073442] gap-x-2"> 
                    <div className="flex gap-2">
                        <img width={32} height={24} src={Logo} alt="The swatched logo"/>
                        Swatched
                    </div>
                    <Link className="flex text-sm font-semibold rounded-md px-3 py-2 text-white bg-sky-500 hover:bg-sky-300 shadow-sm gap-x-2" to="/">
                        <ArrowLongLeftIcon className="w-5 h-5"/>
                        Back to home
                    </Link>
                </nav>
            </header>
            <main className="flex flex-1 w-full items-center justify-center bg-gradient-to-b from-sky-50 to-sky-500">
                <Form method="post" className="w-full max-w-sm md:max-w-md border mx-auto px-10 py-14 bg-white rounded-md">
                    <div className="flex flex-col items-center justify-center w-full font-semibold text-sky-500 text-2xl mb-7 gap-y-2">
                        <img width={64} height={64} src={Logo} alt="The swatched logo"/>
                        <p className="text-red-500 text-sm">{formError}</p>
                    </div>
                    <label className="flex flex-col gap-2 mt-4" htmlFor="username">
                        <h3 className="font-semibold text-[#073442]">Username</h3>
                        <input className="w-full border border-slate-200 shadow-sm rounded-md px-3 py-2" type="username" placeholder="Username" name="username" id="username" required/>
                        { errors.username && <p className="text-xs text-red-500">{ errors.username }</p>}
                    </label>
                    <h1 className="text-xs text-[#073442] mt-3">Already have an account? <Link className="underline text-sky-500" to="/login">Log In</Link></h1>
                    <input className="w-full font-semibold rounded-md px-3 py-3 text-white bg-sky-500 hover:bg-sky-300 shadow-sm mt-4" type="submit" value="Continue as guest" />
                </Form>
            </main>
        </div>
    )
}