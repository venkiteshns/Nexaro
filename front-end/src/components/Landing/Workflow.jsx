import {
  NotebookPen,
  Search,
  BadgeCheck,
  Wallet,
  Zap,
  Check,
  LoaderCircle,
} from "lucide-react";
import "./Landing.css";

const flows = [
  {
    title: "Define Your Mission",
    description:
      "Tell us what you need with precision. We help you find the highest-rated experts.",
    side: "left",
  },
  {
    title: "Instant Match-Making",
    description:
      "Your request is broadcast to verified professionals within a 10KM radius. Watch bids arrive in real-time with comprehensive profiles.",
    side: "right",
  },
  {
    title: "Execute & Secure",
    description:
      "Choose your expert and lock in the rate. Payment is held in escrow and only released when you are 100% satisfied with the craftsmanship.",
    side: "left",
  },
];

/* ── Workflow Progress Card ── */
const WorkflowProgressCard = () => (
  <div className="hidden lg:block w-full rounded-2xl bg-white p-4 shadow-lg border border-green-100">
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs font-semibold text-green-700 tracking-wide uppercase">
        Mission Intake
      </p>
      <span className="text-xs text-gray-400">Step 1/3</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-green-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: "33%",
          background: "linear-gradient(90deg, #0a6e5c, #10b981)",
        }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-2 tracking-wide">
      Drafting Requirement…
    </p>
  </div>
);

/* ── Category Search Card ── */
const WorkerSearchCard = () => (
  <div className="hidden lg:flex flex-col gap-4 items-center justify-center">
    <div className="rounded-2xl bg-white border border-green-100 p-4 -rotate-4 shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <div className="rounded-xl bg-green-50 p-2 flex items-center justify-center">
          <Zap className="text-green-600 w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-green-500">
            Category
          </p>
          <h3 className="font-black text-gray-900 mt-0.5 text-base">
            Electrical
          </h3>
        </div>
        <div className="rounded-full flex items-center justify-center p-2"
          style={{ background: "linear-gradient(135deg,#0a6e5c,#10b981)" }}
        >
          <Check className="text-white stroke-2 w-4 h-4" />
        </div>
      </div>
    </div>

    <div className="rounded-2xl bg-white border border-green-100 p-4 rotate-2 shadow-lg">
      <div className="flex items-center gap-4">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#0a6e5c,#10b981)" }}
        >
          <LoaderCircle className="w-3.5 h-3.5 text-white animate-spin" />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-800">
            Finding workers nearby…
          </p>
          <div className="mt-2 h-1 rounded-full bg-green-100 overflow-hidden w-32">
            <div
              className="h-full rounded-full"
              style={{
                width: "66%",
                background: "linear-gradient(90deg,#0a6e5c,#10b981)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Escrow Card ── */
const EscrowCard = () => (
  <div className="hidden lg:flex items-center justify-center gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-lg border border-green-100">
    <div
      className="p-2.5 rounded-xl text-white"
      style={{ background: "linear-gradient(135deg,#0a6e5c,#10b981)" }}
    >
      <Wallet className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-green-600 font-bold tracking-widest uppercase mb-0.5">
        Secured
      </p>
      <p className="font-semibold text-gray-800 text-sm">
        Escrow Payment Released
      </p>
    </div>
  </div>
);

/* ── Main Workflow Component ── */
const Workflow = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f0fdf8 40%, #ecfdf5 100%)",
      }}
      className="pb-12"
    >
      {/* Section heading */}
      <div className="w-head grid grid-cols-1 sm:grid-cols-3 mb-5 p-10 pt-14">
        <h2 className="text-5xl col-span-2 mt-3">
          Built for those who value <br />
          <span className="italic" style={{ color: "#0a6e5c" }}>
            time{" "}
          </span>
          over everything.
        </h2>
        <p className="text-sm p-10 sm:justify-self-center justify-self-end">
          We've re-engineered the marketplace <br /> experience. No endless
          searching, <br />
          no ghosting, just results.
        </p>
      </div>

      {/* Flow steps */}
      <div
        className="work-flow max-w-6xl mx-auto p-6 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(10,110,92,0.1)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 40px rgba(10,110,92,0.06)",
        }}
      >
        <div className="grid grid-cols-1">
          {flows.map((flow, i) => (
            <div key={i}>
              {flow.side === "left" && (
                <div className="grid grid-cols-3 mt-10 items-center justify-items-center">
                  <div className="ps-5 col-span-3 md:col-span-2 lg:col-span-1">
                    <span className="flow-step-num">{`${i + 1}`}</span>
                    <h2 className="flow-title mb-3">{flow.title}</h2>
                    <p className="flow-desc">{flow.description}</p>
                  </div>

                  <div className="hidden lg:block icon-box p-3 rounded-2xl">
                    {i === 0 && (
                      <NotebookPen
                        strokeWidth={1.5}
                        className="w-7 h-7 text-green-700/70"
                      />
                    )}
                    {i === 2 && (
                      <BadgeCheck className="w-7 h-7 text-green-700/70" />
                    )}
                  </div>

                  {i === 0 && <WorkflowProgressCard />}
                  {i === 2 && <EscrowCard />}
                </div>
              )}

              {flow.side === "right" && (
                <div className="grid grid-cols-3 mt-10 items-center justify-items-center">
                  <div>
                    <WorkerSearchCard />
                  </div>
                  <div className="hidden lg:block icon-box p-3 rounded-2xl">
                    <Search className="w-7 h-7 text-green-700/70" />
                  </div>
                  <div className="pe-5 col-span-3 md:col-span-2 lg:col-span-1">
                    <span className="flow-step-num">{`${i + 1}`}</span>
                    <h2 className="flow-title mb-3">{flow.title}</h2>
                    <p className="flow-desc">{flow.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
