import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPosterTaskProgressQuery } from '../../store/services/api';
import {
    ArrowLeft,
    Phone,
    MapPin,
    Clock,
    Calendar,
    Star,
    CheckCircle,
    Circle,
    Wrench,
    Flag,
    ChevronRight,
    ShieldCheck,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import PosterNavBar from '../../layouts/Poster/PosterNavBar';
import PosterHeader from '../../layouts/Poster/PosterHeader';

const STEPS = [
    { key: 'posted', label: 'TASK POSTED', icon: CheckCircle, done: false, active: false },
    { key: 'accepted', label: 'BID ACCEPTED', icon: CheckCircle, done: false, active: false },
    { key: 'payment', label: 'PAYMENT SECURED', icon: CheckCircle, done: false, active: false },
    { key: 'working', label: 'ACTIVE WORKING', icon: Wrench, done: false, active: false },
    { key: 'completed', label: 'COMPLETED', icon: Flag, done: false, active: false },
];

const MOCK = {
    checklist: [
        { id: 1, label: 'Worker arrived at site', done: false },
        { id: 2, label: 'Discussed job and materials', done: false },
        { id: 3, label: 'Started repair work', done: false },
        { id: 4, label: 'Testing for leaks', done: false },
        { id: 5, label: 'Final clean up', done: false },
    ],
};

// ─── Helper ────────────────────────────────────────────────────────────────
function completedCount(list) {
    return list.filter((i) => i.done).length;
}

// ── Page Loader ───────────────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            {/* Spinner ring */}
            <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wrench size={22} className="text-[#0A6E5C]" />
                </div>
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Loading Task Details</p>
                <p className="text-sm text-gray-400">Fetching progress data…</p>
            </div>

            {/* Bouncing dots */}
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

function PageError({ onBack }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Failed to Load</p>
                <p className="text-sm text-gray-400 max-w-xs">
                    We couldn’t fetch the task progress. Please check your connection and try again.
                </p>
            </div>

            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white
                           text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                <ArrowLeft size={15} />
                Back to My Tasks
            </button>
        </div>
    );
}


function ReleaseModal({ amount, workerName, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-1 w-full bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />

                <div className="p-7 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                        <ShieldCheck size={30} className="text-[#0A6E5C]" />
                    </div>

                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">Release Payment?</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        By confirming, <span className="font-semibold text-gray-700">₹{amount}.00</span> will be
                        released immediately to{' '}
                        <span className="font-semibold text-gray-700">{workerName}</span>. This action cannot be
                        undone.
                    </p>

                    <button
                        onClick={onConfirm}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-sm mb-3"
                    >
                        Confirm & Release ₹{amount}.00
                    </button>
                    <button
                        onClick={onCancel}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}


// ─── Main Page ─────────────────────────────────────────────────────────────
const WorkProgress = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();

    const { task, worker, checklist } = MOCK;

    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [released, setReleased] = useState(false);

    const done = completedCount(checklist);
    const total = checklist.length;
    const pct = Math.round((done / total) * 100);

    const { data, isLoading, isError, isSuccess } = useGetPosterTaskProgressQuery(taskId);
    console.log("data", data);

    const mainData = data?.data;
    const { bid, worker: workerData } = mainData ?? {};

    const update = mainData?.update;
    const updateCount = {
        'not_started': 0,
        'arrived': 1,
        'discussed': 2,
        'started': 3,
        'completed': 4,
        'payment': 5,
    }[update];

    const statusUpdate = {
        'open': 1,
        'assigned': 2,
        'in_progress': 3,
        'completed': 4,
        'cancelled': 5,
    }[mainData?.status];

    console.log("updateCount", statusUpdate ? statusUpdate : 89, mainData?.status);
    if (statusUpdate) {

        for (let c = 0; c < statusUpdate; c++) {
            STEPS[c].done = true;
            STEPS[c].active = false;
        }
        STEPS[statusUpdate].active = true;
    }


    for (let c = 1; c <= updateCount; c++) {
        checklist[c - 1].done = true;
    }

    const handleRelease = () => {
        setShowReleaseModal(false);
        setReleased(true);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <PosterNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <PosterHeader />

                {(!isLoading && !isError) && <div className="flex-1 overflow-y-auto">

                    {/* ── Top bar ── */}
                    <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-sm border-b border-gray-200
                                    px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                        <button
                            onClick={() => navigate('/poster/my-tasks', { replace: true })}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Back to My Tasks</span>
                            <span className="sm:hidden">Back</span>
                        </button>

                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                         bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            WORK IN PROGRESS
                        </span>
                    </div>

                    <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-5">

                        {/* ── Title ── */}
                        <div>
                            <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest mb-1">
                                Task Progress
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                {mainData?.title}
                            </h1>
                        </div>

                        {/* ── Progress Stepper ── */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 sm:px-8 py-5 overflow-x-auto">
                            <div className="flex items-center min-w-[380px]">
                                {STEPS.map((step, idx) => {
                                    const Icon = step.icon;
                                    return (
                                        <React.Fragment key={step.key}>
                                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                                <div
                                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all
                                                        ${step.done
                                                            ? 'bg-[#0A6E5C] border-[#0A6E5C] text-white'
                                                            : step.active
                                                                ? 'bg-[#0A6E5C] border-[#0A6E5C] text-white shadow-lg shadow-emerald-200 animate-pulse'
                                                                : 'bg-gray-100 border-gray-300 text-gray-400'
                                                        }`}
                                                >
                                                    <Icon size={16} />
                                                </div>
                                                <span
                                                    className={`text-[8px] sm:text-[9px] font-bold tracking-wider text-center whitespace-nowrap
                                                        ${step.done || step.active ? 'text-[#0A6E5C]' : 'text-gray-400'}`}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>

                                            {idx < STEPS.length - 1 && (
                                                <div
                                                    className={`flex-1 h-0.5 mx-1.5 sm:mx-2 rounded-full
                                                        ${STEPS[idx + 1].done || STEPS[idx + 1].active || step.done
                                                            ? 'bg-[#0A6E5C]'
                                                            : 'bg-gray-200'
                                                        }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {/* Worker card — row on mobile, column on md+ */}
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5
                                            sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center lg:flex-col lg:items-center lg:text-center">
                                    {/* Avatar */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-100
                                                    flex items-center justify-center overflow-hidden shrink-0">
                                        {workerData?.selfie ? (
                                            <img src={workerData?.selfie} alt={workerData?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl sm:text-3xl font-extrabold text-[#0A6E5C]">
                                                {workerData?.name?.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 sm:flex-none">
                                        <p className="font-bold text-gray-900 text-base">{workerData?.name}</p>
                                        <div className="flex items-center gap-1 mt-1 sm:justify-center">
                                            <Star size={12} fill="#FBBF24" color="#FBBF24" />
                                            <span className="text-sm font-bold text-gray-700">{workerData?.rating}</span>
                                            <span className="text-xs text-gray-400">({workerData?.completedJobs} jobs)</span>
                                        </div>

                                        <div className="mt-2 sm:hidden">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Agreed Bid</p>
                                            <p className="text-xl font-extrabold text-gray-900">₹{bid?.amount}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-full mt-3 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agreed Bid</p>
                                    <p className="text-2xl font-extrabold text-gray-900">₹{bid?.amount}</p>
                                </div>

                                <a
                                    href={`tel:${workerData?.phone}`}
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5
                                               border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                                               hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all"
                                >
                                    <Phone size={14} />
                                    Contact Worker
                                </a>
                            </div>

                            {/* Job Checklist */}
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-bold text-gray-900 text-sm">Job Checklist</p>
                                    <span className="text-xs font-bold text-[#0A6E5C]">{pct}% Done</span>
                                </div>

                                <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="h-full bg-[#0A6E5C] rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                <ul className="space-y-2.5">
                                    {checklist.map((item) => (
                                        <li key={item.id} className="flex items-center gap-2.5">
                                            {item.done ? (
                                                <CheckCircle size={16} className="text-[#0A6E5C] shrink-0" />
                                            ) : (
                                                <Circle size={16} className="text-gray-300 shrink-0" />
                                            )}
                                            <span
                                                className={`text-sm ${item.done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}
                                            >
                                                {item.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                                <p className="font-bold text-gray-900 text-sm mb-4">Timeline</p>

                                <div className="space-y-3">
                                    {[
                                        { icon: Clock, label: 'POSTED', value: new Date(mainData?.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) },
                                        { icon: Calendar, label: 'EST. DURATION', value: bid?.eta },
                                        { icon: MapPin, label: 'LOCATION', value: `${mainData?.address?.city}, ${mainData?.address?.state}` },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <Icon size={13} className="text-[#0A6E5C] shrink-0" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {label}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Release Payment Banner ── */}
                        {released ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex items-center gap-4">
                                <CheckCircle size={24} className="text-[#0A6E5C] shrink-0" />
                                <div>
                                    <p className="font-bold text-[#0A6E5C]">Payment Released!</p>
                                    <p className="text-sm text-emerald-700 mt-0.5">
                                        ₹{bid?.amount}.00 has been transferred to {workerData?.name}.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 sm:px-6 py-5
                                            flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1">
                                        Complete Payment &amp; Release Escrow
                                    </h2>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                                        Confirm that the work has been completed to your satisfaction. The funds
                                        will be released to {workerData?.name} immediately after confirmation.
                                    </p>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-2 shrink-0">
                                    <div className="sm:text-right">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                            Amount Held
                                        </p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-gray-900">₹{bid?.amount}.00</p>
                                    </div>

                                    <button
                                        onClick={() => setShowReleaseModal(true)}
                                        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#0A6E5C] text-white
                                                   text-sm font-bold hover:bg-[#085e4e] active:scale-[0.98]
                                                   transition-all duration-150 shadow-md whitespace-nowrap"
                                    >
                                        Release Payment
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>}

                {isLoading && <PageLoader />}
                {isError && <PageError onBack={() => navigate('/poster/my-tasks', { replace: true })} />}
            </div>

            {/* ── Release Modal ── */}
            {showReleaseModal && (
                <ReleaseModal
                    amount={bid?.amount}
                    workerName={workerData?.name}
                    onConfirm={handleRelease}
                    onCancel={() => setShowReleaseModal(false)}
                />
            )}
        </div>
    );
};

export default WorkProgress;
