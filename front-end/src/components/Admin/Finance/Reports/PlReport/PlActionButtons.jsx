import { FileDown, Loader2, CheckCircle2, FileSpreadsheet } from "lucide-react";

export default function PlActionButtons({
  isExporting,
  downloadSuccess,
  isExportingCsv,
  disabled,
  onDownloadPdf,
  onDownloadCsv,
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={disabled || isExporting}
        className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-700 hover:text-[#0A6E5C] hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isExporting ? (
          <>
            <Loader2 size={17} className="animate-spin text-[#0A6E5C]" />
            <span>Generating Statement...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <CheckCircle2 size={17} className="text-emerald-600" />
            <span className="text-emerald-700">Statement Generated</span>
          </>
        ) : (
          <>
            <FileDown size={17} className="text-gray-500 group-hover:text-[#0A6E5C]" />
            <span>Download PDF</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onDownloadCsv}
        disabled={disabled || isExportingCsv}
        title="Download Statement CSV"
        className="py-3 px-3.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:text-[#0A6E5C] hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
      >
        {isExportingCsv ? (
          <Loader2 size={16} className="animate-spin text-[#0A6E5C]" />
        ) : (
          <>
            <FileSpreadsheet size={16} className="text-gray-500 hover:text-[#0A6E5C]" />
            <span className="hidden sm:inline text-xs">CSV</span>
          </>
        )}
      </button>
    </div>
  );
}
