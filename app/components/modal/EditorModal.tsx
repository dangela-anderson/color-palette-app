import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

interface EditorProps {
  open: boolean 
  setOpen: (open: boolean) => void
  name: string 
  setName: (name: string) => void
  pickerColor: string
  setPickerColor: (color: string) => void
  onDoneClicked: () => void
  onDeleteClicked: () => void
}

export default function EditorModal({ 
  open, 
  setOpen, 
  name, 
  setName, 
  pickerColor, 
  setPickerColor, 
  onDoneClicked, 
  onDeleteClicked 
}: EditorProps) {
    const [color, setColor] = useState<string>(pickerColor)
    const cancelButtonRef = useRef(null)

    const notify = () => toast("Copied to clipboard", 
    {
      className: "rounded-md",
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark"  
    })
    
    useEffect(() => {
        setPickerColor(color)
    }, [color])

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-sm sm:max-w-md pt-10">
                  <div className="flex flex-col items-center justify-center px-10">
                    <Dialog.Title as="h3" className="flex gap-3 w-full text-base text-slate-700 leading-6">
                      <input onChange={(event) => { setName(event.target.value) }}
                        defaultValue={name.trim().length ? name : "Untitled Color"} className="w-full text-slate-500 border border-slate-200 px-2 py-1 rounded-md" type="text" />
                      <button 
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-300 border border-slate-200 hover:text-white hover:bg-red-500"
                        onClick={() => {
                          onDeleteClicked()
                          setOpen(false)
                      }}><TrashIcon className="w-5 h-5"/></button>
                    </Dialog.Title>
                    <div className="flex flex-col w-full items-center gap-4 justify-center mt-4">
                      <div className="w-full custom-color-picker mx-auto">
                          <HexColorPicker color={color} onChange={(color) => setColor(color.toUpperCase())}/>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div style={{ backgroundColor: color }} className="w-8 h-8 rounded-md"></div>
                        <div className="flex items-center pl-2 justify-between border border-slate-200 text-slate-500 p-1 rounded-md">
                            #<HexColorInput color={color.toUpperCase()} onChange={(color) => setColor(color.toUpperCase())}/>
                            <CopyToClipboard text={color}>
                              <button onClick={notify} className="p-1 rounded-md text-slate-300 hover:bg-sky-500 hover:text-white"><ClipboardDocumentIcon className=" w-5 h-5"/></button>
                            </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
                    <button
                      type="button"
                       className="inline-flex rounded-md bg-sky-500 justify-center px-3 py-2 text-sm font-semibold text-white border border-slate-200 hover:bg-sky-400 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setOpen(false)
                        onDoneClicked()
                      }}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      className="mt-3 sm:mr-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-500 border border-slate-200  hover:bg-slate-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
}
