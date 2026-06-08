import React from 'react'
import TaskDetails from '../FormComponents/TaskDetails';
import TaskPhotos from './TaskPhotos';
import TaskLocation from './TaskLocation';
import RightSideBar from './RightSideBar';
import { useForm, FormProvider } from 'react-hook-form';
import { useCreateTaskMutation } from '../../../store/services/api';
import { showError, showSuccess } from '../../../utils/toast';
import { useNavigate } from 'react-router-dom';

const TaskForm = () => {

    const methods = useForm({
        defaultValues: {
            photos: []
        }
    });
    const navigate = useNavigate();

    const [createTask, { isLoading, isError, isSuccess }] = useCreateTaskMutation();

    const onSubmitForm = async (data) => {
        console.log("Form data:", data);

        try {
            const result = await createTask(data).unwrap();

            showSuccess("Task created successfully!");
            console.log("Task created successfully:", result);

            methods.reset();

            setTimeout(() => {
                navigate('/poster/my-tasks');
            }, 1500);

        } catch (error) {
            showError(error?.data?.message || "Something went wrong");
            console.error("Task creation failed:", error);
        }
    };

    const previewTitle = methods.watch("taskTitle");
    const previewLocation = methods.watch("area");
    const previewBudget = methods.watch("budget");

    return (
        <div>
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmitForm)}>
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
                        <div className="space-y-5">
                            <TaskDetails />
                            <TaskPhotos />
                            <TaskLocation />
                        </div>
                        <RightSideBar
                            title={previewTitle}
                            location={previewLocation}
                            budget={previewBudget}
                        />
                    </div>
                    <div className="mt-6 flex justify-center pb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full max-w-lg py-4 rounded-2xl bg-[#0A6E5C] text-white font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#0A6E5C]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Posting..." : "Post New Task"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default TaskForm