import { ActionArgs, ActionFunction, LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Editor from "~/components/Editor";
import { prisma } from "~/lib/prisma.server";
import { Palette } from "@prisma/client";
import { EditorPalette } from "~/lib/types.server";

export async function loader({ params }: LoaderArgs) {
    const paletteId = params.paletteId;
    const palette = await prisma.palette.findUnique({
        where: {
            id: paletteId
        },
        select: {
            id: true, title: true, colors: true
        }
    })
    return palette ? json(palette) : redirect("/dashboard")
}

export const action: ActionFunction = async ({ request, params }: ActionArgs) => {
    const form = await request.formData()
    const action = form.get("action")

    switch (action) {
        case "delete": {
            const paletteId = params.paletteId;
            const palette = await prisma.palette.delete({ where: { id: paletteId}})
            return palette ? redirect("/dashboad") : null
        }
    }
}



export default function PalettePage() {
    const palette: EditorPalette = useLoaderData<typeof loader>()
    return (
        <Editor palette={palette} userId={palette.userId}/>
    )
}