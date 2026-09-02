import { useState } from "react";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import EarningsHeroCard from "../../components/Worker/Earnings/EarningsHeroCard";
import EarningsStatCards from "../../components/Worker/Earnings/EarningsStatCards";
import EarningsOverviewChart from "../../components/Worker/Earnings/EarningsOverviewChart";
import TransactionHistoryCard from "../../components/Worker/Earnings/TransactionHistoryCard";
import CategoryBreakdownCard from "../../components/Worker/Earnings/CategoryBreakdownCard";
import PayoutMethodsCard from "../../components/Worker/Earnings/PayoutMethodsCard";
import WithdrawModal from "../../components/Worker/Earnings/WithdrawModal";
import AddPayoutMethodModal from "../../components/Worker/Earnings/AddPayoutMethodModal";
import { showSuccess } from "../../utils/toast.js";

export default function WorkerEarnings() {
  // State for balances and data (can be linked to RTK query / backend wallet)
  const [availableBalance, setAvailableBalance] = useState(1200);
  const [thisMonthEarnings] = useState(8400);
  const [completedJobsMonth] = useState(6);
  const [totalEarned, setTotalEarned] = useState(28000);
  const [totalJobs] = useState(34);

  // Payout methods state
  const [payoutMethods, setPayoutMethods] = useState([
    {
      id: "pm-1",
      type: "bank",
      bankName: "State Bank of India",
      accountNumber: "4492",
      holderName: "Alex Carter",
      isPrimary: true,
    },
  ]);

  // Transactions state
  const [transactions, setTransactions] = useState([
    {
      id: "tx-1",
      title: "Kitchen Tap Repair",
      date: "Dec 12, 2024",
      category: "Plumbing",
      amount: 650.0,
      type: "received",
      status: "RECEIVED",
    },
    {
      id: "tx-2",
      title: "Bank Payout",
      date: "Dec 10, 2024",
      category: "Withdrawal",
      amount: 2500.0,
      type: "withdrawn",
      status: "WITHDRAWN",
    },
    {
      id: "tx-3",
      title: "Full Home Wiring",
      date: "Dec 11, 2024",
      category: "Electrical",
      amount: 4200.0,
      type: "pending",
      status: "PENDING",
    },
    {
      id: "tx-4",
      title: "Bedroom Painting",
      date: "Dec 08, 2024",
      category: "Painting",
      amount: 1800.0,
      type: "received",
      status: "RECEIVED",
    },
    {
      id: "tx-5",
      title: "UPI Payout",
      date: "Dec 05, 2024",
      category: "Withdrawal",
      amount: 1000.0,
      type: "withdrawn",
      status: "WITHDRAWN",
    },
  ]);

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAddPayoutOpen, setIsAddPayoutOpen] = useState(false);

  // Handle successful withdrawal
  const handleWithdrawSuccess = (amount) => {
    setAvailableBalance((prev) => Math.max(0, prev - amount));
    const newTx = {
      id: `tx-${Date.now()}`,
      title: "Bank Payout Request",
      date: "Just now",
      category: "Withdrawal",
      amount: amount,
      type: "withdrawn",
      status: "WITHDRAWN",
    };
    setTransactions((prev) => [newTx, ...prev]);
    showSuccess(`Withdrawal of ₹${amount.toLocaleString("en-IN")} initiated successfully!`);
  };

  // Handle successful payout method added
  const handleAddPayoutSuccess = (newMethod) => {
    setPayoutMethods((prev) => {
      if (newMethod.isPrimary) {
        return [
          newMethod,
          ...prev.map((m) => ({ ...m, isPrimary: false })),
        ];
      }
      return [...prev, newMethod];
    });
    showSuccess("Payout method added successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* Worker Navigation Sidebar */}
      <WorkerNavBar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <WorkerHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Page Title & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              Earnings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Your complete earnings overview and payout history
            </p>
          </div>

          {/* 1. AVAILABLE BALANCE HERO CARD */}
          <section aria-label="Available Balance and Summary">
            <EarningsHeroCard
              availableBalance={availableBalance}
              thisMonthEarnings={thisMonthEarnings}
              completedJobsMonth={completedJobsMonth}
              totalEarned={totalEarned}
              totalJobs={totalJobs}
              sinceDate="Nov 2024"
              onWithdrawClick={() => setIsWithdrawOpen(true)}
            />
          </section>

          {/* 2. THREE QUICK STATS CARDS */}
          <section aria-label="Quick Performance Stats">
            <EarningsStatCards
              avgPerJob={824}
              highestPaidJob={3500}
              earnedThisWeek={2100}
            />
          </section>

          {/* 3. EARNINGS OVERVIEW BAR CHART */}
          <section aria-label="Earnings Overview Chart">
            <EarningsOverviewChart />
          </section>

          {/* 4. BOTTOM TWO-COLUMN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Transaction History (8 cols) */}
            <div className="lg:col-span-8 h-full">
              <TransactionHistoryCard transactions={transactions} />
            </div>

            {/* Right: Breakdown by Category & Payout Methods (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <CategoryBreakdownCard />
              <PayoutMethodsCard
                payoutMethods={payoutMethods}
                onAddMethodClick={() => setIsAddPayoutOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        payoutMethods={payoutMethods}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      <AddPayoutMethodModal
        isOpen={isAddPayoutOpen}
        onClose={() => setIsAddPayoutOpen(false)}
        onAddSuccess={handleAddPayoutSuccess}
      />
    </div>
  );
}
