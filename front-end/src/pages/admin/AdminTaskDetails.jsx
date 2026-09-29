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
        <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
            <AdminNavBar />

            <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
                <AdminHeader />

                <div className="flex-1 md:overflow-y-auto p-3 sm:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-3 sm:gap-4">

                    <button
                        onClick={() => navigate('/admin/tasks')}
                        className="self-start flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#0A6E5C] transition-colors"
                    >
                        <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                        Back to Tasks
                    </button>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-2.5 sm:gap-3 text-gray-400">
                            <Loader2 size={28} className="animate-spin text-[#0A6E5C]" />
                            <p className="text-xs sm:text-sm">Loading task details...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-2.5 sm:gap-3 text-red-400">
                            <AlertCircle size={28} />
                            <p className="text-xs sm:text-sm font-semibold">Failed to load task. Please try again.</p>
                        </div>
                    )}

                    {!isLoading && !isError && task && (
                        <>
                            <TaskDetailsBanner task={task} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

                                <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
                                    <TaskInfoCard task={task} />
                                </div>

                                <div className="flex flex-col gap-3 sm:gap-4">
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
