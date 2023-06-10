import { Fragment, useRef } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { EditorColor } from "~/lib/types.server";
import { Dialog, Transition } from "@headlessui/react";

interface EditorProps {
    colors: EditorColor[]
    open: boolean 
    setOpen: (open: boolean) => void
}

export default function EditorModal({ open, setOpen, colors }: EditorProps) {
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
    
    const exportColors = () => {
        return [...colors].map((color) => `${color.name.toLowerCase().replace(" ", "-")}: ${color.value}`).join('\n')
    }

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
                    <Dialog.Title as="h3" className="flex items-center justify-end gap-3 w-full text-base text-slate-700 leading-6">
                        <CopyToClipboard text={exportColors()}>
                            <button 
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-300 border border-slate-200 hover:text-white hover:bg-red-500"
                            onClick={() => {
                                notify()
                            }}>
                                <ClipboardDocumentIcon className="w-5 h-5"/>
                            </button>
                        </CopyToClipboard>
                    </Dialog.Title>
                    <ul className="flex flex-col w-full text-slate-500 rounde-md border border-slate-200 items-center gap-4 mt-4 py-4">
                    {
                        colors.map((color) => {
                            return (
                                <li className="border-b border-b-slate-200">
                                    {color.name.toLowerCase().replace(" ", "-")}: {color.value.toUpperCase()}
                                </li>
                            )
                        })
                    }
                    </ul>
                    <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white border border-slate-200 hover:bg-sky-400 sm:mt-0 sm:w-auto"
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            Done
                        </button>
                    </div>
                  </div>
                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
}