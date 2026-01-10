"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye, Settings, X, Plus, Calendar, DollarSign, Building, User, Phone, Mail, MapPin } from "lucide-react";
import { backendApi } from "@/services/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomFieldsModal from "@/components/CustomFieldsModal";
import { toast } from "react-toastify";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bankId: "",
    branchName: "",
    contactName: "",
    stage: "LEAD",
    valueAmount: "",
    closingDate: "",
    description: "",
    customFields: {}
  });

  // ✅ Normalize backend response
  const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.content && Array.isArray(res.content)) return res.content;
    return [];
  };

  // ✅ Extract status from various error shapes
  const getStatusFromError = (err) => {
    if (!err) return null;
    if (err?.response?.status) return err.response.status;
    if (err?.status) return err.status;
    if (err?.data?.status) return err.data.status;
    const msg = (err?.message || "").toString();
    if (/404|not\s*found/i.test(msg)) return 404;
    return null;
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get("/clients");
      const customersData = normalizeList(res);
      setCustomers(customersData);

      // Extract dynamic columns from custom fields
      const keys = new Set();
      customersData.forEach((customer) => {
        if (customer?.customFields && typeof customer.customFields === "object") {
          Object.keys(customer.customFields).forEach((k) => keys.add(k));
        }
      });
      setDynamicColumns([...keys]);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await backendApi.get("/banks");
      setBanks(normalizeList(res));
    } catch (err) {
      console.error("Failed to fetch banks:", err);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await backendApi.get("/deals");
      setDeals(normalizeList(res));
    } catch (err) {
      console.error("Failed to fetch deals:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchBanks();
    fetchDeals();
  }, []);

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const filtered = customers.filter((customer) => {
    const name = (customer.name || "").toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = (customer.contactPhone || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q);
  });

  // ✅ Reset modal and open create
  const openCreate = () => {
    setSelectedCustomer(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      bankId: "",
      branchName: "",
      contactName: "",
      stage: "LEAD",
      valueAmount: "",
      closingDate: "",
      description: "",
      customFields: {}
    });
    setShowCreateDrawer(true);
  };

  // ✅ Edit: always fetch fresh data
  const openEdit = async (customer) => {
    try {
      if (!customer?.id) {
        toast.error("Invalid customer selected");
        return;
      }

      const freshCustomer = await backendApi.get(`/clients/${customer.id}`);
      
      // Find associated deal
      const customerDeal = deals.find(deal => deal.clientId === customer.id);

      setSelectedCustomer(freshCustomer);
      setForm({
        name: freshCustomer.name || "",
        email: freshCustomer.email || "",
        phone: freshCustomer.contactPhone || "",
        address: freshCustomer.address || "",
        bankId: customerDeal?.bankId || "",
        branchName: customerDeal?.branchName || "",
        contactName: freshCustomer.contactName || "",
        stage: customerDeal?.stage || "LEAD",
        valueAmount: customerDeal?.valueAmount || "",
        closingDate: customerDeal?.closingDate || "",
        description: customerDeal?.description || "",
        customFields: freshCustomer.customFields || {}
      });
      setShowCreateDrawer(true);
    } catch (err) {
      console.error("Failed to open edit:", err);
      const status = getStatusFromError(err);
      if (status === 404) {
        toast.error("Customer not found. Reloading list...");
        await fetchCustomers();
        return;
      }
      toast.error("Failed to load customer details");
    }
  };

  const openDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsDrawer(true);
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (!form.name?.trim()) {
        toast.error("Customer Name is required");
        return;
      }

      // Create/Update Customer
      const customerPayload = {
        name: form.name?.trim(),
        email: form.email?.trim() || null,
        contactPhone: form.phone?.trim() || null,
        address: form.address || "",
        customFields: form.customFields || {},
      };

      let savedCustomer;
      if (selectedCustomer?.id) {
        savedCustomer = await backendApi.put(`/clients/${selectedCustomer.id}`, customerPayload);
        toast.success("Customer updated successfully");
      } else {
        savedCustomer = await backendApi.post("/clients", customerPayload);
        toast.success("Customer created successfully");
      }

      // Create/Update associated Deal
      const dealPayload = {
        clientId: savedCustomer.id,
        name: form.name?.trim(),
        bankId: form.bankId || null,
        branchName: form.branchName || "",
        contactName: form.contactName || "",
        stage: form.stage || "LEAD",
        valueAmount: Number(form.valueAmount) || 0,
        closingDate: form.closingDate || null,
        description: form.description || "",
        customFields: form.customFields || {}
      };

      if (selectedCustomer?.id) {
        const existingDeal = deals.find(deal => deal.clientId === selectedCustomer.id);
        if (existingDeal) {
          await backendApi.put(`/deals/${existingDeal.id}`, dealPayload);
        } else {
          await backendApi.post("/deals", dealPayload);
        }
      } else {
        await backendApi.post("/deals", dealPayload);
      }

      // Refresh data
      await fetchCustomers();
      await fetchDeals();
      
      setShowCreateDrawer(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error("Save failed:", err);
      const status = getStatusFromError(err);
      if (status === 404) {
        toast.error("Customer not found. Reloading list...");
        await fetchCustomers();
        setShowCreateDrawer(false);
        setSelectedCustomer(null);
        return;
      }
      const errorMsg = err?.data?.message || err?.message || "Unknown error";
      toast.error(`Failed to save customer: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    
    try {
      await backendApi.delete(`/clients/${id}`);
      
      // Optimistic remove
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      
      // Remove associated deal
      const customerDeal = deals.find(deal => deal.clientId === id);
      if (customerDeal) {
        await backendApi.delete(`/deals/${customerDeal.id}`);
        setDeals((prev) => prev.filter((d) => d.id !== customerDeal.id));
      }
      
      // If editing same customer, close drawer
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
        setShowCreateDrawer(false);
      }
      
      toast.success("Customer deleted successfully");
      await fetchCustomers();
      await fetchDeals();
    } catch (err) {
      console.error("Delete failed:", err);
      const status = getStatusFromError(err);
      
      if (status === 404) {
        toast.info("Customer already deleted. Refreshing list...");
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        setDeals((prev) => prev.filter((d) => d.clientId !== id));
        
        if (selectedCustomer?.id === id) {
          setSelectedCustomer(null);
          setShowCreateDrawer(false);
        }
        
        await fetchCustomers();
        await fetchDeals();
        return;
      }
      
      toast.error("Failed to delete customer");
    }
  };

  return (
    <DashboardLayout
      header={{
        project: "Customers",
        user: { name: "Admin User", role: "Administrator" },
        notifications: [],
      }}
    >
      <div className="flex flex-col space-y-4">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">Customers</div>
            <p className="text-sm text-slate-500">All customers and deals</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-4 flex items-center gap-2 border rounded px-3 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Deal Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Amount
                    </th>
                    
                    {dynamicColumns.map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                      >
                        {formatLabel(col)}
                      </th>
                    ))}

                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {filtered.map((customer) => {
                    const customerDeal = deals.find(deal => deal.clientId === customer.id);
                    return (
                      <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {customer.name}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {customer.email || "-"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {customer.contactPhone || "-"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            customerDeal?.stage === 'WON' ? 'bg-green-100 text-green-800' :
                            customerDeal?.stage === 'LOST' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {customerDeal?.stage || 'LEAD'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          ${customerDeal?.valueAmount || 0}
                        </td>

                        {dynamicColumns.map((col) => (
                          <td
                            key={col}
                            className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                          >
                            {customer.customFields?.[col] || "-"}
                          </td>
                        ))}

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openDetails(customer)}
                              className="text-green-600 hover:text-green-800"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => openEdit(customer)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!filtered.length && (
                    <tr>
                      <td
                        colSpan={5 + dynamicColumns.length}
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ CREATE/EDIT DRAWER */}
        {showCreateDrawer && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowCreateDrawer(false)}
            />

            <div className="fixed inset-0 z-[70] flex justify-end">
              <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {selectedCustomer ? "Edit Customer" : "Create Customer"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCustomer ? "Update customer information" : "Add a new customer and deal"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateDrawer(false)}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div>
                      <h3 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Information
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Customer Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Enter customer name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="customer@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contact Person
                          </label>
                          <input
                            type="text"
                            value={form.contactName}
                            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Contact person name"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address
                        </label>
                        <textarea
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          placeholder="Enter customer address"
                        />
                      </div>
                    </div>

                    {/* Deal Information */}
                    <div>
                      <h3 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Deal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Bank
                          </label>
                          <select
                            value={form.bankId}
                            onChange={(e) => setForm({ ...form, bankId: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">Select bank</option>
                            {banks.map((bank) => (
                              <option key={bank.id} value={bank.id}>
                                {bank.bankName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Branch Name
                          </label>
                          <input
                            type="text"
                            value={form.branchName}
                            onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Branch name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Deal Stage
                          </label>
                          <select
                            value={form.stage}
                            onChange={(e) => setForm({ ...form, stage: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="LEAD">Lead</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="PROPOSAL">Proposal</option>
                            <option value="NEGOTIATION">Negotiation</option>
                            <option value="WON">Won</option>
                            <option value="LOST">Lost</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Deal Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.valueAmount}
                            onChange={(e) => setForm({ ...form, valueAmount: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Closing Date
                          </label>
                          <input
                            type="date"
                            value={form.closingDate}
                            onChange={(e) => setForm({ ...form, closingDate: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          placeholder="Deal description and notes"
                        />
                      </div>
                    </div>

                    {/* Custom Fields */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Settings className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            Custom Fields
                          </div>
                          <div className="text-xs text-slate-500">
                            Add custom fields to this customer
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCustomFieldsModal(true)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-slate-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      <span className="text-rose-500">*</span> Required fields
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateDrawer(false)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleCreateOrUpdate}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        {selectedCustomer ? "Update Customer" : "Create Customer"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DETAILS DRAWER */}
        {showDetailsDrawer && selectedCustomer && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowDetailsDrawer(false)}
            />

            <div className="fixed inset-0 z-[70] flex justify-end">
              <div className="relative w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Customer Details</h2>
                  <button
                    onClick={() => setShowDetailsDrawer(false)}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 mb-3">Customer Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <User className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Name</div>
                            <div className="text-sm text-slate-600">{selectedCustomer.name}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Email</div>
                            <div className="text-sm text-slate-600">{selectedCustomer.email || "-"}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Phone</div>
                            <div className="text-sm text-slate-600">{selectedCustomer.contactPhone || "-"}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Address</div>
                            <div className="text-sm text-slate-600">{selectedCustomer.address || "-"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deal Info */}
                    {(() => {
                      const customerDeal = deals.find(deal => deal.clientId === selectedCustomer.id);
                      if (!customerDeal) return null;
                      
                      return (
                        <div>
                          <h3 className="text-sm font-medium text-slate-900 mb-3">Deal Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <DollarSign className="h-4 w-4 text-slate-400 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-slate-900">Amount</div>
                                <div className="text-sm text-slate-600">${customerDeal.valueAmount || 0}</div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-slate-900">Stage</div>
                                <div className="text-sm text-slate-600">{customerDeal.stage || "LEAD"}</div>
                              </div>
                            </div>

                            {customerDeal.closingDate && (
                              <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">Closing Date</div>
                                  <div className="text-sm text-slate-600">{customerDeal.closingDate}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Custom Fields */}
                    {selectedCustomer.customFields && Object.keys(selectedCustomer.customFields).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 mb-3">Custom Fields</h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCustomer.customFields).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm font-medium text-slate-700">{formatLabel(key)}:</span>
                              <span className="text-sm text-slate-600">{value || "-"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CUSTOM FIELDS MODAL */}
        <CustomFieldsModal
          isOpen={showCustomFieldsModal}
          onClose={() => setShowCustomFieldsModal(false)}
          entityType="Customer"
          initialFields={form.customFields}
          onSave={(fields) => {
            setForm({ ...form, customFields: fields });
            setShowCustomFieldsModal(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
