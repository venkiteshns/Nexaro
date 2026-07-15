import { useState, useEffect } from "react";
import {
  X,
  Camera,
  Upload,
  Image,
  ClipboardList,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useUpdateTaskMutation } from "../../store/services/posterApi";
import { showError, showSuccess } from "../../utils/toast";

const CATEGORIES = [
  { label: "Cleaning Services", value: "Cleaning" },
  { label: "Plumbing", value: "Plumbing" },
  { label: "Electrical", value: "Electrical" },
  { label: "Home Repair", value: "Home Repair" },
  { label: "Gardening", value: "Gardening" },
  { label: "Painting", value: "Painting" },
  { label: "Moving & Packing", value: "Moving" },
  { label: "IT & Tech Support", value: "IT & Tech Support" },
  { label: "Babysitting", value: "Babysitting" },
  { label: "Pet Care", value: "Pet Care" },
  { label: "Cooking", value: "Cooking" },
  { label: "Delivery", value: "Delivery" },
];

const toDateInputValue = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  // Form state seeded from task
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState(task.category || "");
  const [deadline, setDeadline] = useState(toDateInputValue(task.deadline));
  const [urgencyLevel, setUrgencyLevel] = useState(
    task.urgencyLevel || "flexible",
  );
  const [amount, setAmount] = useState(task.amount ?? "");

  // Image management
  // retainedImages → existing task images the poster wants to KEEP
  const [retainedImages, setRetainedImages] = useState(task.images || []);
  // newPhotos → newly selected local File objects
  const [newPhotos, setNewPhotos] = useState([]);

  const [errors, setErrors] = useState({});

  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const totalImageCount = retainedImages.length + newPhotos.length;

  // ── Prevent body scroll ──────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Image handlers ───────────────────────────────────────────────────────
  const handleAddNewPhotos = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - totalImageCount;
    const toAdd = files.slice(0, remaining);
    setNewPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const handleRemoveRetained = (publicId) => {
    setRetainedImages((prev) =>
      prev.filter((img) => img.public_id !== publicId),
    );
  };

  const handleRemoveNew = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Task title is required";
    else if (title.length < 3) e.title = "Title must be at least 3 characters";
    if (!description.trim()) e.description = "Description is required";
    if (!category) e.category = "Category is required";
    if (!deadline) e.deadline = "Deadline is required";
    if (!amount || Number(amount) < 1) e.amount = "Budget must be above 0";
    if (totalImageCount === 0) e.images = "At least 1 image is required";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await updateTask({
        taskId: task._id,
        formValues: {
          title,
          description,
          category,
          deadline,
          urgencyLevel,
          amount,
          newPhotos,
        },
        retainedImages,
      }).unwrap();

      showSuccess("Task updated successfully!");
      onUpdated?.();
      onClose();
    } catch (err) {
      showError(
        err?.data?.message || "Failed to update task. Please try again.",
      );
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.50)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#0A6E5C] to-emerald-400 shrink-0" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-[#0A6E5C]" />
            <h2 className="font-bold text-gray-900 text-base">Edit Task</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <form id="edit-task-form" onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((p) => ({ ...p, title: "" }));
                }}
                placeholder="e.g., Professional Home Deep Cleaning"
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-white ${errors.title ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[#0A6E5C]"}`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setErrors((p) => ({ ...p, category: "" }));
                    }}
                    className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-white cursor-pointer pr-10 ${errors.category ? "border-red-400" : "border-gray-200 focus:border-[#0A6E5C]"}`}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Budget (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors((p) => ({ ...p, amount: "" }));
                    }}
                    placeholder="5,000"
                    className={`w-full bg-gray-50 border rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-white ${errors.amount ? "border-red-400" : "border-gray-200 focus:border-[#0A6E5C]"}`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((p) => ({ ...p, description: "" }));
                }}
                placeholder="Detail the work, required skills, and expectations..."
                rows={4}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none transition-colors focus:bg-white ${errors.description ? "border-red-400" : "border-gray-200 focus:border-[#0A6E5C]"}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Deadline + Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Preferred Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    setErrors((p) => ({ ...p, deadline: "" }));
                  }}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-white ${errors.deadline ? "border-red-400" : "border-gray-200 focus:border-[#0A6E5C]"}`}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Urgency Level
                </label>
                <div className="flex gap-2">
                  {["flexible", "normal", "urgent"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgencyLevel(level)}
                      className={`flex-1 py-3 rounded-xl text-xs font-medium capitalize transition-all ${urgencyLevel === level ? "bg-[#0A6E5C] text-white shadow-sm" : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#0A6E5C]/50 hover:text-[#0A6E5C]"}`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Camera size={16} className="text-[#0A6E5C]" />
                <h3 className="text-sm font-semibold text-gray-800">
                  Task Photos
                </h3>
                <span className="ml-auto text-xs text-gray-400">
                  {totalImageCount}/5
                </span>
              </div>

              <div className="flex gap-3 flex-wrap">
                {/* Upload button */}
                {totalImageCount < 5 && (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0A6E5C] hover:bg-emerald-50 transition-all group">
                    <Upload
                      size={18}
                      className="text-gray-400 group-hover:text-[#0A6E5C] mb-1 transition-colors"
                    />
                    <span className="text-[10px] text-gray-400 group-hover:text-[#0A6E5C] transition-colors">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAddNewPhotos}
                    />
                  </label>
                )}

                {/* Existing retained images */}
                {retainedImages.map((img) => (
                  <div
                    key={img.public_id}
                    className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 relative shrink-0"
                  >
                    <img
                      src={img.url}
                      alt="task"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRetained(img.public_id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors border border-gray-100"
                    >
                      <X size={12} className="text-red-500" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-semibold">
                      Saved
                    </div>
                  </div>
                ))}

                {/* New local images */}
                {newPhotos.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="w-24 h-24 rounded-xl overflow-hidden border border-emerald-300 relative shrink-0"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNew(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors border border-gray-100"
                    >
                      <X size={12} className="text-red-500" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-semibold">
                      New
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({
                  length: Math.max(
                    0,
                    4 - retainedImages.length - newPhotos.length,
                  ),
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-24 h-24 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"
                  >
                    <Image size={20} className="text-gray-300" />
                  </div>
                ))}
              </div>

              {errors.images && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle size={13} className="text-red-500" />
                  <p className="text-xs text-red-500">{errors.images}</p>
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-2">
                Add up to 5 photos. Tap ✕ to remove. "Saved" = existing images
                already on the task.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-task-form"
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-semibold hover:bg-[#085e4e] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
