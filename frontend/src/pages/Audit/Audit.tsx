import React, { useState, useEffect } from "react";
import { ClipboardCheck, AlertTriangle, ShieldCheck, Lock, ArrowLeft, Calendar, UserCheck } from "lucide-react";

import { api } from "../../services/http";

interface AuditItem {
  id: number;
  status: "Pending" | "Verified" | "Missing" | "Damaged";
  notes: string;
  asset: {
    id: number;
    assetTag: string;
    name: string;
    location: string;
  };
}

interface AuditCycle {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Closed";
}

interface DetailedAuditCycle extends AuditCycle {
  auditItems: AuditItem[];
}

const Audit = () => {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<DetailedAuditCycle | null>(null);
  const [loadingCycles, setLoadingCycles] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  // Fetch the list of all audit cycles
  const fetchCycles = async () => {
    try {
      setLoadingCycles(true);
      setError("");
      const res = await api.get(`/audit`);
      if (res.data.success) {
        setCycles(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch audit campaigns from server.");
    } finally {
      setLoadingCycles(false);
    }
  };

  // Load a specific cycle details
  const selectCycle = async (id: number) => {
    try {
      setLoadingDetails(true);
      const res = await api.get(`/audit/${id}`);
      if (res.data.success) {
        setSelectedCycle(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load audit cycle details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleVerify = async (itemId: number, verificationStatus: AuditItem["status"]) => {
    if (!selectedCycle || selectedCycle.status === "Closed") return;

    try {
      const res = await api.patch(`/audit/items/${itemId}`, {
        status: verificationStatus,
      });

      if (res.data.success) {
        setSelectedCycle((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            auditItems: prev.auditItems.map((item) =>
              item.id === itemId ? { ...item, status: verificationStatus } : item
            ),
          };
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update audit item.");
    }
  };

  const handleNotesChange = (itemId: number, notes: string) => {
    if (!selectedCycle || selectedCycle.status === "Closed") return;

    setSelectedCycle((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        auditItems: prev.auditItems.map((item) =>
          item.id === itemId ? { ...item, notes } : item
        ),
      };
    });
  };

  const handleSaveNotes = async (itemId: number, status: AuditItem["status"], notes: string) => {
    try {
      await api.patch(`/audit/items/${itemId}`, {
        status,
        notes,
      });
    } catch (err) {
      console.error("Failed to save notes", err);
    }
  };

  const handleCloseCycle = async () => {
    if (!selectedCycle) return;
    try {
      const res = await api.post(`/audit/cycles/${selectedCycle.id}/close`);
      if (res.data.success) {
        setShowCloseConfirmation(false);
        // Refresh detail views
        await selectCycle(selectedCycle.id);
        await fetchCycles();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to close audit cycle.");
    }
  };

  if (loadingCycles && cycles.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-sm font-semibold text-[#75808A]">
        Loading audit campaigns...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. CAMPAIGNS LIST VIEW (When no cycle is selected) */}
      {!selectedCycle ? (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Asset Audit Campaigns</h1>
            <p className="mt-1 text-sm text-[#75808A]">
              Review audit history or select an active verification campaign to get started.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cycles.map((c) => {
              const isActive = c.status === "Active";
              return (
                <div
                  key={c.id}
                  onClick={() => selectCycle(c.id)}
                  className="group cursor-pointer rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#1F6E5A]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[11px] font-medium text-[#75808A]">
                      {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#203030] group-hover:text-[#1F6E5A] line-clamp-2">
                    {c.title}
                  </h3>

                  <div className="mt-6 flex items-center justify-end text-xs font-bold text-[#1F6E5A] group-hover:underline">
                    Open Campaign →
                  </div>
                </div>
              );
            })}

            {cycles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#E7ECEF] rounded-2xl bg-white">
                <ClipboardCheck size={40} className="text-[#1F6E5A] opacity-35 mb-2" />
                <span className="text-sm font-semibold text-[#75808A]">No campaigns configured</span>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 2. DETAILED CHECKLIST DRILLDOWN VIEW */
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Back button and title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCycle(null)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7ECEF] bg-white text-[#75808A] hover:bg-[#F8FAFB] hover:text-[#203030] shadow-sm transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#203030]">
                {selectedCycle.status === "Closed" ? "Finalized Audit" : "Active Audit Verification"}
              </h1>
              <p className="text-xs text-[#75808A] mt-0.5">
                Go back to campaigns list
              </p>
            </div>
          </div>

          {loadingDetails ? (
            <div className="flex h-[300px] items-center justify-center text-xs font-semibold text-[#75808A]">
              Loading audit details...
            </div>
          ) : (
            <>
              {/* Campaign summary card */}
              <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-[#203030]">{selectedCycle.title}</h3>
                    <div className="mt-2 text-xs text-[#75808A]">
                      Timeline: {new Date(selectedCycle.startDate).toLocaleDateString()} - {new Date(selectedCycle.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedCycle.status === "Active" ? (
                    <button
                      onClick={() => setShowCloseConfirmation(true)}
                      className="rounded-xl bg-[#1F6E5A] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#2C8A71]"
                    >
                      Close Audit Cycle
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      <Lock size={12} /> Finalized & Closed
                    </span>
                  )}
                </div>

                {/* Progress calculation */}
                {(() => {
                  const totalItems = selectedCycle.auditItems.length;
                  const verifiedCount = selectedCycle.auditItems.filter((i) => i.status === "Verified").length;
                  const missingCount = selectedCycle.auditItems.filter((i) => i.status === "Missing").length;
                  const damagedCount = selectedCycle.auditItems.filter((i) => i.status === "Damaged").length;
                  const pendingCount = selectedCycle.auditItems.filter((i) => i.status === "Pending").length;
                  const completedCount = totalItems - pendingCount;
                  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
                  const flaggedCount = missingCount + damagedCount;

                  return (
                    <>
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#203030] mb-2">
                          <span>VERIFICATION PROGRESS</span>
                          <span>
                            {completionPercentage}% ({completedCount}/{totalItems} Checked)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#F5F7F9]">
                          <div
                            className="h-full rounded-full bg-[#1F6E5A] transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {flaggedCount > 0 && selectedCycle.status === "Active" && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
                          <AlertTriangle className="shrink-0 text-red-600" size={20} />
                          <div className="flex-1 text-xs">
                            <span className="font-bold">{flaggedCount} discrepancies flagged</span> — discrepancy report will be generated when closing the cycle ({missingCount} missing, {damagedCount} damaged).
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Table */}
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
                      {selectedCycle.auditItems.map((item) => (
                        <tr key={item.id} className="transition hover:bg-[#F8FAFB]">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#203030]">{item.asset.assetTag}</div>
                            <div className="text-xs text-[#75808A]">{item.asset.name}</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-[#75808A]">
                            {item.asset.location || "Not Specified"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                disabled={selectedCycle.status === "Closed"}
                                onClick={() => handleVerify(item.id, "Verified")}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition border ${
                                  item.status === "Verified"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB] disabled:opacity-50"
                                }`}
                              >
                                Verified
                              </button>
                              <button
                                disabled={selectedCycle.status === "Closed"}
                                onClick={() => handleVerify(item.id, "Missing")}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition border ${
                                  item.status === "Missing"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB] disabled:opacity-50"
                                }`}
                              >
                                Missing
                              </button>
                              <button
                                disabled={selectedCycle.status === "Closed"}
                                onClick={() => handleVerify(item.id, "Damaged")}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition border ${
                                  item.status === "Damaged"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-white text-[#75808A] border-[#E7ECEF] hover:bg-[#F8FAFB] disabled:opacity-50"
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
                              disabled={selectedCycle.status === "Closed"}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              onBlur={(e) => handleSaveNotes(item.id, item.status, e.target.value)}
                              className="w-full rounded-lg border border-[#E7ECEF] bg-white px-3 py-1.5 text-xs text-[#203030] focus:border-[#1F6E5A] disabled:bg-slate-50 disabled:text-[#75808A]"
                            />
                          </td>
                        </tr>
                      ))}
                      {selectedCycle.auditItems.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-xs text-[#75808A]">
                            No assets scoped under this cycle.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showCloseConfirmation && selectedCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]">
            <h3 className="text-lg font-bold text-[#203030]">Close Audit Cycle?</h3>
            <p className="mt-2 text-sm text-[#75808A]">
              Closing the audit cycle is permanent. This will finalize the findings:
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#203030] space-y-1">
              <li>
                Verified: {selectedCycle.auditItems.filter((i) => i.status === "Verified").length} assets
              </li>
              <li>
                Missing: {selectedCycle.auditItems.filter((i) => i.status === "Missing").length} assets (will be updated to 'Lost')
              </li>
              <li>
                Damaged: {selectedCycle.auditItems.filter((i) => i.status === "Damaged").length} assets (will be updated to 'Poor' condition)
              </li>
            </ul>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                onClick={() => setShowCloseConfirmation(false)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseCycle}
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
