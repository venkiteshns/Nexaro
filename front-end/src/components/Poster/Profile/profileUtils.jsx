import { Wrench, Zap, Paintbrush, ClipboardList } from "lucide-react";

export const categoryIcon = (category) => {
  switch ((category || "").toLowerCase()) {
    case "plumbing":
      return <Wrench size={16} />;
    case "electrical":
      return <Zap size={16} />;
    case "painting":
      return <Paintbrush size={16} />;
    default:
      return <ClipboardList size={16} />;
  }
};

export const statusColor = (status) => {
  switch (status) {
    case "completed":
      return "text-emerald-600 bg-emerald-50";
    case "in_progress":
      return "text-blue-600 bg-blue-50";
    case "open":
      return "text-orange-600 bg-orange-50";
    case "cancelled":
      return "text-red-500 bg-red-50";
    default:
      return "text-gray-500 bg-gray-100";
  }
};
