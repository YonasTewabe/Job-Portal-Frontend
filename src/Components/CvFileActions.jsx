import { Btn } from "./ui";
import { DownloadIcon, FileTextIcon } from "./icons";
import { downloadApplicantCv, formatCvDisplayName, openApplicantCv } from "../utils/applicantCv";

const CvFileActions = ({ filename, compact = false, showFilename = false, className = "" }) => {
  if (!filename) return null;

  const label = formatCvDisplayName(filename);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openApplicantCv(filename);
          }}
          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          <FileTextIcon className="text-red-500" size={12} /> View
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            downloadApplicantCv(filename);
          }}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium"
          title="Download CV"
        >
          <DownloadIcon size={11} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <button
        type="button"
        onClick={() => openApplicantCv(filename)}
        className={Btn.secondary("gap-2 text-sm")}
      >
        <FileTextIcon className="text-red-500" size={14} /> View CV
      </button>
      <button
        type="button"
        onClick={() => downloadApplicantCv(filename)}
        className={Btn.ghost("gap-2 text-sm")}
      >
        <DownloadIcon size={13} /> Download
      </button>
      {showFilename && (
        <span className="text-xs text-gray-500 truncate max-w-xs" title={label}>
          {label}
        </span>
      )}
    </div>
  );
};

export default CvFileActions;
