import React, { useState } from "react";
import { ClipboardCheck, AlertTriangle, ShieldCheck, HelpCircle, XCircle } from "lucide-react";

interface AuditItem {
  id: number;
  assetTag: string;
  name: string;
  expectedLocation: string;
  verification: "Pending" | "Verified" | "Missing" | "Damaged";
  notes: string;
}

const initialAuditItems: AuditItem[] = [
  {
    id: 1,
    assetTag: "AF-0114",
    name: "Dell Latitude 5420 Laptop",
    expectedLocation: "Desk E12",
    verification: "Verified",
    notes: "Verified at workstation",
  },
  {
    id: 2,
    assetTag: "AF-9921",
    name: "Standard Office Chair",
    expectedLocation: "Desk E14",
    verification: "Missing",
    notes: "Not found at assigned desk",
  },
  {
    id: 3,
    assetTag: "AF-9838",
    name: "Dell 27-inch 4K Monitor",
    expectedLocation: "Desk E15",
    verification: "Damaged",
    notes: "Screen has a severe crack",
  },
  {
    id: 4,
    assetTag: "AF-0301",
    name: "Ergonomic Office Chair",
    expectedLocation: "Warehouse A",
    verification: "Pending",
    notes: "",
  },
];

const Audit = () => {
  const [items, setItems] = useState<AuditItem[]>(initialAuditItems);
  const [isClosed, setIsClosed] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  // Statistics
  const totalItems = items.length;
  const verifiedCount = items.filter((i) => i.verification === "Verified").length;
  const missingCount = items.filter((i) => i.verification === "Missing").length;
  const damagedCount = items.filter((i) => i.verification === "Damaged").length;
  const pendingCount = items.filter((i) => i.verification === "Pending").length;
  const completedCount = totalItems - pendingCount;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  const flaggedCount = missingCount + damagedCount;

  const handleVerify = (id: number, status: AuditItem["verification"]) => {
    if (isClosed) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, verification: status };
        }
        return item;
      })
    );
  };

  const handleNotesChange = (id: number, notes: string) => {
    if (isClosed) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, notes };
        }
        return item;
      })
    );
  };

  const closeAuditCycle = () => {
    setIsClosed(true);
    setShowCloseConfirmation(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Asset Audit Cycle</h1>
          <p className="mt-1 text-sm text-[#75808A]">
            Verify physical location and condition of registered assets.
          </p>
        </div>
        {!isClosed ? (
          <button
            onClick={() => setShowCloseConfirmation(true)}
            className="rounded-xl bg-[#1F6E5A] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#2C8A71]"
          >
            Close Audit Cycle
          </button>
        ) : (
          <span className="rounded-xl bg-slate-100 border border-[#E7ECEF] px-5 py-3 text-sm font-bold text-[#75808A]">
            Audit Cycle Closed
          </span>
        )}
      </div>

      {/* Audit Scope Card */}
      <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#203030]">Q3 audit: Engineering dept - 1-15 jul</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm text-[#75808A]">
          <div>
            <span className="font-semibold text-[#203030]">Auditors: </span>
            Aditi Rao, Sana Iqbal
          </div>
          <div>
            <span className="font-semibold text-[#203030]">Target Scope: </span>
            Engineering Department Assets
          </div>
          <div>
            <span className="font-semibold text-[#203030]">Timeline: </span>
            Jul 1, 2026 - Jul 15, 2026
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#203030] mb-2">
            <span>AUDIT PROGRESS</span>
            <span>{completionPercentage}% ({completedCount}/{totalItems} Assets)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#F5F7F9]">
            <div
              className="h-full rounded-full bg-[#1F6E5A] transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Discrepancy Banner */}
      {flaggedCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-800">
          <AlertTriangle className="shrink-0 text-red-600" size={24} />
          <div className="flex-1 text-sm">
            <span className="font-bold">{flaggedCount} assets flagged</span> — discrepancy report has been generated automatically with {missingCount} missing and {damagedCount} damaged items.
          </div>
        </div>
      )}

      {/* Checklist Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E7ECEF] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#203030]">
            <thead className="bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#75808A] border-b border-[#E7ECEF]">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Expected Location</th>
                <th className="px-6 py-4">Verification State</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7ECEF]">
              {items.map((item) => (
                <tr key={item.id} className="transition hover:bg-[#F8FAFB]">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#203030]">{item.assetTag}</div>
                    <div className="text-xs text-[#75808A]">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#75808A]">
                    {item.expectedLocation}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isClosed}
                        onClick={() => handleVerify(item.id, "Verified")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                          item.verification === "Verified"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB]"
                        }`}
                      >
                        Verified
                      </button>
                      <button
                        disabled={isClosed}
                        onClick={() => handleVerify(item.id, "Missing")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                          item.verification === "Missing"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB]"
                        }`}
                      >
                        Missing
                      </button>
                      <button
                        disabled={isClosed}
                        onClick={() => handleVerify(item.id, "Damaged")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                          item.verification === "Damaged"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB]"
                        }`}
                      >
                        Damaged
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Add comments/notes..."
                      value={item.notes}
                      disabled={isClosed}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      className="w-full rounded-lg border border-[#E7ECEF] bg-white px-3 py-1.5 text-xs text-[#203030] focus:border-[#1F6E5A] disabled:bg-slate-50 disabled:text-[#75808A]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCloseConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]">
            <h3 className="text-lg font-bold text-[#203030]">Close Audit Cycle?</h3>
            <p className="mt-2 text-sm text-[#75808A]">
              Closing the audit cycle is permanent. This will finalize the findings:
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#203030] space-y-1">
              <li>Verified: {verifiedCount} assets</li>
              <li>Missing: {missingCount} assets (will be updated to 'Lost')</li>
              <li>Damaged: {damagedCount} assets (will be updated to 'Poor' condition)</li>
              {pendingCount > 0 && (
                <li className="text-amber-600 font-medium">Pending: {pendingCount} assets (will remain unmodified)</li>
              )}
            </ul>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                onClick={() => setShowCloseConfirmation(false)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Cancel
              </button>
              <button
                onClick={closeAuditCycle}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, Close Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
