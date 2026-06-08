import React, { useState } from 'react';
import AdminNavBar from '../../layouts/Admin/AdminNavBar';
import AdminHeader from '../../layouts/Admin/AdminHeader';
import {
    Search,
    ClipboardList,
    CheckCircle2,
    XCircle,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useAdminGetAllTasksQuery } from '../../store/services/api';

function getStatusConfig(status) {
    switch (status) {
        case 'open':
            return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-600', label: 'OPEN' };
        case 'assigned':
            return { dot: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-600', label: 'ASSIGNED' };
        case 'in_progress':
            return { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-600', label: 'IN PROGRESS' };
        case 'completed':
            return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600', label: 'COMPLETED' };
        case 'cancelled':
            return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-600', label: 'CANCELLED' };
        default:
            return { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500', label: 'UNKNOWN' };
    }
}

function StatusBadge({ status }) {
    const config = getStatusConfig(status);
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

function StatPill({ icon, count, label, color }) {
    return (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold ${color}`}>
            {icon}
            <span>{count} {label}</span>
        </div>
    );
}

function TaskRow({ task }) {
    const config = getStatusConfig(task.status);

    const posterName = task.posterId?.name || 'Unknown';

    return (
        <tr className="border-b border-gray-50 hover:bg-[#F6FAF8] transition-colors">

            <td className="px-6 py-5">
                <div className="flex items-start gap-3">
                    <div className={`w-1 self-stretch rounded-full ${config.dot}`} />
                    <div>
                        <p className="font-semibold text-[#111827] text-sm">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {task.category}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm shrink-0">
                        {posterName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{posterName}</span>
                </div>
            </td>

            <td className="px-6 py-5">
                <span className="text-sm font-semibold text-[#111827]">
                    ₹{Number(task.amount || 0).toLocaleString('en-IN')}
                </span>
            </td>

            <td className="px-6 py-5">
                <StatusBadge status={task.status} />
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1">
                        <Trash2 size={12} />
                        Delete Task
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#0A6E5C] hover:bg-emerald-100 transition-colors flex items-center gap-1">
                        <Eye size={12} />
                        View Task
                    </button>
                </div>
            </td>
        </tr>
    );
}

const AdminTaskManagement = () => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useAdminGetAllTasksQuery({
        page: currentPage,
        limit: 4,
    });

    const tasks = data?.tasks || [];
    const totalPages = data?.totalPages || 1;
    const totalTasks = data?.totalTasks || 0;

    const counts = {
        open: tasks.filter((t) => t.status === 'open').length,
        assigned: tasks.filter((t) => t.status === 'assigned').length,
        in_progress: tasks.filter((t) => t.status === 'in_progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        cancelled: tasks.filter((t) => t.status === 'cancelled').length,
    };

    const categories = ['all', ...new Set(tasks.map((t) => t.category).filter(Boolean))];

    const filteredTasks = tasks.filter((task) => {
        const posterName = task.posterId?.name || '';

        const matchesSearch =
            searchText === '' ||
            task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            posterName.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    return (
        <div className="min-h-screen bg-[#F6FAF8] flex">
            <AdminNavBar />

            <div className="flex-1 overflow-y-auto">
                <AdminHeader />

                <div className="p-6 flex flex-col gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#111827]">Task Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Monitor and moderate all platform tasks with precision authority.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <StatPill
                            icon={<ClipboardList size={14} />}
                            count={totalTasks}
                            label="Total"
                            color="border-gray-200 text-gray-600 bg-white"
                        />
                        <StatPill
                            icon={<span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                            count={counts.open}
                            label="Open"
                            color="border-blue-200 text-blue-600 bg-blue-50"
                        />
                        <StatPill
                            icon={<span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />}
                            count={counts.assigned}
                            label="Assigned"
                            color="border-yellow-200 text-yellow-600 bg-yellow-50"
                        />
                        <StatPill
                            icon={<span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
                            count={counts.in_progress}
                            label="In Progress"
                            color="border-purple-200 text-purple-600 bg-purple-50"
                        />
                        <StatPill
                            icon={<CheckCircle2 size={14} />}
                            count={counts.completed}
                            label="Completed"
                            color="border-emerald-200 text-emerald-600 bg-emerald-50"
                        />
                        <StatPill
                            icon={<XCircle size={14} />}
                            count={counts.cancelled}
                            label="Cancelled"
                            color="border-red-200 text-red-500 bg-red-50"
                        />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div className="md:col-span-1">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Global Search</p>
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                                    <Search size={15} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Task title, poster, or worker..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Category</p>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="border-b border-gray-100">
                                    <tr className="text-left text-gray-500 text-sm">
                                        <th className="px-6 py-5 font-medium">Task Details</th>
                                        <th className="px-6 py-5 font-medium">Poster</th>
                                        <th className="px-6 py-5 font-medium">Budget</th>
                                        <th className="px-6 py-5 font-medium">Status</th>
                                        <th className="px-6 py-5 font-medium">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                Loading tasks...
                                            </td>
                                        </tr>
                                    )}

                                    {isError && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-red-400 text-sm">
                                                Failed to load tasks. Please try again.
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError && filteredTasks.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No tasks found.
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError && filteredTasks.map((task) => (
                                        <TaskRow key={task._id} task={task} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-5 flex items-center justify-between border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing page {currentPage} of {totalPages} · {totalTasks} total tasks
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm font-medium text-gray-700 px-2">
                                    {currentPage}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminTaskManagement;
