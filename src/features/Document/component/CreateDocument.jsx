// import { useState } from "react";
// import CategoryTable from "./CategoryTable";
// import DocumentForm from "./DocumentForm";

// function CreateDocument() {
//   // ✅ State to hold selected document type and doc types list
//   const [selectedDocTypeId, setSelectedDocTypeId] = useState(null);
//   const [docTypesList, setDocTypesList] = useState([]);

//   // ✅ Callback function to receive data from DocumentForm
//   const handleDocumentTypeChange = (docTypeId, docTypes) => {
//     console.log("CreateDocument received:", docTypeId, docTypes);
//     setSelectedDocTypeId(docTypeId);
//     setDocTypesList(docTypes || []);
//   };

//   return (
//     <div className="flex flex-col xl:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
//       {/* DocumentForm - 80% width on large screens */}
//       <div className="flex-1 xl:flex-[0.4]">
//         <DocumentForm onDocumentTypeChange={handleDocumentTypeChange} />
//       </div>

//       {/* CategoryTable - 20% width on large screens */}
//       <div className="flex-1 xl:flex-[0.6]">
//         {selectedDocTypeId && docTypesList.length > 0 ? (
//           <CategoryTable
//             currentDocTypeId={selectedDocTypeId}
//             docTypesList={docTypesList}
//           />
//         ) : (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No Document Type Selected
//             </h3>
//             <p className="text-sm text-gray-600">
//               Please select a document type from the form to view categories
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CreateDocument;
import { useState } from "react";
import DocumentForm from "./DocumentForm";
import DocumentCategoryTable from "./DocumentCategoryTable";

function CreateDocument() {
  const [selectedDocTypeId, setSelectedDocTypeId] = useState(null);
  const [docTypesList, setDocTypesList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // ✅ NEW: Track uploaded files

  const handleDocumentTypeChange = (docTypeId, docTypes) => {
    console.log("CreateDocument received:", docTypeId, docTypes);
    setSelectedDocTypeId(docTypeId);
    setDocTypesList(docTypes || []);
    setUploadedFiles([]); // Clear files when document type changes
  };

  // ✅ NEW: Handle files change from DocumentCategoryTable
  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* DocumentForm */}
      <div className="flex-1 xl:flex-[0.2]">
        <DocumentForm
          onDocumentTypeChange={handleDocumentTypeChange}
          uploadedFiles={uploadedFiles}
        />
      </div>

      {/* CategoryTable - 60% width on large screens */}
      <div className="flex-1 xl:flex-[0.8]">
        {selectedDocTypeId && docTypesList.length > 0 ? (
          <DocumentCategoryTable
            currentDocTypeId={selectedDocTypeId}
            docTypesList={docTypesList}
            onFilesChange={handleFilesChange}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Document Type Selected
            </h3>
            <p className="text-sm text-gray-600">
              Please select a document type from the form to view categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateDocument;
