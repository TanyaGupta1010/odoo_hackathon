import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Wrench, Clock, CheckCircle2, AlertTriangle, User, Play, Check } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

interface Asset {
  id: number;
  assetTag: string;
  name: string;
  status: string;
}

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface MaintenanceRequest {
  id: number;
  assetId: number;
  issueDescription: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Assigned" | "In_Progress" | "Resolved";
  photoUrl?: string;
  reporterId?: number;
  technicianId?: number;
  asset: {
    id: number;
    assetTag: string;
    name: string;
  };
  reporter?: {
    id: number;
    name: string;
  };
  technician?: {
    id: number;
    name: string;
  };
}

const COLUMNS: { id: MaintenanceRequest["status"]; label: string; color: string }[] = [
  { id: "Pending", label: "Pending", color: "#F3F4F6" },
  { id: "Approved", label: "Approved", color: "#E0F2FE" },
  { id: "Assigned", label: "Technician Assigned", color: "#FEF3C7" },
  { id: "In_Progress", label: "In Progress", color: "#E0F2FE" },
  { id: "Resolved", label: "Resolved", color: "#DCFCE7" },
];

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Request Form State
  const [selectedAssetId, setSelectedAssetId] = useState<number | "">("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  // Fetch all data from APIs
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [maintenanceRes, assetsRes, employeesRes] = await Promise.all([
        axios.get(`${API_BASE}/maintenance`),
        axios.get(`${API_BASE}/assets`),
        axios.get(`${API_BASE}/employees`),
      ]);

      if (maintenanceRes.data.success) {
        setRequests(maintenanceRes.data.data);
      }
      if (assetsRes.data.success) {
        // Only allow raising maintenance requests for assets
        setAssets(assetsRes.data.data);
      }
      if (employeesRes.data.success) {
        setEmployees(employeesRes.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data from backend server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update request status or technician
  const handleUpdateReq = async (id: number, updates: Partial<MaintenanceRequest>) => {
    try {
      const res = await axios.patch(`${API_BASE}/maintenance/${id}`, updates);
      if (res.data.success) {
        // Refresh requests board
        await fetchData();
        // Update details modal if it's currently open
        if (selectedRequest?.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, ...res.data.data } : null));
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update maintenance request.");
    }
  };

  // Submit new request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !newDescription) return;

    try {
      const res = await axios.post(`${API_BASE}/maintenance`, {
        assetId: Number(selectedAssetId),
        issueDescription: newDescription,
        priority: newPriority,
        photoUrl: newPhotoUrl || undefined,
        reporterId: employees[0]?.id || 1, // Defaulting to first mock employee or 1
      });

      if (res.data.success) {
        await fetchData();
        setSelectedAssetId("");
        setNewDescription("");
        setNewPriority("Medium");
        setNewPhotoUrl("");
        setIsModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit request.");
    }
  };

  const filteredRequests = requests.filter((req) => {
    const assetTag = req.asset?.assetTag || "";
    const assetName = req.asset?.name || "";
    const matchesSearch =
      assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (loading && requests.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-sm font-semibold text-[#75808A]">
        Loading maintenance board...
      </div>
    );
  }

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

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

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
                      {req.asset?.assetTag || `Asset #${req.assetId}`}
                    </h4>
                    <p className="text-xs text-[#75808A] font-medium">{req.asset?.name}</p>
                    <p className="mt-2 text-xs text-[#203030] line-clamp-2">{req.issueDescription}</p>

                    {/* Technician display */}
                    {req.technician && (
                      <div className="mt-3 flex items-center gap-1.5 border-t border-[#F5F7F9] pt-2.5 text-[11px] text-[#75808A]">
                        <User size={12} />
                        <span className="font-medium text-[#203030]">Tech: {req.technician.name}</span>
                      </div>
                    )}

                    {/* Quick Move Buttons */}
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-[#F5F7F9] pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === "Pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateReq(req.id, { status: "Approved" });
                          }}
                          className="flex items-center gap-1 rounded bg-[#E0F2FE] px-2 py-1 text-[10px] font-bold text-[#0284C7] hover:bg-[#bae6fd]"
                        >
                          <Check size={10} /> Approve
                        </button>
                      )}
                      {req.status === "Approved" && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5"
                        >
                          <select
                            onChange={(e) => {
                              const techId = Number(e.target.value);
                              if (techId) {
                                handleUpdateReq(req.id, { status: "Assigned", technicianId: techId });
                              }
                            }}
                            defaultValue=""
                            className="rounded border border-[#E7ECEF] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#203030]"
                          >
                            <option value="" disabled>Assign Tech</option>
                            {employees
                              .filter((emp) => emp.role === "Employee")
                              .map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                          </select>
                        </div>
                      )}
                      {req.status === "Assigned" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateReq(req.id, { status: "In_Progress" });
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
                            handleUpdateReq(req.id, { status: "Resolved" });
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
                <h3 className="text-xl font-bold text-[#203030]">{selectedRequest.asset?.assetTag || `Asset #${selectedRequest.assetId}`}</h3>
                <p className="text-sm text-[#75808A]">{selectedRequest.asset?.name}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-[#75808A] hover:text-[#203030] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {selectedRequest.photoUrl && (
                <div className="w-full overflow-hidden rounded-xl border border-[#E7ECEF] max-h-[180px]">
                  <img
                    src={selectedRequest.photoUrl}
                    alt="Asset issue detail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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
                  <p className="mt-1 text-sm text-[#203030]">{selectedRequest.reporter?.name || "System"}</p>
                </div>
              </div>

              {selectedRequest.technician && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#75808A]">Assigned Technician</span>
                  <p className="mt-1 text-sm text-[#203030] flex items-center gap-1.5">
                    <User size={14} className="text-[#1F6E5A]" />
                    {selectedRequest.technician.name}
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
                  onClick={() => {
                    handleUpdateReq(selectedRequest.id, { status: "Approved" });
                    setSelectedRequest(null);
                  }}
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
                <label className="text-xs font-semibold text-[#203030]">Select Asset *</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                  required
                  className="rounded-xl border border-[#E7ECEF] bg-white px-3 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="" disabled>-- Select an Asset --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.assetTag}] {asset.name}
                    </option>
                  ))}
                </select>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#203030]">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="rounded-xl border border-[#E7ECEF] px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
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
