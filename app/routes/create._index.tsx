import { ActionFunction, LoaderArgs, V2_MetaFunction, json, redirect } from "@remix-run/node";
import Editor from "~/components/Editor";
import { getUser } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Swatched - Home" },
  ];
};

export const action: ActionFunction = async ({ request }: LoaderArgs) => {
  const user = await getUser(request)

  if (!user) {
    return json({ error: `Invalid Form Data` }, { status: 400 })
  }
  const form = await request.formData()
  const title = form.get("title")
  const colorList = form.getAll("color")
  const colors = colorList.map((color) => {
    const colorProp = (color as string).split(":")
    return { name: colorProp[0], value: colorProp[1] }
  })
  
  if (typeof title !== 'string') {
    return json({ error: `Invalid Form Data` }, { status: 400 })
  }
  
  if (colors.length) {
    const palette = await prisma.palette.create({
      data: {
        title: title as string, 
        colors: { createMany: {
          data: colors
        }},
        userId: user.id
      }
    })
    return palette
  }

  return redirect("/dashboard")
}


export default function Create() {
  return (
    <Editor palette={undefined}/>
  )
}