/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

// const DisplaySelectedItems = ({ selectedRows }) => {
//   return (
//     <div className="w-full flex justify-center mt-2 px-4">
//       <div className="w-full max-w-6xl rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
//         <div className="mb-4 text-center">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Selected Users
//           </h2>
//           <p className="text-sm text-gray-500">
//             {selectedRows.length} user{selectedRows.length !== 1 && "s"}{" "}
//             selected
//           </p>
//         </div>

//         {/* Scrollable container */}
//         <div className="max-h-[500px] overflow-y-auto pr-2">
//           <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
//             {selectedRows.map((item, index) => (
//               <div
//                 key={index}
//                 className="rounded-md border border-gray-100 bg-sky-100 p-4 transition hover:bg-sky-200"
//               >
//                 <div className="mb-3">
//                   <h3 className="text-lg font-medium text-gray-800">
//                     {item.name || "Unnamed User"}
//                   </h3>
//                   <span
//                     className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-semibold
//                     ${
//                       item.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </div>

//                 <div className="text-sm text-gray-700 space-y-1">
//                   {Object.entries(item)
//                     .filter(([key]) => ["email", "role", "id"].includes(key))
//                     .map(([key, value]) => (
//                       <div key={key}>
//                         <span className="font-medium capitalize text-gray-500 mr-1">
//                           {key}:
//                         </span>
//                         <span>{String(value)}</span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// DisplaySelectedItems.propTypes = {
//   selectedRows: PropTypes.array,
// };

// export default DisplaySelectedItems;
import PropTypes from "prop-types";

const DisplaySelectedItems = ({
  selectedRows,
  title = "Selected Items",
  itemConfig = null, // Configuration object for how to display each item
  maxHeight = "500px",
  gridCols = "md:grid-cols-2",
}) => {
  // Default configuration if none provided
  const defaultConfig = {
    titleField: "name", // Field to use as main title
    statusField: "status", // Field to use for status badge
    displayFields: [], // Fields to show in details - empty means show all
  };

  const config = itemConfig || defaultConfig;

  // Helper function to get the display name/title for each item
  const getItemTitle = (item) => {
    return item[config.titleField] || item.name || item.title || "Unnamed Item";
  };

  // Helper function to get status styling
  const getStatusStyling = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";

    const statusLower = String(status).toLowerCase();
    if (
      ["active", "enabled", "approved", "published", "online"].includes(
        statusLower
      )
    ) {
      return "bg-green-100 text-green-700";
    }
    if (
      ["inactive", "disabled", "rejected", "draft", "offline"].includes(
        statusLower
      )
    ) {
      return "bg-red-100 text-red-700";
    }
    if (["pending", "review", "processing"].includes(statusLower)) {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-blue-100 text-blue-700";
  };

  // Helper function to format field names for display
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ");
  };

  // Helper function to format field values
  const formatFieldValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "...";
    }
    return String(value);
  };

  return (
    <div className="w-full flex justify-center mt-2 px-4">
      <div className="w-full max-w-6xl rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">
            {selectedRows.length} item{selectedRows.length !== 1 && "s"}{" "}
            selected
          </p>
        </div>

        {/* Scrollable container */}
        <div className="overflow-y-auto pr-2" style={{ maxHeight }}>
          <div className={`grid gap-4 sm:grid-cols-1 ${gridCols}`}>
            {selectedRows.map((item, index) => {
              const statusValue = config.statusField
                ? item[config.statusField]
                : null;

              return (
                <div
                  key={item.id || index}
                  className="rounded-md border border-gray-100 bg-sky-100 p-4 transition hover:bg-sky-200"
                >
                  {/* Title and Status */}
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {getItemTitle(item)}
                    </h3>
                    {statusValue && (
                      <span
                        className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusStyling(
                          statusValue
                        )}`}
                      >
                        {formatFieldValue(statusValue)}
                      </span>
                    )}
                  </div>

                  {/* Display Fields */}
                  <div className="text-sm text-gray-700 space-y-1">
                    {config.displayFields.map(
                      (field) =>
                        item[field] && (
                          <div key={field} className="flex flex-wrap">
                            <span className="font-medium text-gray-500 mr-1 min-w-0">
                              {formatFieldName(field)}:
                            </span>
                            <span className="break-words">
                              {formatFieldValue(item[field])}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySelectedItems;
