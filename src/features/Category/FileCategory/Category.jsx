import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function Category() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleCreateCategory = () => {
    navigate("/CreateCategory");
  };

  return (
    <div>
      <button
        onClick={handleCreateCategory}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
        {t("createCategory")}
      </button>
    </div>
  );
}

export default Category;