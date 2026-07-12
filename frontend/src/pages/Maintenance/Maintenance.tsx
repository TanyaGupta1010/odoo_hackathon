import React, { useState } from "react";
import { Plus, Wrench, Clock, CheckCircle2, AlertTriangle, User, Play, Check } from "lucide-react";

interface MaintenanceRequest {
  id: number;
  assetTag: string;
  assetName: string;
  issueDescription: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Assigned" | "In_Progress" | "Resolved";
  reporter: string;
  technician?: string;
  photoUrl?: string;
}

const initialRequests: MaintenanceRequest[] = [
  {
    id: 1,
    assetTag: "AF-0062",
    assetName: "Epson Smart Projector",
    issueDescription: "Projector bulb not turning on",
    priority: "High",
    status: "Pending",
    reporter: "Priya Shah",
  },
  {
    id: 2,
    assetTag: "AF-0003",
    assetName: "AC Unit Carrier 1.5 Ton",
    issueDescription: "AC unit noisy compressor",
    priority: "Medium",
    status: "Approved",
    reporter: "Raj Patel",
  },
  {
    id: 3,
    assetTag: "AF-0078",
    assetName: "Toyota Electric Forklift",
    issueDescription: "Forklift battery issues - won't hold charge",
    priority: "Urgent",
    status: "Assigned",
    reporter: "Sana Iqbal",
    technician: "Rohan Mehta",
  },
  {
    id: 4,
    assetTag: "AF-0897",
    assetName: "HP LaserJet Enterprise Printer",
    issueDescription: "Printer Jam - parts ordered",
    priority: "Low",
    status: "In_Progress",
    reporter: "Priya Shah",
    technician: "Rohan Mehta",
  },
  {
    id: 5,
    assetTag: "AF-0873",
    assetName: "Executive Mesh Chair",
    issueDescription: "Chair repair resolved",
    priority: "Low",
    status: "Resolved",
    reporter: "Raj Patel",
    technician: "Rohan Mehta",
  },
];

const COLUMNS: { id: MaintenanceRequest["status"]; label: string; color: string }[] = [
  { id: "Pending", label: "Pending", color: "#F3F4F6" },
  { id: "Approved", label: "Approved", color: "#E0F2FE" },
  { id: "Assigned", label: "Technician Assigned", color: "#FEF3C7" },
  { id: "In_Progress", label: "In Progress", color: "#E0F2FE" },
  { id: "Resolved", label: "Resolved", color: "#DCFCE7" },
];

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // New Request Form State
  const [newAssetTag, setNewAssetTag] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");

  // Move request handler
  const moveRequest = (id: number, nextStatus: MaintenanceRequest["status"]) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          // If moving to Assigned, make sure a tech is present
          const tech = nextStatus === "Assigned" ? "Rohan Mehta" : req.technician;
          return { ...req, status: nextStatus, technician: tech };
        }
        return req;
      })
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTag || !newDescription) return;

    const newReq: MaintenanceRequest = {
      id: Date.now(),
      assetTag: newAssetTag,
      assetName: newAssetName || "Generic Asset",
      issueDescription: newDescription,
      priority: newPriority,
      status: "Pending",
      reporter: "Current User",
    };

    setRequests((prev) => [newReq, ...prev]);
    setNewAssetTag("");
    setNewAssetName("");
    setNewDescription("");
    setNewPriority("Medium");
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === "All" || req.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Maintenance Management</h1>
          <p className="mt-1 text-sm text-[#75808A]">
            Manage asset repair workflows, technicians assignment, and resolution history.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1F6E5A] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#2C8A71]"
        >
          <Plus size={20} />
          Raise Request
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-[#E7ECEF]">
        <input
          type="text"
          placeholder="Search by asset tag, name, or issue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[240px] rounded-xl border border-[#E7ECEF] px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#75808A]">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-[#E7ECEF] bg-white px-3 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-5 overflow-x-auto pb-4 md:grid-cols-5 min-w-[1000px]">
        {COLUMNS.map((col) => {
          const colRequests = filteredRequests.filter((r) => r.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl bg-[#F8FAFB] border border-[#E7ECEF] p-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-[#203030] text-sm">{col.label}</span>
                <span className="rounded-full bg-white border border-[#E7ECEF] px-2 py-0.5 text-xs font-bold text-[#75808A]">
                  {colRequests.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-3">
                {colRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="group relative cursor-pointer rounded-xl border border-[#E7ECEF] bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#1F6E5A]"
                  >
                    {/* Priority badge */}
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${getPriorityColor(
                        req.priority
                      )}`}
                    >
                      {req.priority}
                    </span>

                    <h4 className="font-bold text-[#203030] text-sm group-hover:text-[#1F6E5A]">
                      {req.assetTag}
                    </h4>
                    <p className="text-xs text-[#75808A] font-medium">{req.assetName}</p>
                    <p className="mt-2 text-xs text-[#203030] line-clamp-2">{req.issueDescription}</p>

                    {/* Technician display */}
                    {req.technician && (
                      <div className="mt-3 flex items-center gap-1.5 border-t border-[#F5F7F9] pt-2.5 text-[11px] text-[#75808A]">
                        <User size={12} />
                        <span className="font-medium text-[#203030]">Tech: {req.technician}</span>
                      </div>
                    )}

                    {/* Quick Move Buttons */}
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-[#F5F7F9] pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === "Pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveRequest(req.id, "Approved");
                          }}
                          className="flex items-center gap-1 rounded bg-[#E0F2FE] px-2 py-1 text-[10px] font-bold text-[#0284C7] hover:bg-[#bae6fd]"
                        >
                          <Check size={10} /> Approve
                        </button>
                      )}
                      {req.status === "Approved" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveRequest(req.id, "Assigned");
                          }}
                          className="flex items-center gap-1 rounded bg-[#FEF3C7] px-2 py-1 text-[10px] font-bold text-[#D97706] hover:bg-[#fde68a]"
                        >
                          <User size={10} /> Assign Tech
                        </button>
                      )}
                      {req.status === "Assigned" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveRequest(req.id, "In_Progress");
                          }}
                          className="flex items-center gap-1 rounded bg-[#E0F2FE] px-2 py-1 text-[10px] font-bold text-[#0284C7] hover:bg-[#bae6fd]"
                        >
                          <Play size={10} /> Start Work
                        </button>
                      )}
                      {req.status === "In_Progress" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveRequest(req.id, "Resolved");
                          }}
                          className="flex items-center gap-1 rounded bg-[#DCFCE7] px-2 py-1 text-[10px] font-bold text-[#16A34A] hover:bg-[#bbf7d0]"
                        >
                          <CheckCircle2 size={10} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E7ECEF] py-8 text-center text-xs text-[#75808A]">
                    <Clock size={16} className="mb-1 opacity-40" />
                    No requests
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority} Priority
                </span>
                <h3 className="text-xl font-bold text-[#203030]">{selectedRequest.assetTag}</h3>
                <p className="text-sm text-[#75808A]">{selectedRequest.assetName}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-[#75808A] hover:text-[#203030] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#75808A]">Issue Description</span>
                <p className="mt-1 text-sm text-[#203030] bg-[#F8FAFB] p-3 rounded-xl border border-[#E7ECEF]">
                  {selectedRequest.issueDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75808A]">Status</span>
                  <p className="mt-1 text-sm font-semibold text-[#1F6E5A]">{selectedRequest.status.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75808A]">Reporter</span>
                  <p className="mt-1 text-sm text-[#203030]">{selectedRequest.reporter}</p>
                </div>
              </div>

              {selectedRequest.technician && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75808A]">Assigned Technician</span>
                  <p className="mt-1 text-sm text-[#203030] flex items-center gap-1.5">
                    <User size={14} className="text-[#1F6E5A]" />
                    {selectedRequest.technician}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <button
                  onClick={() => moveRequest(selectedRequest.id, "Approved")}
                  className="rounded-xl bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2C8A71]"
                >
                  Approve Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]">
            <div className="flex items-center justify-between border-b border-[#E7ECEF] pb-4">
              <h3 className="text-lg font-bold text-[#203030]">Raise Maintenance Request</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#75808A] hover:text-[#203030] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#203030]">Asset Tag *</label>
                <input
                  type="text"
                  placeholder="e.g. AF-0062"
                  value={newAssetTag}
                  onChange={(e) => setNewAssetTag(e.target.value)}
                  required
                  className="rounded-xl border border-[#E7ECEF] px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#203030]">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Epson Smart Projector"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="rounded-xl border border-[#E7ECEF] px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#203030]">Issue Description *</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={3}
                  className="rounded-xl border border-[#E7ECEF] px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#203030]">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="rounded-xl border border-[#E7ECEF] bg-white px-3 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2C8A71]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
