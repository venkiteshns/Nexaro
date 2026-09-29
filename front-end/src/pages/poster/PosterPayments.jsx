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
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <PosterHeader />

        <main className="flex-1 md:overflow-y-auto p-3 sm:p-5 lg:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
          <div className="max-w-7xl w-full mx-auto space-y-3 sm:space-y-3.5">
            {/* Page Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">
                  Payment History
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
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
