import { ActionFunction, LoaderArgs } from "@remix-run/node";
import Editor from "~/components/Editor";
import { logout } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request }: LoaderArgs) => {
  return await logout(request)
}

export default function Create() {
  return (
    <Editor palette={undefined}/>
  )
}