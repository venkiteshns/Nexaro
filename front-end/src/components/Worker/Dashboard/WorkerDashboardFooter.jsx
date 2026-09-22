const WorkerDashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-6 pt-4 pb-6 border-t border-gray-200/80 text-center">
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-widest text-[#0A6E5C]">
            NEXARO
          </span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium">
          © {currentYear} NEXARO Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default WorkerDashboardFooter;
