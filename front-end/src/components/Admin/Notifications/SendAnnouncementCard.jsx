import { useState } from "react";
import { Megaphone, Send, Loader2 } from "lucide-react";
import { showWarning } from "../../../utils/toast";

const AUDIENCE_OPTIONS = [
  { id: "ALL USERS", label: "ALL USERS" },
  { id: "WORKERS", label: "WORKERS" },
  { id: "POSTERS", label: "POSTERS" },
];

const SendAnnouncementCard = ({ onSend, isSending = false }) => {
  const [targetAudience, setTargetAudience] = useState("ALL USERS");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showWarning("Please enter an announcement title");
      return;
    }

    if (!message.trim()) {
      showWarning("Please write the announcement message content");
      return;
    }

    const success = await onSend({
      targetAudience,
      title: title.trim(),
      message: message.trim(),
    });

    if (success) {
      setTitle("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs p-3 sm:p-5 space-y-2.5 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-2.5 pb-2 sm:pb-2.5 border-b border-gray-100">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-[#0A6E5C] flex items-center justify-center shrink-0">
          <Megaphone size={13} className="sm:w-4 sm:h-4 text-[#0A6E5C]" />
        </div>
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#111827] tracking-tight">
          Send Announcement
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5">
        <div>
          <label className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-1.5">
            Target Audience
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {AUDIENCE_OPTIONS.map((opt) => {
              const isSelected = targetAudience === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTargetAudience(opt.id)}
                  className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold text-center transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#0A6E5C] text-white border-[#0A6E5C] shadow-2xs"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="announcement-title"
            className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-1.5"
          >
            Announcement Title
          </label>
          <input
            id="announcement-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter headline..."
            disabled={isSending}
            className="w-full rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/60 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-[#111827] placeholder-gray-400 focus:bg-white focus:border-[#0A6E5C] focus:ring-2 focus:ring-[#0A6E5C]/15 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="announcement-message"
            className="block text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-1.5"
          >
            Message Content
          </label>
          <textarea
            id="announcement-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose your message here..."
            disabled={isSending}
            rows={2}
            className="w-full rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 sm:p-3.5 text-xs sm:text-sm text-[#111827] placeholder-gray-400 focus:bg-white focus:border-[#0A6E5C] focus:ring-2 focus:ring-[#0A6E5C]/15 outline-none transition-all resize-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-[#0A6E5C] hover:bg-[#085849] active:bg-[#07473b] text-white font-medium sm:font-semibold text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-2xs hover:shadow transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Sending Broadcast...</span>
            </>
          ) : (
            <>
              <Send size={13} className="sm:w-3.5 sm:h-3.5" />
              <span>Send Announcement Now</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendAnnouncementCard;
