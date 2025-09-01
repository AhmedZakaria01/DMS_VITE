/* eslint-disable react/prop-types */
import { Dialog, DialogPanel } from "@headlessui/react";

export default function Popup({ isOpen, setIsOpen, component }) {
  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={close}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Centered Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-6 overflow-auto">
        <DialogPanel className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl p-6 md:p-10 transition-all duration-300">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={close}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>

          {/* Content */}
          <div className="w-full">{component}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
