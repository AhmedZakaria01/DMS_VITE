/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { AlertCircle, CheckCircleIcon, X } from "lucide-react";

function ErrorAlert({ show, onClose, title, message }) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed bottom-0 right-0 flex items-end px-4 py-6 z-50"
    >
      <div className="flex w-full flex-col items-end space-y-4">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 translate-x-2"
          enterTo="translate-y-0 opacity-100 translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-red-200">
            <div className="px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-lg font-medium text-red-500">{title}</p>
                  <p className="text-md text-gray-500 mt-0.5">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
export default React.memo(ErrorAlert);
