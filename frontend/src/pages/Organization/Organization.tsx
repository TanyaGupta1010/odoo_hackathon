import React, { useState, useEffect } from "react";
import { api } from "../../services/http";
import { Building2, Layers, Users, Plus, ShieldCheck, CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react";

interface Department {
  id: number;
  name: string;
  parentDepartmentId?: number | null;
  status: "Active" | "Inactive";
  headId?: number | null;
  head?: { id: number; name: string } | null;
  parentDepartment?: { id: number; name: string } | null;
}

interface AssetCategory {
  id: number;
  name: string;
  description?: string | null;
  customFields?: any;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Asset Manager" | "Department Head" | "Employee";
  status: "Active" | "Inactive";
  departmentId?: number | null;
  department?: { id: number; name: string } | null;
}

const Organization = () => {
  const [activeTab, setActiveTab] = useState<"departments" | "categories" | "employees">("departments");
  
  // Data States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal / Form States
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({ name: "", parentDepartmentId: "", headId: "", status: "Active" });

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<AssetCategory | null>(null);
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  const [showEmpModal, setShowEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [empForm, setEmpForm] = useState({ role: "Employee", departmentId: "", status: "Active" });

  // Fetch all organizational data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [deptRes, catRes, empRes] = await Promise.all([
        api.get("/org/departments"),
        api.get("/org/categories"),
        api.get("/org/employees"),
      ]);

      setDepartments(deptRes.data.data);
      setCategories(catRes.data.data);
      setEmployees(empRes.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch organizational configuration from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Department Actions ---
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: deptForm.name,
        parentDepartmentId: deptForm.parentDepartmentId ? Number(deptForm.parentDepartmentId) : null,
        headId: deptForm.headId ? Number(deptForm.headId) : null,
        status: deptForm.status,
      };

      if (editingDept) {
        await api.patch(`/org/departments/${editingDept.id}`, payload);
      } else {
        await api.post("/org/departments", payload);
      }

      setShowDeptModal(false);
      setEditingDept(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save department.");
    }
  };

  const openEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      parentDepartmentId: dept.parentDepartmentId ? String(dept.parentDepartmentId) : "",
      headId: dept.headId ? String(dept.headId) : "",
      status: dept.status,
    });
    setShowDeptModal(true);
  };

  // --- Category Actions ---
  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: catForm.name,
        description: catForm.description,
      };

      if (editingCat) {
        await api.patch(`/org/categories/${editingCat.id}`, payload);
      } else {
        await api.post("/org/categories", payload);
      }

      setShowCatModal(false);
      setEditingCat(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save asset category.");
    }
  };

  const openEditCat = (cat: AssetCategory) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || "",
    });
    setShowCatModal(true);
  };

  // --- Employee Assignment Actions ---
  const handleSaveEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        role: empForm.role,
        departmentId: empForm.departmentId ? Number(empForm.departmentId) : null,
        status: empForm.status,
      };

      if (editingEmp) {
        await api.patch(`/org/employees/${editingEmp.id}`, payload);
      }

      setShowEmpModal(false);
      setEditingEmp(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save employee assignment.");
    }
  };

  const openEditEmp = (emp: Employee) => {
    setEditingEmp(emp);
    setEmpForm({
      role: emp.role,
      departmentId: emp.departmentId ? String(emp.departmentId) : "",
      status: emp.status,
    });
    setShowEmpModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-sm font-semibold text-[#75808A]">
        Loading organizational configurations...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Organization Setup</h1>
          <p className="mt-1 text-sm text-[#75808A]">
            Manage departments, asset categories, and assign roles & departments to employees.
          </p>
        </div>

        {/* Add Button */}
        {activeTab !== "employees" && (
          <button
            onClick={() => {
              if (activeTab === "departments") {
                setEditingDept(null);
                setDeptForm({ name: "", parentDepartmentId: "", headId: "", status: "Active" });
                setShowDeptModal(true);
              } else if (activeTab === "categories") {
                setEditingCat(null);
                setCatForm({ name: "", description: "" });
                setShowCatModal(true);
              }
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1F6E5A] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#2C8A71]"
          >
            <Plus size={18} />
            Add {activeTab === "departments" ? "Department" : "Category"}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Tabs System */}
      <div className="flex border-b border-[#E7ECEF] bg-white rounded-t-2xl p-4 gap-2">
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "departments"
              ? "bg-[#1F6E5A] text-white"
              : "text-[#75808A] hover:bg-[#F8FAFB] hover:text-[#203030]"
          }`}
        >
          <Building2 size={16} />
          Departments
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "categories"
              ? "bg-[#1F6E5A] text-white"
              : "text-[#75808A] hover:bg-[#F8FAFB] hover:text-[#203030]"
          }`}
        >
          <Layers size={16} />
          Categories
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "employees"
              ? "bg-[#1F6E5A] text-white"
              : "text-[#75808A] hover:bg-[#F8FAFB] hover:text-[#203030]"
          }`}
        >
          <Users size={16} />
          Employees
        </button>
      </div>

      {/* Dynamic Content Panel */}
      <div className="rounded-2xl border border-[#E7ECEF] bg-white shadow-sm overflow-hidden">
        {activeTab === "departments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#203030]">
              <thead className="bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#75808A] border-b border-[#E7ECEF]">
                <tr>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Head</th>
                  <th className="px-6 py-4">Parent Dept</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECEF]">
                {departments.map((dept) => (
                  <tr key={dept.id} className="transition hover:bg-[#F8FAFB]">
                    <td className="px-6 py-4 font-bold text-[#203030]">{dept.name}</td>
                    <td className="px-6 py-4 text-[#75808A]">
                      {dept.head?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-[#75808A]">
                      {dept.parentDepartment?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          dept.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditDept(dept)}
                        className="text-[#1F6E5A] hover:text-[#2C8A71] font-semibold"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-xs text-[#75808A]">
                      No departments configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#203030]">
              <thead className="bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#75808A] border-b border-[#E7ECEF]">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECEF]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition hover:bg-[#F8FAFB]">
                    <td className="px-6 py-4 font-bold text-[#203030]">{cat.name}</td>
                    <td className="px-6 py-4 text-[#75808A]">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditCat(cat)}
                        className="text-[#1F6E5A] hover:text-[#2C8A71] font-semibold"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-xs text-[#75808A]">
                      No categories configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#203030]">
              <thead className="bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#75808A] border-b border-[#E7ECEF]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Assign/Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECEF]">
                {employees.map((emp) => (
                  <tr key={emp.id} className="transition hover:bg-[#F8FAFB]">
                    <td className="px-6 py-4 font-bold text-[#203030]">{emp.name}</td>
                    <td className="px-6 py-4 text-[#75808A]">{emp.email}</td>
                    <td className="px-6 py-4 text-[#75808A] font-semibold">{emp.role}</td>
                    <td className="px-6 py-4 text-[#75808A]">
                      {emp.department?.name || "Not Assigned"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditEmp(emp)}
                        className="text-[#1F6E5A] hover:text-[#2C8A71] font-semibold"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Department Modal --- */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSaveDept}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]"
          >
            <h3 className="text-lg font-bold text-[#203030]">
              {editingDept ? "Edit Department" : "Create Department"}
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#75808A]">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Facilities, Field Ops"
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Department Head</label>
                <select
                  value={deptForm.headId}
                  onChange={(e) => setDeptForm({ ...deptForm, headId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="">Select Department Head (Optional)</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Parent Department</label>
                <select
                  value={deptForm.parentDepartmentId}
                  onChange={(e) => setDeptForm({ ...deptForm, parentDepartmentId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="">Select Parent Department (Optional)</option>
                  {departments
                    .filter((d) => !editingDept || d.id !== editingDept.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Status</label>
                <select
                  value={deptForm.status}
                  onChange={(e) => setDeptForm({ ...deptForm, status: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2C8A71]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Category Modal --- */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSaveCat}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]"
          >
            <h3 className="text-lg font-bold text-[#203030]">
              {editingCat ? "Edit Category" : "Create Asset Category"}
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#75808A]">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. IT Equipment, Office Furniture"
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Description</label>
                <textarea
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Optional category description..."
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A] min-h-[80px]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2C8A71]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Employee Assignment Modal --- */}
      {showEmpModal && editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSaveEmp}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E7ECEF]"
          >
            <h3 className="text-lg font-bold text-[#203030]">Edit Employee Assignment</h3>
            <p className="text-xs text-[#75808A] mt-1">Assign department and role for {editingEmp.name}</p>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#75808A]">Role</label>
                <select
                  value={empForm.role}
                  onChange={(e: any) => setEmpForm({ ...empForm, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="Admin">Admin</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Department</label>
                <select
                  value={empForm.departmentId}
                  onChange={(e) => setEmpForm({ ...empForm, departmentId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="">Not Assigned</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#75808A]">Status</label>
                <select
                  value={empForm.status}
                  onChange={(e: any) => setEmpForm({ ...empForm, status: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm text-[#203030] focus:border-[#1F6E5A]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E7ECEF] pt-4">
              <button
                type="button"
                onClick={() => setShowEmpModal(false)}
                className="rounded-xl border border-[#E7ECEF] px-4 py-2 text-sm font-semibold text-[#75808A] hover:bg-[#F8FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2C8A71]"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Organization;
