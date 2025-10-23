import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
function SubmitButton({ textColor, bgColor }) {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      className={`w-full border text-${textColor} bg-${bgColor} py-2 px-4 rounded-md hover:opacity-90 transition duration-200`}
    >
      {t("submit")}
    </button>
  );
}

export default SubmitButton;
