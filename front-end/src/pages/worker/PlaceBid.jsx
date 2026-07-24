import {
  ArrowLeft,
  MapPin,
  Clock,
  Image,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useAddNewBidMutation, useGetTaskForBidQuery } from "../../store/services/workerApi";
import { FormProvider, useForm } from "react-hook-form";
import BidForm from "../../components/Form/Bids/BidForm";
import { showError, showSuccess, showWarning } from "../../utils/toast";

function PhotoStrip({ photos }) {
  return (
    <div className="overflow-x-auto mt-4 pb-1">
      <div className="flex gap-3 w-max">
        {photos.map((img, i) => (
          <div
            key={i}
            className="relative h-24 w-28 rounded-xl overflow-hidden shrink-0 bg-gray-100"
          >
            <img
              src={img?.url}
              alt={`task-photo-${i}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {photos.length === 0 && (
          <div className="relative h-24 w-28 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <Image className="text-gray-400" size={24} />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-bold">No Photos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Bid Form ─────────────────── */
const PlaceBid = () => {
  const navigate = useNavigate();
  let task = null;

  const methods = useForm();

  const { taskId } = useParams();

  const { data } = useGetTaskForBidQuery(taskId);

  const [addbid, { isSuccess: bidSuccess, isLoading: bidLoading, isError: bidError }] = useAddNewBidMutation();

  if (data) {
    task = data?.task[0];
  }

  const handleBidSubmission = async (data) => {
    console.log("submit data : ", data);
    try {
      let res = await addbid(data).unwrap()
      console.log("add bid response : ", res)
      showSuccess(res.message)
      setTimeout(() => {
        navigate("/worker/my-bids")
      }, 3200);
      methods.reset()
    } catch (error) {
      // console.log("error", error.data.message);
      if (error.data.message === "You have already bid on this task") {
        showWarning(error.data.message)
      } else {
        showError(error.data.message)
        methods.reset()
      }
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Back nav */}
          <div className="px-6 pt-5 pb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Task Feed
            </button>
          </div>

          {task && !bidSuccess && (
            <div className="px-6 pb-10 max-w-3xl mx-auto w-full space-y-5">

              {/* ── Task card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                {/* Category badge + budget */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    {task.category}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                      Poster's Budget
                    </p>
                    <p className="text-3xl font-extrabold text-[#0A6E5C] leading-tight">
                      ₹{task.amount}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl font-extrabold text-gray-900 leading-snug mb-3">
                  {task.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#0A6E5C]" />
                    {`${task?.address?.landmark}, ${task?.address?.city}, ${task?.address?.district}, ${task?.address?.state}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#0A6E5C]" />
                    {`Deadline : ${new Date(task?.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Task Description
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Photos */}
                <PhotoStrip photos={task.images} />
              </div>

              {/* ── Place Your Bid Form ── */}
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleBidSubmission)}>
                  <BidForm task={task} bidLoading={bidLoading} bidError={bidError} bidSuccess={bidSuccess} />
                </form>
              </FormProvider>
            </div>)}
          {bidSuccess && <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Bid Placed Successfully!</h2>
            <p className="text-gray-500 mt-2">Your bid has been placed successfully.</p>
            <p>Redirecting to your bids page ...</p>
            < Loader2 className="w-8 h-8 text-[#0A6E5C] mt-2 animate-spin" />
          </div>}
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
