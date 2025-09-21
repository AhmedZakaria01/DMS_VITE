import { Link, useLocation, useNavigate } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Get repository name from navigation state - this will be consistent across all pages
  const repoName =
    location.state?.repoName || sessionStorage.getItem("currentRepoName");

  // Build breadcrumb trail
  const breadcrumbs = [];

  // Always start with Home if we're not on home page
  if (currentPath !== "/") {
    breadcrumbs.push({
      name: "Home",
      path: "/",
      isLast: false,
    });
  }

  // Handle different route patterns
  if (currentPath === "/") {
    // Home page only
    return null;
  } else if (currentPath.match(/^\/audit$/)) {
    breadcrumbs.push({ name: "Audit", path: "/audit", isLast: true });
  } else if (currentPath.match(/^\/users$/)) {
    breadcrumbs.push({ name: "Users", path: "/users", isLast: true });
  } else if (currentPath.match(/^\/roles$/)) {
    breadcrumbs.push({ name: "Roles", path: "/roles", isLast: true });
  } else if (currentPath.match(/^\/createRepo$/)) {
    breadcrumbs.push({
      name: "Create Repository",
      path: "/createRepo",
      isLast: true,
    });
  } else if (currentPath.match(/^\/documentViewer$/)) {
    breadcrumbs.push({
      name: "Document Viewer",
      path: "/documentViewer",
      isLast: true,
    });
  } else if (currentPath.match(/^\/repoContents\/(\d+)$/)) {
    // Repository contents (root level)
    const repoId = currentPath.match(/^\/repoContents\/(\d+)$/)[1];
    breadcrumbs.push({
      name: repoName, // Use the consistent repoName variable
      path: `/repoContents/${repoId}`,
      isLast: true,
    });
  } else if (currentPath.match(/^\/repoContents\/(\d+)\/folderContent\/.+/)) {
    // Nested folder contents
    const match = currentPath.match(
      /^\/repoContents\/(\d+)\/folderContent\/(.+)$/
    );
    const repoId = match[1];
    const folderPath = match[2];

    // Add repository breadcrumb with actual name
    breadcrumbs.push({
      name: repoName, // Use the consistent repoName variable from top
      path: `/repoContents/${repoId}`,
      isLast: false,
    });

    // Get folder history from navigation state
    const folderHistory = location.state?.folderHistory || [];

    if (folderHistory.length > 0) {
      // Use actual folder names from history
      folderHistory.forEach((folder, index) => {
        const isLast = index === folderHistory.length - 1;

        breadcrumbs.push({
          name: folder.name, // Use actual folder name
          path: folder.path,
          isLast: isLast,
        });
      });
    } else {
      // Fallback: if no folder history, use generic names
      const folderIds = folderPath.split("/");
      folderIds.forEach((folderId, index) => {
        const isLast = index === folderIds.length - 1;

        // Build the path up to this folder level
        const pathToFolder = folderIds.slice(0, index + 1).join("/");

        breadcrumbs.push({
          name: `Folder ${index + 1}`, // Fallback to generic name
          path: `/repoContents/${repoId}/folderContent/${pathToFolder}`,
          isLast: isLast,
        });
      });
    }
  }

  // Mark the last breadcrumb as last
  if (breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].isLast = true;
  }

  console.log("Breadcrumbs with folder names:", breadcrumbs);
  console.log("Folder history from state:", location.state?.folderHistory);
  console.log(
    "Repository name from state:",
    location.state?.repoName || sessionStorage.getItem("currentRepoName")
  );
  console.log("Full location state:", location.state);
  console.log("Current path:", currentPath);

  return (
    <nav className="flex mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={`${crumb.path}-${index}`} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}

          {crumb.isLast ? (
            <span className="font-medium text-gray-900">{crumb.name}</span>
          ) : (
            <button
              onClick={() => {
                console.log("Navigating to:", crumb.path);
                // Navigate with preserved state
                navigate(crumb.path, {
                  state: {
                    repoName: repoName, // Always preserve repository name
                    folderHistory: crumb.path.includes("/folderContent/")
                      ? location.state?.folderHistory?.slice(
                          0,
                          breadcrumbs.findIndex((b) => b.path === crumb.path) -
                            1
                        )
                      : [], // Empty for repository root
                  },
                });
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer font-inherit"
            >
              {crumb.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
