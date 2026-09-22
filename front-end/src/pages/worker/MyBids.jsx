import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import PaginationSections from "../../components/sharedComponents/PaginationSections";

import BidStatsSection from "../../components/Worker/MyBids/BidStatsSection";
import BidFilterTabs from "../../components/Worker/MyBids/BidFilterTabs";
import BidCard from "../../components/Worker/MyBids/BidCard";
import BidEmptyState from "../../components/Worker/MyBids/BidEmptyState";

import { useGetWorkerBidsQuery } from "../../store/services/workerApi";

const LIMIT = 5;

const MyBids = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, isError } = useGetWorkerBidsQuery({
        status: activeTab,
        page,
        limit: LIMIT,
    });

    const bids = data?.bids || [];
    const pagination = data?.pagination || {};
    const counts = data?.counts || { all: 0, pending: 0, accepted: 0, rejected: 0 };
    const total = pagination.total ?? 0;
    const totalPages = pagination.totalPages ?? 1;

    const winRate = counts.all > 0
        ? Math.round((counts.accepted / counts.all) * 100)
        : 0;

    const handleTabChange = (key) => {
        setActiveTab(key);
        setPage(1);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
                    <div className="mb-3.5">
                        <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">My Bids</h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Track all your placed bids and their current status.
                        </p>
                    </div>

                    <BidStatsSection counts={counts} winRate={winRate} />

                    <BidFilterTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        total={total}
                    />

                    {(isLoading || isFetching) && (
                        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm">Loading your bids...</span>
                        </div>
                    )}

                    {isError && !isFetching && (
                        <div className="flex items-center justify-center py-16 gap-2 text-red-500 text-sm">
                            <AlertCircle size={18} />
                            Could not load bids. Please try again.
                        </div>
                    )}

                    {!isLoading && !isFetching && !isError && bids.length === 0 && (
                        <BidEmptyState activeTab={activeTab} />
                    )}

                    {!isLoading && !isFetching && !isError && bids.length > 0 && (
                        <>
                            <div className="space-y-3">
                                {bids.map((bid) => (
                                    <BidCard key={bid._id} bid={bid} />
                                ))}
                            </div>

                            <div className="mt-4 text-center text-xs text-gray-400">
                                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} bids
                            </div>

                            <PaginationSections
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBids;
