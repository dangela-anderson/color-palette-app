import type { GuestLoginForm, LoginForm, RegisterForm } from "./types.server"
import { prisma } from "./prisma.server"
import { createGuestUser, createUser } from "./user.server"
import { json, createCookieSessionStorage, redirect } from "@remix-run/node"
import bcrypt from "bcryptjs"

const storage = createCookieSessionStorage({
  cookie: {
    name: "swatched-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})


export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession()
    session.set("userId", userId)
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    })
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request)
    const userId = session.get("userId")
    if (!userId || typeof userId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
      throw redirect(`/login?${searchParams}`)
    }
    return userId
  }
  
  function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"))
  }
  
  async function getUserId(request: Request) {
    const session = await getUserSession(request)
    const userId = session.get("userId")
    if (!userId || typeof userId !== "string") return null
    return userId
  }
  
  export async function getUser(request: Request) {
    const userId = await getUserId(request)
    if (typeof userId !== "string") {
      return null
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, firstName: true, lastName: true, palettes: {
          select: {
            id: true,
            title: true,
            colors: true
          }
        }},
      })
      return user
    } catch {
      throw logout(request)
    }
  }
  
  export async function logout(request: Request) {
    const session = await getUserSession(request)
    return redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    })
  }


export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { username: user.username } })
  if (exists) {
    return json({ error: `User already exists with that username` }, { status: 400 })
  }

  const newUser = await createUser(user)
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { username: user.username, password: user.password },
      },
      { status: 400 },
    )
  }

  return createUserSession(newUser.id, "/dashboard");
}

export async function guestLogin(user: GuestLoginForm) {
    const exists = await prisma.user.count({ where: { username: user.username } })
    if (exists) {
      return json({ error: `User already exists with that username` }, { status: 400 })
    }

    const newGuestUser = await createGuestUser(user)

    if (!newGuestUser) {
      return json(
        {
          error: `Something went wrong trying to create a new user.`,
          fields: { username: user.username },
        },
        { status: 400 },
      )
    }
  
    return createUserSession(newGuestUser.id, "/dashboard");
}

export async function login({ username, password }: LoginForm) {
    const user = await prisma.user.findUnique({
      where: { username },
    })
  
    if (!user || user.password && !(await bcrypt.compare(password, user.password)))
      return json({ error: `Incorrect login` }, { status: 400 })
  
      return createUserSession(user.id, "/dashboard");
}