import {
  NotebookPen,
  Search,
  BadgeCheck,
  Wallet,
  Zap,
  Check,
  LoaderCircle,
} from "lucide-react";

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

// Workflow progess card
const WorkflowProgressCard = () => {
  return (
    <div className=" hidden lg:block w-full rounded-3xl bg-white/90  p-3 shadow-2xl">
      {/* Progress Bar */}
      <div className="w-full h-2 mb-3 mt-3 rounded-full bg-green-300/40 overflow-hidden">
        <div className="h-full rounded-xl w-1/3 bg-linear-to-r from-green-400 to-emerald-500" />
      </div>

      {/* Text */}
      <p className="text-xs text-[#545860] tracking-[0.02em]">
        Step 1 of 3: Drafting Requirement
      </p>
    </div>
  );
};

// Category search Card
const WorkerSearchCard = () => {
  return (
    <div className=" hidden lg:flex flex-col gap-4 items-center justify-center">
      <div className="rounded-3xl bg-white border border-green-100 p-3 -rotate-4">
        <div className="flex items-center justify-between gap-6">
          <div className="rounded-xl bg-green-100 flex items-center justify-center">
            <Zap className="text-green-600" />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-green-400">
              Category
            </p>

            <h3 className=" font-black text-gray-900 mt-1">Electrical</h3>
          </div>

          <div className="rounded-full bg-green-500 flex items-center justify-center p-2">
            <Check className="text-white stroke-2" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-green-100 p-3 rotate-2">
        <div className="flex items-center gap-5">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <LoaderCircle className="w-3 h-3 text-white animate-spin" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide text-gray-800">
              Finding workers nearby...
            </p>
            <div className="mt-2 h-1 rounded-full bg-green-100 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-linear-to-r from-green-400 to-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//Escrow Card
const EscrowCard = () => {
  return (
    <div className="hidden lg:flex items-center justify-center gap-3 bg-white p-3 px-5 rounded-3xl">
      <div className="p-3 rounded-3xl bg-green-500 text-white">
        <Wallet />
      </div>
      <div>
        <p className="font-semibold">Escrow Payment Released</p>
      </div>
    </div>
  );
};

// Main Content
const Workflow = () => {
  return (
    <div className="bg-green-700/10 pb-10">
      <div className="w-head grid grid-cols-1 sm:grid-cols-3 mb-5 p-10">
        <h2 className="text-5xl col-span-2 mt-3">
          Built for those who value <br />{" "}
          <span className="italic text-[#0a6e5c]">time </span>over everything.
        </h2>
        <p className="text-sm text-gray-900/60 p-10 sm:justify-self-center justify-self-end">
          We’ve re-engineered the marketplace <br /> experience. No endless
          searching, <br />
          no ghosting, just results.
        </p>
      </div>

      <div className="work-flow max-w-6xl mx-auto p-5 bg-green-900/8 rounded-2xl">
        <div className="grid grid-cols-1">
          {flows.map((flow, i) => (
            <div key={i}>
              {flow.side == "left" && (
                <div className="grid grid-cols-3 mt-10 items-center justify-items-center">
                  <div className="ps-5  col-span-3 md:col-span-2 lg:col-span-1">
                    <span
                      className="italic text-transparent"
                      style={{
                        WebkitTextStroke: "1.5px rgba(144, 146, 144, 0.4)",
                      }}
                    >
                      {`${i + 1}`}
                    </span>
                    <h2 className="text-2xl font-bold mb-3 tracking-[0.08em] ">
                      {flow.title}
                    </h2>
                    <p className="text-xs text-[#6b7280]">{flow.description}</p>
                  </div>

                  <div className="hidden lg:block icon-box p-3 rounded-2xl border border-green-700/40 bg-white">
                    {i == 0 && (
                      <NotebookPen
                        strokeWidth={1.5}
                        className="w-7 h-7 text-green-700/60"
                      />
                    )}
                    {i == 2 && (
                      <BadgeCheck className="w-7 h-7 text-green-700/60" />
                    )}
                  </div>
                  {i == 0 && <WorkflowProgressCard />}
                  {i == 2 && <EscrowCard />}
                </div>
              )}

              {flow.side == "right" && (
                <div className="grid grid-cols-3 mt-10 items-center justify-items-center">
                  <div>
                    <WorkerSearchCard />
                  </div>
                  <div className="hidden lg:block icon-box p-3 rounded-2xl border border-green-700/40 bg-white">
                    <Search className="w-7 h-7 text-green-700/60" />
                  </div>
                  <div className="pe-5 col-span-3 md:col-span-2 lg:col-span-1">
                    <span
                      className="italic text-transparent"
                      style={{
                        WebkitTextStroke: "1.5px rgba(144, 146, 144, 0.4)",
                      }}
                    >
                      {`${i + 1}`}
                    </span>
                    <h2 className="text-2xl font-bold mb-3 tracking-[0.08em] ">
                      {flow.title}
                    </h2>
                    <p className="text-xs text-[#6b7280] ">
                      {flow.description}
                    </p>
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
