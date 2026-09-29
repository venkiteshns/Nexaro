import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";
import TaskForm from "../../components/Form/Tasks/TaskForm";

const PostTask = () => {
  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <PosterHeader />

        <main className="flex-1 md:overflow-y-auto p-3 sm:p-5 lg:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#111827]">
              Post a New Task
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs">
              Describe your task clearly to attract the best workers near you.
            </p>
          </div>

          <TaskForm />
          
        </main>
      </div>
    </div>
  );
};

export default PostTask;
