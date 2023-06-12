import type { V2_MetaFunction } from "@remix-run/node";

import { Form, Link, useActionData } from "@remix-run/react"
import Logo from "../../public/images/logo.png"
import { ActionFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node"
import { validateUsername, validateName, validatePassword } from "~/lib/validators.server"
import { register, getUser } from "~/lib/auth.server"
import { useState } from "react"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Swatched - Home" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/dashboard") : null
}

export const action: ActionFunction = async ({ request }: LoaderArgs) => {
  const form = await request.formData()
  const username = form.get("username")
  const password = form.get("password")
  let firstName = form.get("firstName")
  let lastName = form.get("lastName")

  if (typeof username !== 'string' || typeof password !== 'string') {
    return json({ error: `Invalid Form Data` }, { status: 400 })
  }

  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    return json({ error: `Invalid Form Data` }, { status: 400 })
  }

  const errors = {
    username: validateUsername(username),
    password: validatePassword(password),
    firstName: validateName((firstName as string) || ''),
    lastName: validateName((lastName as string) || ''),
  }

  if (Object.values(errors).some(Boolean))
    return json({ errors, fields: { username, password, firstName, lastName } }, { status: 400 })

  return await register({ username, password, firstName, lastName})
}


export default function Index() {
  const actionData = useActionData()

  const [errors, setErrors] = useState(actionData?.errors || {})
  const [formError, setFormError] = useState(actionData?.error || "")
  const [formData, setFormData] = useState({
    username: actionData?.fields?.username || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.lastName || "",
    lastName: actionData?.fields?.firstName || "",
  })

  return (
    <div className="flex flex-col items-center justify-items min-h-full min-w-full bg-gradient-to-b from-sky-50 to-sky-500 pb-10">
      <header className="h-14 w-full bg-white border-b border-slate-300 shadow-sm">
          <nav className="flex items-center justify-between w-full h-14 px-10 font-bold text-2xl text-[#073442] gap-x-2"> 
              <div className="flex gap-2">
                  <img width={32} height={24} src={Logo} alt="The swatched logo"/>
                  Swatched
              </div>
              <Link className="flex text-sm font-semibold rounded-md px-3 py-2 text-white bg-sky-500 hover:bg-sky-300 shadow-sm gap-x-2" to="/login">
                Log In
              </Link>
          </nav>
      </header>
      <main className="flex flex-col flex-1 w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center mt-20 px-10">
          <h1 className="text-3xl md:text-5xl max-w-xl font-bold text-[#073442]">Create your next palette with Swatched</h1>
          <h2 className="text-xs md:text-sm mt-4 font-semibold text-[#073442]">Join today for a simple, user-friendly to create beautiful palettes.</h2>
          <Link to="/create" className="justify-self-start font-semibold rounded-md px-3 py-2 text-white bg-sky-500 hover:bg-sky-300 mt-4 shadow-sm">Create now</Link>
        </div>
        <Form method="post" className="w-full max-w-md md:max-w-xl border mx-auto px-10 py-14 bg-white rounded-md mt-10">
            
            <div className="flex flex-col items-center justify-center w-full font-semibold text-sky-500 text-2xl mb-7 gap-y-2">
                <img width={64} height={64} src={Logo} alt="The swatched logo"/>
                { formError && <p>{formError}</p>}
            </div>

            <div className="grid grid-cols-2 w-full gap-x-4">

              <label className="flex flex-col gap-2 mt-4" htmlFor="firstName">
                  <h3 className="font-semibold text-[#073442]">First Name</h3>
                  <input defaultValue={formData.firstName} className="w-full border border-slate-200 shadow-sm rounded-md px-3 py-2" type="text" placeholder="First Name" name="firstName" id="firstName" />
                  { errors.firstName && <p className="text-xs text-red-500">{ errors.firstName }</p>}
              </label>

              <label className="flex flex-col gap-2 mt-4" htmlFor="lastName">
                  <h3 className="font-semibold text-[#073442]">Last Name</h3>
                  <input defaultValue={formData.lastName} className="w-full border border-slate-200 shadow-sm rounded-md px-3 py-2" type="text" placeholder="Last Name" name="lastName" id="lastName" />
                  { errors.lastName && <p className="text-xs text-red-500">{ errors.lastName }</p>}
              </label>
            
            </div>

            <label className="flex flex-col gap-2 mt-4" htmlFor="username">
              <h3 className="font-semibold text-[#073442]">Username</h3>
              <input defaultValue={formData.username} className="w-full border border-slate-200 shadow-sm rounded-md px-3 py-2" type="text" placeholder="Username" name="username" id="username" />
              <p className="text-xs text-red-500">{ errors.username }</p>
            </label>

            <label className="flex flex-col gap-2 mt-4" htmlFor="password">
              <h3 className="font-semibold text-[#073442]">Password</h3>
              <input defaultValue={formData.password} className="w-full border border-slate-200 shadow-sm rounded-md px-3 py-2" type="password" placeholder="Password" name="password" id="password" />
              { errors.password && <p className="text-xs text-red-500">{ errors.password }</p>}
            </label>

            <h1 className="text-xs text-[#073442] mt-3">Don't have an account? <Link className="underline text-sky-500" to="/">Sign up</Link></h1>
            
            <input className="w-full font-semibold rounded-md px-3 py-3 text-white bg-sky-500 hover:bg-sky-300 shadow-sm mt-4" type="submit" value="Create an account" />
            <Link to="/login/guest" className="inline-flex items-center justify-center w-full font-semibold rounded-md px-3 py-3 text-[#073442] border border-slate-200 shadow-sm mt-4">Continue as guest</Link>
        </Form>
      </main>
    </div>
  )
}