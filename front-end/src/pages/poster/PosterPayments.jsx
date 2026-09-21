import { useState } from "react";
import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";
import PosterPaymentStatCards from "../../components/Poster/Payments/PosterPaymentStatCards";
import PosterSpendingChart from "../../components/Poster/Payments/PosterSpendingChart";
import PosterTransactionList from "../../components/Poster/Payments/PosterTransactionList";
import PaymentReceiptModal from "../../components/Poster/Payments/PaymentReceiptModal";
import ReleasePaymentConfirmModal from "../../components/Poster/Payments/ReleasePaymentConfirmModal";
import ReferAndEarnCard from "../../components/sharedComponents/Referral/ReferAndEarnCard";
import {
  useGetPosterPaymentOverviewQuery,
  useGetPosterPaymentHistoryQuery,
} from "../../store/services/posterApi";

export default function PosterPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [selectedReceiptTx, setSelectedReceiptTx] = useState(null);
  const [selectedReleaseTx, setSelectedReleaseTx] = useState(null);

  // RTK Query hooks
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useGetPosterPaymentOverviewQuery();

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useGetPosterPaymentHistoryQuery({
    page: currentPage,
    limit: 5,
    search: searchQuery,
    status: statusFilter,
  });

  const stats = overviewData?.data || {};
  const transactions = historyData?.transactions || [];
  const pagination = historyData?.pagination || {};

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleReleaseSuccess = () => {
    refetchOverview();
    refetchHistory();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PosterHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {/* Page Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                  Payment History
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Complete record of all your payments and escrow deposits on Nexaro
                </p>
              </div>
            </div>

            {/* Top 4 Performance Stat Cards */}
            <section aria-label="Poster Payment Summary Stats">
              <PosterPaymentStatCards
                stats={stats}
                isLoading={isOverviewLoading}
              />
            </section>

            {/* Spending Trajectory Chart */}
            <section aria-label="Poster Spending Trajectory">
              <PosterSpendingChart />
            </section>

            {/* Refer and Earn Shared Component */}
            <section aria-label="Refer and Earn Rewards">
              <ReferAndEarnCard role="poster" />
            </section>

            {/* Transaction History & Escrow List */}
            <section aria-label="Transaction and Payment Records">
              <PosterTransactionList
                transactions={transactions}
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                onViewReceipt={(tx) => setSelectedReceiptTx(tx)}
                onReleasePayment={(tx) => setSelectedReleaseTx(tx)}
                isLoading={isHistoryLoading}
              />
            </section>
          </div>
        </main>
      </div>

      {/* Modals */}
      <PaymentReceiptModal
        isOpen={Boolean(selectedReceiptTx)}
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />

      <ReleasePaymentConfirmModal
        isOpen={Boolean(selectedReleaseTx)}
        transaction={selectedReleaseTx}
        onClose={() => setSelectedReleaseTx(null)}
        onReleaseSuccess={handleReleaseSuccess}
      />
    </div>
  );
}
