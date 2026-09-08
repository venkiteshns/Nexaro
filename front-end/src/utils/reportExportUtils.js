/**
 * Nexaro Financial Report Export Utilities
 * Generates branded PDF print views and CSV downloads in the Nexaro green & white theme.
 */

/**
 * Downloads a string content as a file (CSV, JSON, etc.)
 */
export function downloadFile(content, fileName, mimeType = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a dedicated branded print-to-PDF window with Nexaro styling
 */
export function openPrintWindow(title, htmlContent) {
  const printWindow = window.open("", "_blank", "width=900,height=800");
  if (!printWindow) {
    alert("Please allow popups to download/print the PDF report.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - Nexaro Financials</title>
      <style>
        @page {
          size: A4;
          margin: 18mm 15mm 20mm 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          background-color: #ffffff;
          color: #111827;
          padding: 24px;
          font-size: 13px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0A6E5C;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-title {
          font-size: 22px;
          font-weight: 800;
          color: #0A6E5C;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B7280;
        }
        .report-meta {
          text-align: right;
          font-size: 11px;
          color: #4B5563;
        }
        .report-meta strong {
          color: #111827;
        }
        .title-section {
          margin-bottom: 24px;
        }
        .title-section h1 {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 4px;
        }
        .title-section p {
          color: #6B7280;
          font-size: 12px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .kpi-card {
          background: #F6FAF8;
          border: 1px solid #D1FAE5;
          border-radius: 10px;
          padding: 14px 16px;
        }
        .kpi-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #047857;
          margin-bottom: 4px;
        }
        .kpi-val {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
        }
        .kpi-sub {
          font-size: 10px;
          color: #6B7280;
          margin-top: 2px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          margin-bottom: 28px;
          font-size: 12px;
        }
        thead th {
          background: #F8FBFA;
          color: #4B5563;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          padding: 10px 14px;
          border-bottom: 1px solid #E5E7EB;
        }
        tbody td {
          padding: 10px 14px;
          border-bottom: 1px solid #F3F4F6;
          color: #1F2937;
        }
        tbody tr:nth-child(even) {
          background-color: #FAFCFB;
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          background: #ECFDF5;
          color: #047857;
          border: 1px solid #A7F3D0;
        }
        .footer {
          margin-top: 36px;
          border-top: 1px solid #E5E7EB;
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #9CA3AF;
        }
        .footer-sig {
          text-align: right;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <div>
            <div class="brand-title">NEXARO</div>
            <div class="brand-sub">Platform Financial Services</div>
          </div>
        </div>
        <div class="report-meta">
          <div><strong>Report:</strong> ${title}</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</div>
          <div><strong>Status:</strong> Official Audit Copy</div>
        </div>
      </div>

      ${htmlContent}

      <div class="footer">
        <div>Confidential & Proprietary • Nexaro Inc. Governance & Auditing</div>
        <div class="footer-sig">Authorized by Nexaro Financial Controller</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * 1. Export Daily Revenue Report PDF
 */
export function exportDailyRevenueReportPDF(reportData) {
  const summary = reportData?.summary || {};
  const dateLabel = reportData?.dateLabel || new Date().toDateString();
  const transactions = reportData?.transactions || [];

  const html = `
    <div class="title-section">
      <h1>Daily Revenue Report</h1>
      <p>Aggregated real-time revenue stream including transaction fees, GMV, and worker payouts for <strong>${dateLabel}</strong>.</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Total GMV (Gross Volume)</div>
        <div class="kpi-val">${summary.formattedGmv || `₹${(summary.totalGmv || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">${summary.completedEscrowCount || 0} completed bookings</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Platform Net Revenue</div>
        <div class="kpi-val">${summary.formattedRevenue || `₹${(summary.netRevenue || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">Standard platform commission</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Worker Payouts</div>
        <div class="kpi-val">${summary.formattedPayouts || `₹${(summary.totalWorkerPayouts || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">Disbursed to service providers</div>
      </div>
    </div>

    <h3 style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 8px;">Transactions Recorded Today</h3>
    <table>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${
          transactions.length > 0
            ? transactions
                .map(
                  (tx) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600; color: #0A6E5C;">${tx.id}</td>
                <td>${tx.type || "Service Booking"}</td>
                <td style="font-weight: 700;">₹${(tx.amount || 0).toLocaleString("en-IN")}</td>
                <td><span class="badge">${(tx.status || "COMPLETED").toUpperCase()}</span></td>
                <td style="color: #6B7280;">${tx.time || "Today"}</td>
              </tr>
            `
                )
                .join("")
            : `
            <tr>
              <td colspan="5" style="text-align: center; color: #9CA3AF; padding: 24px;">
                No transactions recorded today yet.
              </td>
            </tr>
          `
        }
      </tbody>
    </table>
  `;

  openPrintWindow("Daily Revenue Report", html);
}

/**
 * 2. Export Monthly P&L Statement PDF
 */
export function exportMonthlyPlStatementPDF(reportData) {
  const metrics = reportData?.metrics || {};
  const monthName = reportData?.monthName || "Selected Period";

  const html = `
    <div class="title-section">
      <h1>Monthly Profit & Loss (P&L) Statement</h1>
      <p>Comprehensive profit and loss breakdown for <strong>${monthName}</strong>.</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Gross Merchandise Value (GMV)</div>
        <div class="kpi-val">${metrics.formattedGmv || `₹${(metrics.grossVolume || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">Total platform transaction volume</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Worker Payouts (COGS)</div>
        <div class="kpi-val">${metrics.formattedPayouts || `₹${(metrics.workerPayouts || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">Disbursed service labor</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Net Platform Margin</div>
        <div class="kpi-val" style="color: #0A6E5C;">${metrics.formattedNetProfit || `₹${(metrics.netProfit || 0).toLocaleString("en-IN")}`}</div>
        <div class="kpi-sub">${metrics.profitMargin || "5.0%"} operating margin</div>
      </div>
    </div>

    <h3 style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 8px;">Fiscal Breakdown Summary</h3>
    <table>
      <thead>
        <tr>
          <th>Statement Line Item</th>
          <th>Type</th>
          <th>Fiscal Value</th>
          <th>% of Gross</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 600;">Gross Bookings (Total GMV)</td>
          <td>Revenue</td>
          <td style="font-weight: 700;">${metrics.formattedGmv || "₹0"}</td>
          <td>100.0%</td>
        </tr>
        <tr>
          <td>Worker Earnings & Disbursals</td>
          <td style="color: #DC2626;">Payouts</td>
          <td style="font-weight: 700;">${metrics.formattedPayouts || "₹0"}</td>
          <td>95.0%</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Platform Retained Commission</td>
          <td style="color: #047857;">Gross Profit</td>
          <td style="font-weight: 700; color: #047857;">${metrics.formattedCommission || "₹0"}</td>
          <td>${metrics.profitMargin || "5.0%"}</td>
        </tr>
        <tr style="background: #F6FAF8; font-weight: 800;">
          <td style="color: #0A6E5C;">Net Operating Margin</td>
          <td style="color: #0A6E5C;">Net Profit</td>
          <td style="color: #0A6E5C;">${metrics.formattedNetProfit || "₹0"}</td>
          <td style="color: #0A6E5C;">${metrics.profitMargin || "5.0%"}</td>
        </tr>
      </tbody>
    </table>
  `;

  openPrintWindow(`P&L Statement - ${monthName}`, html);
}

/**
 * 3. Export Platform Fee Summary PDF
 */
export function exportPlatformFeeSummaryPDF(reportData) {
  const fiscalYear = reportData?.fiscalYear || "Current Fiscal Year";
  const formattedAmount = reportData?.formattedAmount || "₹1.42M";
  const commissionRate = reportData?.commissionRate || "5%";
  const totalGmv = reportData?.totalGmv ? `₹${reportData.totalGmv.toLocaleString("en-IN")}` : "₹28.4M";

  const html = `
    <div class="title-section">
      <h1>Platform Commission Fee Summary</h1>
      <p>Aggregated audit summary of platform retained commission fees for <strong>${fiscalYear}</strong>.</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Fiscal Year PTD Net Earnings</div>
        <div class="kpi-val" style="color: #0A6E5C;">${formattedAmount}</div>
        <div class="kpi-sub">Period-to-date commission earnings</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Platform Take Rate</div>
        <div class="kpi-val">${commissionRate}</div>
        <div class="kpi-sub">Standard across service categories</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Gross Handled Bookings (PTD)</div>
        <div class="kpi-val">${totalGmv}</div>
        <div class="kpi-sub">${reportData?.totalTransactions || 0} completed transactions</div>
      </div>
    </div>

    <h3 style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 8px;">Commission Governance Notes</h3>
    <div style="background: #F8FBFA; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 12px; color: #4B5563; line-height: 1.6;">
      <p>• All commission revenues are automatically credited to the platform treasury upon successful order escrow settlement.</p>
      <p>• Payouts to skilled service providers are calculated post-commission retention.</p>
      <p>• Tax liabilities and withholding tax are governed in compliance with state auditing standards.</p>
    </div>
  `;

  openPrintWindow(`Platform Fee Summary - ${fiscalYear}`, html);
}

/**
 * Export CSV format helper
 */
export function exportDailyRevenueCSV(reportData) {
  const summary = reportData?.summary || {};
  const transactions = reportData?.transactions || [];

  const headers = ["Transaction ID", "Type", "Amount", "Status", "Time"];
  const rows = transactions.map((t) => [
    t.id,
    `"${t.type || "Booking"}"`,
    t.amount,
    t.status,
    `"${t.time || ""}"`,
  ]);

  const summaryHeader = ["Summary Metric", "Value"];
  const summaryRows = [
    ["Total GMV", summary.totalGmv || 0],
    ["Platform Revenue", summary.netRevenue || 0],
    ["Worker Payouts", summary.totalWorkerPayouts || 0],
    ["Transactions Count", summary.totalTransactionsToday || 0],
  ];

  const csv = [
    "--- DAILY REVENUE SUMMARY ---",
    summaryHeader.join(","),
    ...summaryRows.map((r) => r.join(",")),
    "",
    "--- TRANSACTIONS LOG ---",
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  downloadFile(csv, `daily_revenue_${new Date().toISOString().slice(0, 10)}.csv`);
}
