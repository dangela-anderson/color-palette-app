import { Palette, User } from "@prisma/client"

export interface EditorPalette extends Pick<Palette, "title"> {
    id?: string
    userId?: string
    colors: EditorColor[]
}

export type EditorColor = {
    id: string 
    name: string 
    value: string
}

export type GuestLoginForm = {
    username: string 
}

export type UserWithPalettes =  Exclude<User, "password"> & {
    palettes: Palette[]
}

export type RegisterForm = {
    username: string
    password: string
    firstName: string
    lastName: string
}

export type LoginForm = {
    username: string
    password: string
  }