import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import AdminNavBar from '../../layouts/Admin/AdminNavBar';
import AdminHeader from '../../layouts/Admin/AdminHeader';
import { useAdminGetTaskDetailsQuery } from '../../store/services/adminApi';
import TaskDetailsBanner from '../../components/Admin/TaskDetails/TaskDetailsBanner';
import TaskInfoCard from '../../components/Admin/TaskDetails/TaskInfoCard';
import PosterCard from '../../components/Admin/TaskDetails/PosterCard';
import WorkerAssignedCard from '../../components/Admin/TaskDetails/WorkerAssignedCard';

const WORKER_STATUSES = ['assigned', 'in_progress', 'completed'];

const AdminTaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useAdminGetTaskDetailsQuery(taskId);
    const task = data?.task;

    const showWorker = task && WORKER_STATUSES.includes(task.status);

    return (
        <div className="min-h-screen bg-[#F6FAF8] flex">
            <AdminNavBar />

            <div className="flex-1 overflow-y-auto">
                <AdminHeader />

                <div className="p-4 sm:p-6 flex flex-col gap-4 max-w-5xl mx-auto">

                    <button
                        onClick={() => navigate('/admin/tasks')}
                        className="self-start flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0A6E5C] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Tasks
                    </button>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                            <Loader2 size={32} className="animate-spin text-[#0A6E5C]" />
                            <p className="text-sm">Loading task details...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
                            <AlertCircle size={32} />
                            <p className="text-sm font-semibold">Failed to load task. Please try again.</p>
                        </div>
                    )}

                    {!isLoading && !isError && task && (
                        <>
                            <TaskDetailsBanner task={task} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                                <div className="lg:col-span-2 flex flex-col gap-4">
                                    <TaskInfoCard task={task} />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <PosterCard poster={task.poster} />
                                    {showWorker && (
                                        <WorkerAssignedCard worker={task.worker} bid={task.bid} />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminTaskDetails;
