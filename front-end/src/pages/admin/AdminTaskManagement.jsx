import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AdminNavBar from '../../layouts/Admin/AdminNavBar';
import AdminHeader from '../../layouts/Admin/AdminHeader';
import { showError, showSuccess } from '../../utils/toast.js'
import {
    Search,
    ClipboardList,
    CheckCircle2,
    XCircle,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
} from 'lucide-react';
import { useAdminGetAllTasksQuery, useAdminTaskDeleteMutation } from '../../store/services/adminApi';
import useDebounce from '../../customHooks/useDebounce';
import { useNavigate } from 'react-router-dom';

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

function StatsSec({ icon, count, label, color }) {
    return (
        <div className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border text-xs md:text-sm font-semibold ${color}`}>
            {icon}
            <span>{count} {label}</span>
        </div>
    );
}

function ConfirmModal({ taskTitle, onConfirm, onCancel, isLoading }) {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4 border border-gray-100 animate-[fadeIn_.15s_ease]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-500" />
                </div>

                <h2 className="text-center text-[#111827] font-bold text-base mb-1">
                    Delete Task?
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    You are about to permanently delete{' '}
                    <span className="font-semibold text-gray-700">&ldquo;{taskTitle}&rdquo;</span>.
                    This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Trash2 size={14} />
                        )}
                        {isLoading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function MobileTaskCard({ task }) {
    const config = getStatusConfig(task.status);
    const posterName = task.posterId?.name || 'Unknown';
    const navigate = useNavigate();

    const [deleteTask, { isLoading: isDeleting }] = useAdminTaskDeleteMutation();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteTask(task._id).unwrap();
            if (res.success) showSuccess(res.message);
            else showError(res.message);
        } catch (err) {
            showError(err?.data?.message || 'Failed to delete task');
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="p-4 hover:bg-[#F6FAF8] transition-colors">
            {showConfirm && (
                <ConfirmModal
                    taskTitle={task.title}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowConfirm(false)}
                    isLoading={isDeleting}
                />
            )}

            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-1 self-stretch rounded-full shrink-0 ${config.dot}`} />
                    <div className="min-w-0">
                        <p className="font-semibold text-[#111827] text-sm leading-snug truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{task.category}</p>
                    </div>
                </div>
                <span className="text-sm font-bold text-gray-900 shrink-0">
                    ₹{Number(task.amount || 0).toLocaleString('en-IN')}
                </span>
            </div>

            {/* Poster + Status row */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-xs shrink-0">
                        {posterName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-600">{posterName}</span>
                </div>
                <StatusBadge status={task.status} />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                {task.status !== 'cancelled' && (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <Trash2 size={12} />
                        Delete Task
                    </button>
                )}
                <button
                    onClick={() => navigate(`/admin/tasks/${task._id}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-[#0A6E5C] hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                    <Eye size={12} />
                    View Task
                </button>
            </div>
        </div>
    );
}

function TaskRow({ task }) {
    const config = getStatusConfig(task.status);
    const posterName = task.posterId?.name || 'Unknown';
    const navigate = useNavigate();

    const [deleteTask, { isLoading: isDeleting }] = useAdminTaskDeleteMutation();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteTask(task._id).unwrap();
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message);
            }
        } catch (err) {
            showError(err?.data?.message || 'Failed to delete task');
        } finally {
            setShowConfirm(false);
        }
    };

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
                {showConfirm && (
                    <ConfirmModal
                        taskTitle={task.title}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setShowConfirm(false)}
                        isLoading={isDeleting}
                    />
                )}
                <div className="flex items-center gap-2">
                    {task.status !== 'cancelled' && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={12} />
                            Delete Task
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/admin/tasks/${task._id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#0A6E5C] hover:bg-emerald-100 transition-colors flex items-center gap-1">
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

    const debouncedSearch = useDebounce({ searchText, delay: 400 });

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter, categoryFilter]);

    const { data, isLoading, isError } = useAdminGetAllTasksQuery({
        page: currentPage,
        limit: 4,
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
    });

    // console.log(data);

    const tasks = data?.tasks || [];
    const totalPages = data?.totalPages || 1;
    const totalTasks = data?.totalTasks || 0;
    const categories = data?.categories || [];

    const counts = {
        open: data?.statusCounts?.open ?? 0,
        assigned: data?.statusCounts?.assigned ?? 0,
        in_progress: data?.statusCounts?.in_progress ?? 0,
        completed: data?.statusCounts?.completed ?? 0,
        cancelled: data?.statusCounts?.cancelled ?? 0,
    };

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
                        <StatsSec
                            icon={<ClipboardList size={14} />}
                            count={totalTasks}
                            label="Total"
                            color="border-gray-200 text-gray-600 bg-white"
                        />
                        <StatsSec
                            icon={<span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                            count={counts.open}
                            label="Open"
                            color="border-blue-200 text-blue-600 bg-blue-50"
                        />
                        <StatsSec
                            icon={<span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />}
                            count={counts.assigned}
                            label="Assigned"
                            color="border-yellow-200 text-yellow-600 bg-yellow-50"
                        />
                        <StatsSec
                            icon={<span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
                            count={counts.in_progress}
                            label="In Progress"
                            color="border-purple-200 text-purple-600 bg-purple-50"
                        />
                        <StatsSec
                            icon={<CheckCircle2 size={14} />}
                            count={counts.completed}
                            label="Completed"
                            color="border-emerald-200 text-emerald-600 bg-emerald-50"
                        />
                        <StatsSec
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
                                    <option value="all">All Categories</option>
                                    {
                                        categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="lg:hidden divide-y divide-gray-50">
                            {isLoading && (
                                <p className="px-5 py-12 text-center text-gray-400 text-sm">Loading tasks...</p>
                            )}
                            {isError && (
                                <p className="px-5 py-12 text-center text-red-400 text-sm">Failed to load tasks. Please try again.</p>
                            )}
                            {!isLoading && !isError && tasks.length === 0 && (
                                <p className="px-5 py-12 text-center text-gray-400 text-sm">No tasks found.</p>
                            )}
                            {!isLoading && !isError && tasks.map((task) => (
                                <MobileTaskCard key={task._id} task={task} />
                            ))}
                        </div>

                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
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

                                    {!isLoading && !isError && tasks.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No tasks found.
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError && tasks.map((task) => (
                                        <TaskRow key={task._id} task={task} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Pagination footer ── */}
                        <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500 order-2 sm:order-1">
                                Showing page {currentPage} of {totalPages} · {totalTasks} total tasks
                            </p>
                            <div className="flex items-center gap-2 order-1 sm:order-2">
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
