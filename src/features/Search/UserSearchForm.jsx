import { useForm } from "react-hook-form";
import * as React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { Search, Folder, FileText, Database, Filter } from "lucide-react";

// Static data
const staticRepos = [
  { id: 1, name: "Finance Department" },
  { id: 2, name: "HR Department" },
  { id: 3, name: "Legal Documents" },
  { id: 4, name: "Project Management" },
  { id: 5, name: "Client Contracts" },
];

const staticDocumentTypes = [
  { id: 1, name: "Invoice", repoId: 1 },
  { id: 2, name: "Contract", repoId: 1 },
  { id: 3, name: "Report", repoId: 1 },
  { id: 4, name: "Resume", repoId: 2 },
  { id: 5, name: "Policy Document", repoId: 2 },
  { id: 6, name: "Legal Agreement", repoId: 3 },
  { id: 7, name: "Project Plan", repoId: 4 },
  { id: 8, name: "Meeting Minutes", repoId: 4 },
  { id: 9, name: "Service Agreement", repoId: 5 },
];

const staticFolders = [
  { id: 1, name: "Invoices Q1 2024", repoId: 1 },
  { id: 2, name: "Invoices Q2 2024", repoId: 1 },
  { id: 3, name: "Active Contracts", repoId: 1 },
  { id: 4, name: "Employee Records", repoId: 2 },
  { id: 5, name: "Recruitment", repoId: 2 },
  { id: 6, name: "Legal Cases", repoId: 3 },
  { id: 7, name: "Compliance", repoId: 3 },
  { id: 8, name: "Project Alpha", repoId: 4 },
  { id: 9, name: "Project Beta", repoId: 4 },
  { id: 10, name: "Client A", repoId: 5 },
  { id: 11, name: "Client B", repoId: 5 },
];

const mockSearchResults = [
  { id: 1, name: "Invoice_001.pdf", repositoryName: "Finance Department", size: "2.4 MB", date: "2024-03-15" },
  { id: 2, name: "Contract_ABC123.docx", repositoryName: "Finance Department", size: "1.8 MB", date: "2024-03-10" },
  { id: 3, name: "Monthly_Report_March.pdf", repositoryName: "Finance Department", size: "3.2 MB", date: "2024-03-31" },
  { id: 4, name: "John_Doe_Resume.pdf", repositoryName: "HR Department", size: "850 KB", date: "2024-03-20" },
  { id: 5, name: "Employee_Handbook.pdf", repositoryName: "HR Department", size: "5.1 MB", date: "2024-01-15" },
  { id: 6, name: "Non_Disclosure_Agreement.docx", repositoryName: "Legal Documents", size: "1.2 MB", date: "2024-03-25" },
  { id: 7, name: "Project_Plan_v2.pdf", repositoryName: "Project Management", size: "4.5 MB", date: "2024-02-28" },
  { id: 8, name: "Service_Level_Agreement.pdf", repositoryName: "Client Contracts", size: "2.9 MB", date: "2024-03-05" },
];

// Custom Select Component
const CustomSelect = ({ 
  options = [], 
  label = "", 
  value = "", 
  onChange = () => {}, 
  placeholder = "Select an option...",
  disabled = false,
  icon: Icon,
  error = false,
  helperText = ""
}) => {
  return (
    <div className="w-full">
      {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label> */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled || options.length === 0}
          className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 text-gray-500 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && helperText && (
        <p className="mt-2 text-sm text-red-600">{helperText}</p>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

// Custom Search Input Component
const CustomSearchInput = ({ 
  label = "", 
  name = "", 
  placeholder = "", 
  error = null,
  icon: Icon,
  registerProps = {}
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type="text"
          {...registerProps}
          placeholder={placeholder}
          className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            Icon ? 'pl-10 pr-10' : 'pr-10'
          } ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

CustomSearchInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  icon: PropTypes.elementType,
  registerProps: PropTypes.object,
};

export function UserSearchForm() {
  const { t } = useTranslation();
  const [responsData, setResponseData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  const repos = staticRepos;
  const [documentTypes, setDocumentTypes] = React.useState([]);
  const [folders, setFolders] = React.useState([]);

  const columns = React.useMemo(() => [
    {
      id: "name",
      accessorKey: "name",
      header: t("documentName") || "Document Name",
      enableSorting: true,
      enableColumnFilter: true,
      size: 200,
    },
    {
      id: "repositoryName",
      accessorKey: "repositoryName",
      header: t("repositoryName") || "Repository",
      enableSorting: true,
      enableColumnFilter: true,
      size: 150,
    },
    {
      id: "size",
      accessorKey: "size",
      header: t("size") || "Size",
      enableSorting: true,
      enableColumnFilter: true,
      size: 100,
    },
    {
      id: "date",
      accessorKey: "date",
      header: t("date") || "Date",
      enableSorting: true,
      enableColumnFilter: true,
      size: 120,
    },
  ], [t]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedRepoId = watch("RepositoryId");

  React.useEffect(() => {
    if (selectedRepoId) {
      const filteredDocTypes = staticDocumentTypes.filter(
        doc => doc.repoId === parseInt(selectedRepoId)
      );
      const filteredFolders = staticFolders.filter(
        folder => folder.repoId === parseInt(selectedRepoId)
      );
      setDocumentTypes(filteredDocTypes);
      setFolders(filteredFolders);
    } else {
      setDocumentTypes([]);
      setFolders([]);
    }
  }, [selectedRepoId]);

  const onSubmit = (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== "" && value !== null
      )
    );

    if (!filteredData || Object.keys(filteredData).length === 0) {
      setResponseData([]);
      return;
    }

    performMockSearch(filteredData);
  };

  const handleRowDoubleClick = (row) => {
    console.log("Row double clicked:", row.original);
  };

  function performMockSearch(searchCriteria) {
    console.log("Search criteria:", searchCriteria);
    setLoading(true);
    
    setTimeout(() => {
      let filteredResults = [...mockSearchResults];
      
      if (searchCriteria.RepositoryId) {
        const repoName = staticRepos.find(r => r.id === parseInt(searchCriteria.RepositoryId))?.name;
        filteredResults = filteredResults.filter(item => 
          item.repositoryName === repoName
        );
      }
      
      if (searchCriteria.documentTypeId) {
        const docTypeName = staticDocumentTypes.find(d => d.id === parseInt(searchCriteria.documentTypeId))?.name;
        if (docTypeName) {
          filteredResults = filteredResults.filter(item =>
            item.name.toLowerCase().includes(docTypeName.toLowerCase())
          );
        }
      }
      
      if (searchCriteria.folderId) {
        const folderName = staticFolders.find(f => f.id === parseInt(searchCriteria.folderId))?.name;
        console.log("Filtering by folder:", folderName);
      }
      
      if (searchCriteria.ValueOfIndexField) {
        const searchTerm = searchCriteria.ValueOfIndexField.toLowerCase();
        filteredResults = filteredResults.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.repositoryName.toLowerCase().includes(searchTerm)
        );
      }
      
      setResponseData(filteredResults);
      setLoading(false);
    }, 500);
  }

  const handleReset = () => {
    setResponseData([]);
    setDocumentTypes([]);
    setFolders([]);
    setValue("RepositoryId", "");
    setValue("folderId", "");
    setValue("documentTypeId", "");
    setValue("ValueOfIndexField", "");
  };

  return (
    <div className=" p-6 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto">
              {/* Header - Updated with better styling */}
    <div className="mb-1">
          <div className="bg-white rounded-xl border-gray-200 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t("advancedSearch") || "Advanced Search"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t("advancedSearchDescription") || "Search documents across repositories with advanced filters"}
                </p>
              </div>
            </div>
          </div>
        </div> 

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm sticky top-6 overflow-hidden
            
            modern-table-container audit-trail-table">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 ">
                <div className="flex items-center gap-2 ">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <Filter className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("searchFilters") || "Search Filters"}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3 ">
                {/* Repository Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* <div className="p-2 bg-blue-100 rounded-lg">
                      <Database className="w-4 h-4 text-blue-600" />
                    </div> */}
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {t("repositorySelection") || "Repository"}
                    </h3>
                  </div>
                  
                  <CustomSelect
                    options={repos}
                    label={t("chooseRepositoryName") || "Select Repository"}
                    value={watch("RepositoryId")}
                    onChange={(value) => setValue("RepositoryId", value)}
                    placeholder={t("selectRepository") || "Choose a repository..."}
                    icon={Database}
                    error={!!errors.RepositoryId}
                    helperText={errors.RepositoryId?.message}
                  />
                </div>

                {/* Folder Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* <div className="p-2 bg-green-100 rounded-lg">
                      <Folder className="w-4 h-4 text-green-600" />
                    </div> */}
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {t("folderSelection") || "Folder"}
                    </h3>
                  </div>
                  <CustomSelect
                    options={folders.filter(folder => folder.name && !folder.name.includes("disabled"))}
                    label={t("chooseFolderName") || "Select Folder"}
                    value={watch("folderId")}
                    onChange={(value) => setValue("folderId", value)}
                    placeholder={t("selectFolder") || "Choose a folder..."}
                    disabled={!selectedRepoId}
                    icon={Folder}
                  />
                
                </div>

                {/* Document Type Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div> */}
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {t("documentTypeSelection") || "Document Type"}
                    </h3>
                  </div>
                  <CustomSelect
                    options={documentTypes.filter((item, index, self) =>
                      index === self.findIndex(t => t.id === item.id || t.name === item.name)
                    )}
                    label={t("chooseDocumentTypes") || "Select Document Type"}
                    value={watch("documentTypeId")}
                    onChange={(value) => setValue("documentTypeId", value)}
                    placeholder={t("selectDocumentType") || "Choose document type..."}
                    disabled={!selectedRepoId}
                    icon={FileText}
                  />
                </div>
       {!selectedRepoId && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        {t("selectRepositoryFirst") || "Please select a repository first to view folders"}
                      </p>
                    </div>
                  )}
                {/* Search Value Input */}
                {/* <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Search className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {t("searchCriteria") || "Search Criteria"}
                    </h3>
                  </div>
                  <CustomSearchInput
                    label={t("enterValueOfIndexField") || "Search Value "}
                    name="ValueOfIndexField"
                    placeholder={t("enterSearchValue") || "Enter keywords to search..."}
                    error={errors.ValueOfIndexField}
                    icon={Search}
                    registerProps={register("ValueOfIndexField", {
                      setValueAs: (value) => (value === "" ? null : value),
                    })}
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {t("searchHint") || "Search by document name, repository name, or keywords"}
                    </p>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      {t("reset") || "Reset Filters"}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      {t("search") || "Search Documents"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="lg:col-span-2 ">
            {responsData.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden modern-table-container audit-trail-table">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div> */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {t("searchResults") || "Search Results"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {t("foundDocuments", { count: responsData.length }) || `Found ${responsData.length} documents`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <ReUsableTable
                    columns={columns}
                    data={responsData}
                    title=""
                    isLoading={loading}
                    onRowDoubleClick={handleRowDoubleClick}
                    showGlobalFilter={true}
                    pageSizeOptions={[5, 10, 15, 20, 50]}
                    defaultPageSize={10}
                    className="search-results-table"
                    enableSelection={false}
                  />
                </div>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("searching") || "Searching..."}
                </h3>
                <p className="text-gray-600">
                  {t("searchingDescription") || "Searching documents across repositories"}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden modern-table-container audit-trail-table">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {/* <div className="p-2 bg-blue-100 rounded-lg">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div> */}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("searchResults") || "Search Results"}
                    </h2>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("noSearchResults") || "No Search Results Found"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {t("noSearchResultsDescription") || "Try adjusting your search filters or using different keywords to find what you're looking for."}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      {t("searchTips") || "Search Tips:"}
                    </h4>
                    <ul className="text-sm text-gray-700 text-left space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t("selectRepositoryTip") || "Select a specific repository to narrow down results"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t("useSpecificTerms") || "Use specific keywords related to your search"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{t("tryDifferentFilters") || "Try different combinations of filters"}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

UserSearchForm.propTypes = {};

export default UserSearchForm;
