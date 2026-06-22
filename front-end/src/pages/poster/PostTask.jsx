import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";
import TaskForm from "../../components/Form/Tasks/TaskForm";

const PostTask = () => {
  return (
    <div className="h-screen bg-[#F6FAF8] flex overflow-hidden">
      <PosterNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PosterHeader />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111827]">
              Post a New Task
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Describe your task clearly to attract the best workers near you.
            </p>
          </div>

          <TaskForm />
        </div>
      </div>
    </div>
  );
};

export default PostTask;
