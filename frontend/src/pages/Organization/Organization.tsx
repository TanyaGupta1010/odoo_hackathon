import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Pencil,
  User,
  Plus,
  ArrowRight,
  X,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import { employeeService } from "../../services/employee.service";
import type { Employee } from "../../services/employee.service";

type Status = "Active" | "Inactive";
type Department = { name: string; head: string; parent: string; status: Status };

const initialDepartments: Department[] = [
  { name: "Engineering", head: "Aditi Rao", parent: "—", status: "Active" },
  { name: "Facilities", head: "Rohan Mehta", parent: "—", status: "Active" },
  { name: "Field Ops (East)", head: "Sana Iqbal", parent: "Field Ops", status: "Inactive" },
];

const tabs = ["Departments", "Categories", "Employee"] as const;
type Tab = (typeof tabs)[number];

const tools = [
  {
    icon: ClipboardList,
    title: "Audit Logs",
    body: "Review history of changes made to organization units and heads.",
    to: "/notifications",
    arrow: false,
  },
  {
    icon: ShieldCheck,
    title: "Policy Mapping",
    body: "Assign procurement and allocation policies to specific departments.",
    to: "/allocation",
    arrow: true,
  },
];

const inputClass =
  "w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] px-3 py-2 text-sm text-[#203030] focus:border-[#1F6E5A] focus:bg-white focus:outline-none";

const DepartmentModal = ({
  initial,
  onClose,
  onSave,
}: {
  initial: Department | null;
  onClose: () => void;
  onSave: (d: Department) => void;
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [head, setHead] = useState(initial?.head ?? "");
  const [parent, setParent] = useState(
    initial?.parent && initial.parent !== "—" ? initial.parent : "",
  );
  const [status, setStatus] = useState<Status>(initial?.status ?? "Active");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      head: head.trim() || "Unassigned",
      parent: parent.trim() || "—",
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A2B4A]">
            {initial ? "Edit Department" : "Add Department"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-[#8A97A5] hover:text-[#475467]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              DEPARTMENT NAME
            </label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engineering" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              DEPARTMENT HEAD
            </label>
            <input value={head} onChange={(e) => setHead(e.target.value)} placeholder="e.g. Aditi Rao" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              PARENT DEPARTMENT
            </label>
            <input value={parent} onChange={(e) => setParent(e.target.value)} placeholder="Optional" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              STATUS
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={inputClass}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#E1E6EA] px-4 py-2 text-sm font-semibold text-[#475467]">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#195C4B]">
              {initial ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const res = await employeeService.list();
    setLoading(false);
    if (!res.success || !res.data) {
      setError(res.message || "Could not load employees.");
      return;
    }
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (emp: Employee, role: string) => {
    setBusyId(emp.id);
    setError("");
    const res = await employeeService.updateRole(emp.id, role);
    setBusyId(null);
    if (!res.success || !res.data) {
      setError(res.message || "Could not update role.");
      return;
    }
    setEmployees((list) => list.map((e) => (e.id === emp.id ? res.data! : e)));
  };

  if (loading) {
    return (
      <div className="mt-5 rounded-2xl border border-[#EAEEF2] bg-white p-12 text-center text-sm text-[#8A97A5]">
        Loading employees…
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[#EAEEF2] bg-white">
      {error && (
        <p className="m-4 rounded-lg bg-[#FDECEC] px-3 py-2 text-xs font-medium text-[#D64545]">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[#EAEEF2] text-[11px] font-semibold tracking-wide text-[#8A97A5]">
              <th className="px-5 py-3">NAME</th>
              <th className="px-5 py-3">EMAIL</th>
              <th className="px-5 py-3">ROLE</th>
              <th className="px-5 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const admin = e.role === "Admin";
              return (
                <tr key={e.id} className="border-b border-[#EEF1F4] text-sm last:border-0">
                  <td className="px-5 py-4 font-semibold text-[#1A2B4A]">{e.name}</td>
                  <td className="px-5 py-4 text-[#475467]">{e.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        admin
                          ? "bg-[#E6F4EC] text-[#1F9D6B]"
                          : "bg-[#EEF2F5] text-[#75808A]"
                      }`}
                    >
                      {admin && <ShieldCheck size={11} />}
                      {e.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setRole(e, admin ? "Employee" : "Admin")}
                      disabled={busyId === e.id}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        admin
                          ? "border border-[#E1E6EA] text-[#475467] hover:border-[#D64545] hover:text-[#D64545]"
                          : "bg-[#1F6E5A] text-white hover:bg-[#195C4B]"
                      }`}
                    >
                      {busyId === e.id
                        ? "Saving…"
                        : admin
                          ? "Revoke Admin"
                          : "Make Admin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Organization = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Departments");
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [modal, setModal] = useState<{ open: boolean; editIndex: number | null }>({
    open: false,
    editIndex: null,
  });

  const openAdd = () => setModal({ open: true, editIndex: null });
  const openEdit = (i: number) => setModal({ open: true, editIndex: i });
  const closeModal = () => setModal({ open: false, editIndex: null });

  const save = (d: Department) => {
    setDepartments((list) =>
      modal.editIndex === null
        ? [...list, d]
        : list.map((x, i) => (i === modal.editIndex ? d : x)),
    );
    closeModal();
  };

  return (
    <div className="pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A2B4A]">Organization Setup</h1>

      {/* Tabs + Add */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-[#EEF2F5] p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
                tab === t ? "bg-[#1F6E5A] text-white" : "text-[#475467] hover:text-[#1A2B4A]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab !== "Employee" && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#1F6E5A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#195C4B]"
          >
            <Plus size={16} /> Add {tab === "Departments" ? "Department" : tab.replace(/s$/, "")}
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#DCEBE3] bg-[#EEF6F1] px-4 py-3">
        <Info size={16} className="shrink-0 text-[#1F6E5A]" />
        <p className="text-sm italic text-[#4A6B5C]">
          Editing a department here also drives the picklist in asset allocation and resource
          booking screens.
        </p>
      </div>

      {/* Content */}
      {tab === "Departments" ? (
        <div className="mt-5 rounded-2xl border border-[#EAEEF2] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[#EAEEF2] text-[11px] font-semibold tracking-wide text-[#8A97A5]">
                  <th className="px-5 py-3">DEPARTMENT NAME</th>
                  <th className="px-5 py-3">DEPARTMENT HEAD</th>
                  <th className="px-5 py-3">PARENT DEPARTMENT</th>
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={d.name} className="border-b border-[#EEF1F4] text-sm last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-5 w-1 rounded-full"
                          style={{ background: d.status === "Active" ? "#1F6E5A" : "#C7CED4" }}
                        />
                        <span className="font-semibold text-[#1A2B4A]">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[#475467]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2F5F8] text-[#8A97A5]">
                          <User size={13} />
                        </span>
                        {d.head}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#475467]">{d.parent}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          d.status === "Active"
                            ? "bg-[#E6F4EC] text-[#1F9D6B]"
                            : "bg-[#EEF2F5] text-[#75808A]"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openEdit(i)}
                        aria-label={`Edit ${d.name}`}
                        className="text-[#8A97A5] hover:text-[#1F6E5A]"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#EAEEF2] p-4 text-xs text-[#8A97A5]">
            <span>
              Showing {departments.length} of {departments.length} departments
            </span>
            <div className="flex gap-2">
              <button disabled className="rounded-md border border-[#E1E6EA] px-3 py-1 font-semibold text-[#475467] disabled:opacity-40">
                Previous
              </button>
              <button disabled className="rounded-md border border-[#E1E6EA] px-3 py-1 font-semibold text-[#475467] disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : tab === "Employee" ? (
        <EmployeeTab />
      ) : (
        <div className="mt-5 rounded-2xl border border-[#EAEEF2] bg-white p-12 text-center text-sm text-[#8A97A5]">
          No {tab.toLowerCase()} configured yet. Use “Add {tab.replace(/s$/, "")}” to create one.
        </div>
      )}

      {/* Tool cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {tools.map((t) => (
          <button
            key={t.title}
            onClick={() => navigate(t.to)}
            className="relative rounded-2xl border border-[#EAEEF2] bg-white p-5 text-left transition hover:border-[#1F6E5A]/40 hover:shadow-sm"
          >
            {t.arrow && <ArrowRight size={16} className="absolute right-5 top-5 text-[#8A97A5]" />}
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F5] text-[#1F6E5A]">
              <t.icon size={20} />
            </span>
            <h3 className="text-base font-bold text-[#1A2B4A]">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#8A97A5]">{t.body}</p>
          </button>
        ))}
      </div>

      {modal.open && (
        <DepartmentModal
          initial={modal.editIndex === null ? null : departments[modal.editIndex]}
          onClose={closeModal}
          onSave={save}
        />
      )}
    </div>
  );
};

export default Organization;
