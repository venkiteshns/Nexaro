import { useState } from "react";
import TaskDetails from "../FormComponents/TaskDetails";
import TaskPhotos from "./TaskPhotos";
import RightSideBar from "./RightSideBar";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useCreateTaskMutation } from "../../../store/services/posterApi";
import { showError, showSuccess } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import LocationSelection from "../../sharedComponents/LocationSelection";
import { uploadFilesToS3 } from "../../../utils/s3Upload";
import { Loader2, CheckCircle2, PlusCircle } from "lucide-react";

const TaskForm = () => {
  const methods = useForm({
    defaultValues: {
      photos: [],
    },
  });
  const navigate = useNavigate();

  const [createTask, { isLoading: isApiLoading }] = useCreateTaskMutation();
  const [submitStatus, setSubmitStatus] = useState("idle"); // "idle" | "uploading" | "processing" | "posted"

  const isSubmitting = submitStatus === "uploading" || submitStatus === "processing" || isApiLoading;
  const isPosted = submitStatus === "posted";
  const isButtonDisabled = isSubmitting || isPosted;

  const onSubmitForm = async (data) => {
    try {
      let uploadedImages = [];
      const photosCount = data.photos ? Array.from(data.photos).length : 0;

      if (photosCount > 0) {
        setSubmitStatus("uploading");
        uploadedImages = await uploadFilesToS3(Array.from(data.photos), "tasks");
      }

      setSubmitStatus("processing");
      const payload = {
        ...data,
        uploadedImages,
      };

      await createTask(payload).unwrap();

      setSubmitStatus("posted");
      showSuccess("Task created successfully!");

      methods.reset();

      setTimeout(() => {
        navigate("/poster/my-tasks");
      }, 1500);
    } catch (error) {
      setSubmitStatus("idle");
      showError(error?.data?.message || error?.message || "Something went wrong while posting the task");
      console.error("Task creation failed:", error);
    }
  };

  const onInvalid = (errors) => {
    if (errors.taskTitle) {
      showError(errors.taskTitle.message || "Please enter a valid task title");
    } else if (errors.category) {
      showError(errors.category.message || "Please select a task category");
    } else if (errors.budget) {
      showError(errors.budget.message || "Please enter a valid budget");
    } else if (errors.locationLat || errors.locationlng) {
      showError("Please pick a location on the map");
    } else {
      showError("Please complete all required fields");
    }
  };

  const previewTitle = useWatch({ control: methods.control, name: "taskTitle" });
  const previewLocation = useWatch({ control: methods.control, name: "area" });
  const previewBudget = useWatch({ control: methods.control, name: "budget" });

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitForm, onInvalid)}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
            <div className="space-y-3.5 sm:space-y-4">
              <TaskDetails />
              <TaskPhotos />
              <LocationSelection SectionName={"Task Location"} />
            </div>
            <RightSideBar
              title={previewTitle}
              location={previewLocation}
              budget={previewBudget}
            />
          </div>

          <div className="mt-5 flex flex-col items-center justify-center pb-4 space-y-2.5">
            {/* Status Feedback Banner */}
            {isSubmitting && (
              <div className="w-full max-w-sm flex items-center justify-center gap-2 text-xs font-semibold text-[#0A6E5C] bg-[#0A6E5C]/10 border border-[#0A6E5C]/20 py-2 px-3.5 rounded-xl animate-pulse">
                <Loader2 size={14} className="animate-spin shrink-0 text-[#0A6E5C]" />
                <span>
                  {submitStatus === "uploading" && "Uploading task photos to secure storage..."}
                  {(submitStatus === "processing" || isApiLoading) && "Processing task details & publishing..."}
                </span>
              </div>
            )}

            {isPosted && (
              <div className="w-full max-w-sm flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 py-2 px-3.5 rounded-xl shadow-xs">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>Task posted successfully! Redirecting...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="post-task-submit-btn"
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full max-w-sm py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                isPosted
                  ? "bg-emerald-600 text-white cursor-default shadow-emerald-600/20"
                  : isSubmitting
                  ? "bg-[#0A6E5C]/80 text-white cursor-not-allowed opacity-90 shadow-[#0A6E5C]/10"
                  : "bg-[#0A6E5C] text-white hover:opacity-95 active:scale-[0.98] shadow-[#0A6E5C]/20 cursor-pointer"
              }`}
            >
              {submitStatus === "uploading" && (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  <span>Uploading Photos...</span>
                </>
              )}
              {(submitStatus === "processing" || isApiLoading) && (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  <span>Processing Task...</span>
                </>
              )}
              {isPosted && (
                <>
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Task Posted!</span>
                </>
              )}
              {!isSubmitting && !isPosted && (
                <>
                  <PlusCircle size={16} className="shrink-0" />
                  <span>Post New Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default TaskForm;
