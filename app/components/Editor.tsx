import { useEffect, useState } from "react";
import { AdjustmentsHorizontalIcon, ArrowUpOnSquareIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import { Link } from "@remix-run/react";
import EditorModal from "./modal/EditorModal";
import { EditorColor, EditorPalette } from "~/lib/types.server";
import ExportModal from "./modal/ExportModal";

interface EditorProps {
  palette: EditorPalette | undefined
}

export default function Editor({ palette }: EditorProps) {
  const [editedPalette, setEditedPalette] = useState<EditorPalette>(palette ?? 
    {
      title: "Untitled Palette",
      colors: [
        {id: uuidv4(), name: "Untitled Color", value: "#4cc9f0"}, 
        {id: uuidv4(), name: "Untitled Color", value: "#4895ef"}, 
        {id: uuidv4(), name: "Untitled Color", value: "#4361ee"}, 
        {id: uuidv4(), name: "Untitled Color", value: "#3f37c9"},
        {id: uuidv4(), name: "Untitled Color", value: "#3a0ca3"}, 
        {id: uuidv4(), name: "Untitled Color", value: "#480ca8"}, 
        {id: uuidv4(), name: "Untitled Color", value: "#560bad"}
      ]
    }
  )
  const [editedColor, setEditedColor] = useState<EditorColor | undefined>(undefined)
  const [openEditor, toggleEditor] = useState(false)
  const [openExport, toggleExport] = useState(false)

  const onAddColor = () => {
    setEditedPalette({...editedPalette, colors: [{id: uuidv4(), name: "Untitled Color", value: "#7AD7F3"}, ...editedPalette.colors]})
  }

  const onTitleChange = (title: string) => {
    setEditedPalette({...editedPalette, title})
  }

  const onNameChange = (name: string) => {
    if (editedColor) {
      setEditedColor({...editedColor, name})
    }
  }

  const onValueChange = (value: string) => {
    if (editedColor) { 
      setEditedColor({...editedColor, value})
    }
  }

  const onDeleteColor = () => {
    setEditedPalette({...editedPalette, colors: editedPalette.colors.filter((color) => color.id !== editedColor?.id)})
  }

  const onDoneClicked = () => {
    const newColors = [...editedPalette.colors].map((color) => {
      if (editedColor && color.id === editedColor.id) {
        return editedColor
      }
      return color
    })
    setEditedPalette({...editedPalette, colors: newColors})
    toggleEditor(false)
  }

  useEffect(() => {
    if (editedColor && !openEditor) {
      toggleEditor(true)
    }
  }, [editedColor])

  useEffect(() => {
    if (!openEditor) {
      setEditedColor(undefined)
    }
  }, [openEditor])

  return (
    <div className="fixed top-0 inset-0 flex flex-col min-h-full">
      <nav className="sticky top-0 z-40 border-b border-slate-900/10">
        <div className="mx-auto max-w-8xl px-2 sm:px-3 lg:px-4">
          <div className="flex w-full h-14 items-center justify-between">
            <div className="flex gap-2">
              <Link to="/"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-300 border border-slate-200 hover:text-white hover:bg-sky-500"
              >
                <HomeIcon className="h-5 w-5" aria-hidden="true"/>
              </Link>
              <input
                type="text"
                className="border text-slate-500 rounded-md border-slate-200 px-2 ml-4"
                defaultValue={editedPalette.title}
                onChange={(event) => onTitleChange(event.target.value)}
              />
               <button
                type="button"
                onClick={onAddColor}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold hover:bg-sky-400 text-white bg-sky-500"
                disabled={!(editedPalette.colors.length < 10)}
              >
                <PlusIcon className="stroke-2 h-5 w-5" aria-hidden="true"/>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => toggleExport(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-300 border hover:bg-slate-50 border-slate-200 hover:bg-sky-500"
              >
                <ArrowUpOnSquareIcon className="h-5 w-5" aria-hidden="true"/>
              </button>
              <button className="inline-flex gap-x-2 items-center rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:text-white hover:bg-sky-400" type="submit">
                <CheckIcon className="stroke-2 w-5 h-5" aria-hidden="true"/>
                <p>{ palette ? "Create" : "Save"}</p>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex flex-col flex-1 overflow-y-auto">
        <ul className="flex-1 flex flex-col w-full max-h-max">
        {
            editedPalette.colors.map((color) => {
                return (
                  <div className="grow h-24 md:h-32" style={{backgroundColor: color.value}} key={color.id}>
                    <div className="h-full group">
                      <li className={`h-full group-hover:bg-black group-hover:bg-opacity-70 transition-all duration-200 ${editedColor && color.id === editedColor.id && "bg-slate-500 bg-opacity-50"}`}>
                        <button 
                          className="w-1/4 mx-auto grid place-content-center h-full w-full text-white"
                          onClick={() => setEditedColor(color)}
                        >
                          <div className={`${editedColor && color.id === editedColor.id ? "block" : "hidden"} ease-in-out duration-700  group-hover:block`}>
                            <AdjustmentsHorizontalIcon className="h-7 w-7"/>
                          </div>
                        </button>
                      </li>
                    </div>
                  </div>
                )
            })
        }
        </ul>
        {
          editedColor !== undefined &&
          <EditorModal
            open={openEditor}
            setOpen={toggleEditor}
            name={editedColor?.name ?? "Untitled Palette"}
            setName={(name: string) => onNameChange(name)}
            pickerColor={editedColor?.value ?? "#FFFFFF"} 
            setPickerColor={(value: string) => onValueChange(value)}
            onDoneClicked={onDoneClicked}
            onDeleteClicked={onDeleteColor}
          />
        }
        { openExport && 
          <ExportModal open={openExport} setOpen={toggleExport} colors={editedPalette.colors}/>

        }
      </main>
    </div>
  )
}