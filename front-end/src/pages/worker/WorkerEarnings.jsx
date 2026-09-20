import { useState } from "react";
import { useSelector } from "react-redux";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import EarningsHeroCard from "../../components/Worker/Earnings/EarningsHeroCard";
import EarningsStatCards from "../../components/Worker/Earnings/EarningsStatCards";
import TransactionHistoryCard from "../../components/Worker/Earnings/TransactionHistoryCard";
import WithdrawModal from "../../components/Worker/Earnings/WithdrawModal";
import { useGetEarningHeroDataQuery } from "../../store/services/workerApi.js";
import { EarningsChart } from "../../components/Worker/Earnings/EarningsChart.jsx";
import ReferAndEarnCard from "../../components/sharedComponents/Referral/ReferAndEarnCard.jsx";

export default function WorkerEarnings() {
  const { user } = useSelector((state) => state.auth);



  const { data, isLoading, isError, isSuccess } = useGetEarningHeroDataQuery();

  console.log("is Loading", isLoading);
  console.log("Data : ", data);
  const availableBalance = data?.earningsData?.walletAmount;
  const totalEarned = data?.earningsData?.totalEarned;
  const totalJobs = data?.earningsData?.completedTasks;
  const highestPaidAmount = data?.earningsData?.highestPaidAmount;
  const earnedLast7Days = data?.earningsData?.earnedLast7Days;
  const averageAmount = data?.earningsData?.averageAmount;
  const sinceDate = data?.earningsData?.sinceDate;
  console.log("is Success", isSuccess);
  console.log("is Error", isError);

  const [transactions] = useState();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleWithdrawSuccess = () => {
    setIsWithdrawOpen(false);
  };


  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <WorkerHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Earnings
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your complete earnings overview and payout history
              </p>
            </div>

            <section aria-label="Available Balance and Summary">
              <EarningsHeroCard
                availableBalance={availableBalance}
                totalEarned={totalEarned}
                totalJobs={totalJobs}
                sinceDate={sinceDate}
                onWithdrawClick={() => setIsWithdrawOpen(true)}
              />
            </section>

            <section aria-label="Quick Performance Stats">
              <EarningsStatCards
                avgPerJob={averageAmount}
                highestPaidJob={highestPaidAmount}
                earnedThisWeek={earnedLast7Days}
              />
            </section>

            <section aria-label="Refer and Earn Rewards">
              <ReferAndEarnCard role="worker" />
            </section>

            <section aria-label="Earnings  Chart">
              <EarningsChart />
            </section>

            <section aria-label="Transaction History">
              <TransactionHistoryCard transactions={transactions} />
            </section>
          </div>
        </main>
      </div>

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance || 0}
        workerEmail={user?.email || ""}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
    </div>
  );
}
