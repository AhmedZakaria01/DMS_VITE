import pageNotFoundImage from "../../../src/assets/page_not_found.png";
import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();
  return <img src={pageNotFoundImage} className="" alt={t("system.pageNotFound")} />;
}

export default PageNotFound;
