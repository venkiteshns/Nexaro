import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Plus,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Star,
    User,
} from 'lucide-react';

import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';
import { useGetPosterTasksQuery } from '../../store/services/api';

function getStatusConfig(status) {
    switch (status) {
        case 'open':
            return { badge: 'bg-orange-50 text-orange-600', border: 'border-l-orange-500', label: 'OPEN' };
        case 'in_progress':
            return { badge: 'bg-blue-50 text-blue-600', border: 'border-l-blue-500', label: 'IN PROGRESS' };
        case 'completed':
            return { badge: 'bg-green-50 text-green-600', border: 'border-l-green-600', label: 'COMPLETED' };
        case 'cancelled':
            return { badge: 'bg-red-50 text-red-600', border: 'border-l-red-500', label: 'CANCELLED' };
        default:
            return { badge: 'bg-gray-100 text-gray-500', border: 'border-l-gray-300', label: status?.toUpperCase() || 'UNKNOWN' };
    }
}

function TaskCard({ task }) {
    const { badge, border, label } = getStatusConfig(task.status);

    const postedDate = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : '';

    return (
        <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} mb-3 shadow-sm overflow-hidden`}>

            <div className="flex justify-between items-start px-5 pt-4 pb-3">

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-[#0A6E5C]" />
                    </div>
                    <div>
                        <p className="font-semibold text-[15px] text-gray-900">{task.title}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {task.address?.city && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin size={12} />
                                    {task.address.city}
                                </span>
                            )}
                            {postedDate && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock size={12} />
                                    Posted {postedDate}
                                </span>
                            )}
                            {task.assignedWorker && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <User size={12} />
                                    Assigned to{' '}
                                    <strong className="text-gray-800">{task.assignedWorker?.name || 'Worker'}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="font-bold text-base text-gray-900">
                        ₹{Number(task.amount).toLocaleString('en-IN')}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${badge}`}>
                        {label}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center px-5 pb-4 pt-2 border-t border-gray-100">

                <div className="text-sm text-gray-500">
                    {task.status === 'open' && task.bidCount > 0 && (
                        <span className="text-[#0A6E5C] font-semibold">
                            {task.bidCount} new bid{task.bidCount > 1 ? 's' : ''} waiting
                        </span>
                    )}
                    {task.status === 'open' && (!task.bidCount || task.bidCount === 0) && (
                        <span>No bids yet</span>
                    )}
                    {task.status === 'in_progress' && (
                        <span>Job in progress · ETA soon</span>
                    )}
                    {task.status === 'completed' && (
                        <span className="flex items-center gap-1">
                            Completed
                            <Star size={13} fill="#FBBF24" color="#FBBF24" />
                            You rated 5 stars
                        </span>
                    )}
                    {task.status === 'cancelled' && (
                        <span className="text-red-600">Cancelled by you</span>
                    )}
                </div>

                <div className="flex gap-2">
                    {task.status === 'open' && (
                        <>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-red-200 bg-red-50 text-red-600 cursor-pointer hover:bg-red-100 transition-colors">
                                Cancel
                            </button>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#0A6E5C] text-white cursor-pointer hover:bg-[#085e4e] transition-colors">
                                Review Bids
                            </button>
                        </>
                    )}

                    {task.status === 'in_progress' && (
                        <>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
                                View Progress
                            </button>
                            <button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#0A6E5C] text-white cursor-pointer hover:bg-[#085e4e] transition-colors">
                                Release Payment
                            </button>
                        </>
                    )}

                    {task.status === 'completed' && (
                        <button className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
                            View Details
                        </button>
                    )}

                    {task.status === 'cancelled' && (
                        <button className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors">
                            Repost Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, count, label, topColor }) {
    return (
        <div
            className="flex-1 min-w-[110px] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
            style={{ borderTop: `3px solid ${topColor}` }}
        >
            <div style={{ color: topColor }}>{icon}</div>
            <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{count}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
            </div>
        </div>
    );
}

const MyTasks = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [activeTab, setActiveTab] = useState('all');
    const [searchText, setSearchText] = useState('');

    const { data, isLoading, isError } = useGetPosterTasksQuery();
    console.log(data);

    const allTasks = data?.tasks || [];

    const counts = {
        total: allTasks.length,
        open: allTasks.filter((t) => t.status === 'open').length,
        in_progress: allTasks.filter((t) => t.status === 'in_progress').length,
        completed: allTasks.filter((t) => t.status === 'completed').length,
        cancelled: allTasks.filter((t) => t.status === 'cancelled').length,
    };

    const tabs = [
        { key: 'all', label: 'All', count: counts.total },
        { key: 'open', label: 'Open', count: counts.open },
        { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
        { key: 'completed', label: 'Completed', count: counts.completed },
        { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
    ];

    const filteredTasks = allTasks.filter((task) => {
        const matchesTab = activeTab === 'all' || task.status === activeTab;
        const matchesSearch =
            searchText === '' ||
            task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            task.address?.city?.toLowerCase().includes(searchText.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <PosterNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PosterHeader />

                <div className="flex-1 overflow-y-auto p-6">

                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h1 className="text-[22px] font-extrabold text-gray-900">My Tasks</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage all your posted tasks from one central dashboard.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/poster/post-task')}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0A6E5C] text-white rounded-xl font-semibold text-sm shadow-md hover:bg-[#085e4e] transition-colors"
                        >
                            <Plus size={16} />
                            Post New Task
                        </button>
                    </div>

                    <div className="flex gap-3 mb-5 flex-wrap">
                        <StatCard icon={<CheckCircle size={20} />} count={counts.total} label="TOTAL POSTED" topColor="#0A6E5C" />
                        <StatCard icon={<Clock size={20} />} count={counts.open} label="OPEN" topColor="#EA580C" />
                        <StatCard icon={<AlertCircle size={20} />} count={counts.in_progress} label="IN PROGRESS" topColor="#2563EB" />
                        <StatCard icon={<CheckCircle size={20} />} count={counts.completed} label="COMPLETED" topColor="#16A34A" />
                        <StatCard icon={<XCircle size={20} />} count={counts.cancelled} label="CANCELLED" topColor="#DC2626" />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-5">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-3">
                            <Search size={16} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Filter by task name or location..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="border-none outline-none bg-transparent text-sm text-gray-900 w-full placeholder-gray-400"
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === tab.key
                                        ? 'bg-[#0A6E5C] text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span
                                            className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] ${activeTab === tab.key
                                                ? 'bg-white/25 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Loading your tasks...
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-10 text-red-500 text-sm">
                            Could not load tasks. Please try again later.
                        </div>
                    )}

                    {!isLoading && !isError && filteredTasks.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-1">No tasks found</p>
                            <p className="text-xs text-gray-400">
                                {activeTab === 'all'
                                    ? "You haven't posted any tasks yet."
                                    : `No ${activeTab.replace('_', ' ')} tasks right now.`}
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && filteredTasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}

                </div>
            </div>
        </div>
    );
};

export default MyTasks;
