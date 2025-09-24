/* eslint-disable react/prop-types */
import { Dialog, DialogPanel } from "@headlessui/react";

export default function Popup({ isOpen, setIsOpen, component }) {
  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={close}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Centered Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <DialogPanel className="w-full max-w-4xl max-h-[95vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end p-3 border-b border-gray-200 flex-shrink-0">
            <button
              onClick={close}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">{component}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
