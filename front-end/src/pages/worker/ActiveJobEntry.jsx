import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';
import { useGetWorkerCurrentActiveJobQuery } from '../../store/services/workerApi';

function NoActiveJob({ onNavigate }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
            {/* Illustration */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <Wrench size={36} className="text-emerald-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-orange-400" />
                </div>
            </div>

            <div className="max-w-xs">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">No Active Jobs</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    You don&apos;t have any active jobs right now. Browse nearby tasks and place a bid to get started!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0A6E5C] text-white
                               text-sm font-bold hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-md"
                >
                    <MapPin size={15} />
                    Browse Nearby Tasks
                </button>
            </div>

            {/* Tips card */}
            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-sm text-left">
                <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-wider mb-3">How it works</p>
                <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        Browse tasks near your location
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        Place a competitive bid
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        Once accepted, your active job appears here
                    </li>
                </ol>
            </div>
        </div>
    );
}

const ActiveJobEntry = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetWorkerCurrentActiveJobQuery();

    // Redirect immediately when a taskId is available
    useEffect(() => {
        if (data?.taskFound && data?.taskId) {
            navigate(`/worker/active-job/${data.taskId}`, { replace: true });
        }
    }, [data, navigate]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
                            <div className="relative w-20 h-20">
                                <div className="w-20 h-20 rounded-full border-4 border-emerald-100" />
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 size={22} className="text-[#0A6E5C] animate-spin" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">Checking for active jobs…</p>
                        </div>
                    )}

                    {/* Error */}
                    {isError && !isLoading && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                                <AlertTriangle size={32} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-base font-extrabold text-gray-900 mb-1">Something went wrong</p>
                                <p className="text-sm text-gray-400 max-w-xs">
                                    Unable to check for active jobs. Please check your connection.
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* No active job */}
                    {!isLoading && !isError && data && !data.taskFound && (
                        <NoActiveJob onNavigate={() => navigate('/worker/nearby-tasks')} />
                    )}

                    {/* Redirecting — show brief loader while useEffect fires */}
                    {!isLoading && !isError && data?.taskFound && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
                            <Loader2 size={28} className="text-[#0A6E5C] animate-spin" />
                            <p className="text-sm text-gray-400">Loading your active job…</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ActiveJobEntry;
