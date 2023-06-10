import bcrypt from "bcryptjs"
import type { GuestLoginForm, RegisterForm } from "./types.server"
import { prisma } from "./prisma.server"

export const createUser = async (user: RegisterForm) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        password: passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
    return { id: newUser.id, username: user.username }
}

export const createGuestUser = async (user: GuestLoginForm) => {
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
    },
  })
  return { id: newUser.id, username: user.username }
}