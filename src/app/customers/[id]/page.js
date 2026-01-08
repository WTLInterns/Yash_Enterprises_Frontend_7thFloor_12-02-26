"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { backendApi } from "@/services/api";
import {
  Calendar,
  Mail,
  CreditCard,
  Edit3,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Plus,
  Eye,
  Download,
  Upload,
} from "lucide-react";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id;

  const [customer, setCustomer] = useState(null);
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [follow, setFollow] = useState(false);

  const statuses = [
    "Lead",
    "13/2",
    "13/4",
    "DM Application",
    "Possession Order",
    "Physical Possession",
    "Billing Department",
    "Closed Won",
    "Closed Lost",
    "Hold Account",
  ];
  const [currentStage, setCurrentStage] = useState("Physical Possession");
  const [stageStartAt, setStageStartAt] = useState(() => new Date());

  const [timeline, setTimeline] = useState(() => {
    const now = new Date();
    return [
      {
        id: 1,
        time: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        actor: "Simran Singh",
        message: "Stage updated to 'Physical Possession'",
      },
      {
        id: 2,
        time: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        actor: "Simran Singh",
        message: "Stage updated to 'Lead'",
      },
    ];
  });

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFile, setNoteFile] = useState(null);

  const [activitiesTab, setActivitiesTab] = useState("tasks");
  const [tasks, setTasks] = useState([
    { id: 1, name: "Make a Bill", dueDate: "2023-08-08", status: "Completed", owner: "Mahesh Narsale", priority: "Normal", description: "" },
    { id: 2, name: "Bill Give", dueDate: "2023-09-20", status: "Completed", owner: "Mahesh Narsale", priority: "Normal", description: "" },
    { id: 3, name: "Document Collect", dueDate: "2023-12-12", status: "Completed", owner: "Mahesh Narsale", priority: "Normal", description: "" },
  ]);
  const [events, setEvents] = useState([]);
  const [calls, setCalls] = useState([]);

  const productCatalog = [
    { id: 1, name: "Collection Charges", code: "CC", price: 10000 },
    { id: 2, name: "Dm Order", code: "DO", price: 15000 },
    { id: 3, name: "Legal Notice", code: "LN", price: 5000 },
    { id: 4, name: "Filing Charges", code: "FC", price: 8000 },
  ];

  const [products, setProducts] = useState([
    { id: 1, name: "Collection Charges", code: "CC", price: 10000, qty: 1, discount: 0, tax: 0 },
    { id: 2, name: "Dm Order", code: "DO", price: 15000, qty: 1, discount: 0, tax: 0 },
  ]);

  const grandTotal = useMemo(
    () =>
      products.reduce(
        (sum, p) => sum + (p.price * p.qty - (p.discount || 0) + (p.tax || 0)),
        0
      ),
    [products]
  );

  const [stageHistory, setStageHistory] = useState(() => {
    const now = new Date();
    const ts = now.toISOString();
    const entries = [
      { id: 1, stage: "Physical Possession", amount: grandTotal, durationDays: 1, modifiedBy: "Simran Singh", timestamp: ts },
      { id: 2, stage: "Lead", amount: grandTotal, durationDays: 0, modifiedBy: "Simran Singh", timestamp: ts },
      { id: 3, stage: "13/2", amount: grandTotal, durationDays: 0, modifiedBy: "Simran Singh", timestamp: ts },
      { id: 4, stage: "13/4", amount: grandTotal, durationDays: 0, modifiedBy: "Simran Singh", timestamp: ts },
      { id: 5, stage: "DM Application", amount: grandTotal, durationDays: 0, modifiedBy: "Simran Singh", timestamp: ts },
      { id: 6, stage: "Possession Order", amount: grandTotal, durationDays: 0, modifiedBy: "Simran Singh", timestamp: ts },
    ];
    return entries;
  });

  useEffect(() => {
    if (!customerId) return;

    let isMounted = true;

    async function loadCustomer() {
      try {
        setLoadingCustomer(true);
        setError(null);
        const data = await backendApi.get(`/clients/${customerId}`);
        if (!isMounted) return;
        setCustomer(data);
      } catch (err) {
        console.error("Failed to load customer", err);
        setError("Failed to load customer: " + err.message);
        if (!isMounted) setLoadingCustomer(false);
      }
    }

    async function loadCases() {
      try {
        setLoadingCases(true);
        setError(null);
        const data = await backendApi.get(`/cases/client/${customerId}`);
        if (!isMounted) return;
        setCases(data || []);
      } catch (err) {
        console.error("Failed to load cases", err);
        setError("Failed to load cases: " + err.message);
        if (!isMounted) setLoadingCases(false);
      }
    }

    loadCustomer();
    loadCases();

    return () => {
      isMounted = false;
    };
  }, [customerId]);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [docs, setDocs] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);
  const caseFileInputRef = useRef(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [isEventCreateOpen, setIsEventCreateOpen] = useState(false);
  const [isCallCreateOpen, setIsCallCreateOpen] = useState(false);
  const [isTaskConfigOpen, setIsTaskConfigOpen] = useState(false);
  const [isEventConfigOpen, setIsEventConfigOpen] = useState(false);
  const [isCallConfigOpen, setIsCallConfigOpen] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productFormError, setProductFormError] = useState("");
  const [productForm, setProductForm] = useState({
    productId: "",
    productName: "",
    productCode: "",
    listPrice: "",
    quantity: "1",
    discount: "0",
    tax: "0",
  });

  const [taskForm, setTaskForm] = useState({
    name: "",
    dueDate: "",
    repeat: "Never",
    reminder: "None",
    relatedTo: "",
    description: "",
    status: "Open",
    priority: "Normal",
    completed: false,
    expenseAmount: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    from: "",
    to: "",
    repeat: "Never",
    reminder: "None",
    location: "",
    relatedTo: "",
    participants: "",
    description: "",
  });

  const [callForm, setCallForm] = useState({
    toFrom: "",
    startTime: "",
    reminder: "None",
    callType: "Outbound",
    callStatus: "Planned",
    relatedTo: "",
    callPurpose: "",
    callAgenda: "",
    duration: "",
  });

  const [taskColumnConfig, setTaskColumnConfig] = useState({
    priority: false,
    expenseAmount: false,
  });
  const [eventColumnConfig, setEventColumnConfig] = useState({
    location: false,
  });
  const [callColumnConfig, setCallColumnConfig] = useState({
    purpose: false,
  });

  const handleAddCase = async (e) => {
    e.preventDefault();
    if (!caseName.trim() || !customerId) return;

    try {
      const trimmedName = caseName.trim();

      const payload = {
        caseNumber: `C-${Date.now()}`,
        title: trimmedName,
        description: "",
        status: "OPEN",
        priority: "MEDIUM",
        clientId: Number(customerId),
      };
      const created = await backendApi.post("/cases", payload);
      setCases((prev) => [...prev, created]);
      setCaseName("");
      setIsCaseModalOpen(false);
    } catch (err) {
      console.error("Failed to create case", err);
    }
  };

  const handleRemoveCase = async (id) => {
    try {
      await backendApi.delete(`/cases/${id}`);
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete case", err);
    }
  };

  async function openCaseViewer(id) {
    if (!id) return;
    setSelectedCaseId(id);
    setActiveTab("files");
    try {
      const [caseRes, docsRes] = await Promise.all([
        backendApi.get(`/cases/${id}`),
        backendApi.get(`/case-documents/case/${id}`),
      ]);
      setCaseData(caseRes || null);
      setDocs(docsRes || []);
    } catch (err) {
      console.error("Failed to load case", err);
    }
  }

  function closeDocViewer() {
    setViewingDoc(null);
  }

  function viewDoc(doc) {
    if (!doc) return;
    setViewingDoc(doc);
  }

  async function uploadDoc(e) {
    e.preventDefault();
    if (!docFile || !selectedCaseId) return;
    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append("file", docFile);
      formData.append("caseId", String(selectedCaseId));
      formData.append("documentName", docType || docFile.name);
      formData.append("description", "");
      const res = await fetch("http://localhost:8080/api/case-documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Upload failed", text);
        return;
      }
      const uploaded = await res.json();
      setDocs((prev) => [...prev, uploaded]);
      setDocFile(null);
      setDocType("");
      if (caseFileInputRef.current) caseFileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to upload document", err);
    } finally {
      setUploadingDoc(false);
    }
  }

  async function removeDoc(id) {
    if (!id) return;
    try {
      await backendApi.delete(`/case-documents/${id}`);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  }

  function downloadDoc(doc) {
    if (!doc) return;
    window.open(`http://localhost:8080/api/case-documents/download/${doc.id}`, "_blank");
  }

  const lastModified = useMemo(() => {
    const latest = timeline.slice().sort((a, b) => new Date(b.time) - new Date(a.time))[0];
    return latest ? new Date(latest.time) : new Date();
  }, [timeline]);

  const timelineGroups = useMemo(() => {
    const groups = {};
    for (const item of timeline) {
      const d = new Date(item.time);
      const key = d.toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    const orderedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    return orderedKeys.map((key) => ({ key, items: groups[key] }));
  }, [timeline]);

  const productFinalAmount = useMemo(() => {
    const price = Number(productForm.listPrice) || 0;
    const qty = Number(productForm.quantity) || 0;
    const discount = Number(productForm.discount) || 0;
    const tax = Number(productForm.tax) || 0;
    return price * qty - discount + tax;
  }, [productForm.listPrice, productForm.quantity, productForm.discount, productForm.tax]);

  if (!customer && (loadingCustomer || loadingCases)) {
    return (
      <DashboardLayout
        header={{
          project: "Customer Details",
          user: { name: "Admin User", role: "Administrator" },
          notifications: [],
        }}
      >
        <div className="p-4 text-sm text-slate-600">Loading customer...</div>
      </DashboardLayout>
    );
  }

  const safeCustomer = customer || { id: customerId, name: "Customer" };

  function formatCurrency(n) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n || 0);
  }

  function handleStageChange(newStage) {
    const actor = "Simran Singh";
    const now = new Date();
    const prevStart = stageStartAt;
    const durationDays = Math.max(0, Math.floor((now - prevStart) / (1000 * 60 * 60 * 24)));
    setStageHistory((prev) => [
      { id: Date.now(), stage: newStage, amount: grandTotal, durationDays, modifiedBy: actor, timestamp: now.toISOString() },
      ...prev,
    ]);
    setCurrentStage(newStage);
    setStageStartAt(now);
    setTimeline((prev) => [
      { id: Date.now(), time: now.toISOString(), actor, message: `Stage updated to '${newStage}'` },
      ...prev,
    ]);
  }

  function openTaskCreate() {
    setTaskForm((prev) => ({ ...prev, relatedTo: prev.relatedTo || safeCustomer.name }));
    setIsTaskCreateOpen(true);
  }

  function openEventCreate() {
    setEventForm((prev) => ({ ...prev, relatedTo: prev.relatedTo || safeCustomer.name }));
    setIsEventCreateOpen(true);
  }

  function openCallCreate() {
    setCallForm((prev) => ({ ...prev, relatedTo: prev.relatedTo || safeCustomer.name }));
    setIsCallCreateOpen(true);
  }

  function openProductModal() {
    setProductForm({
      productId: "",
      productName: "",
      productCode: "",
      listPrice: "",
      quantity: "1",
      discount: "0",
      tax: "0",
    });
    setProductSearch("");
    setProductFormError("");
    setIsProductModalOpen(true);
  }

  function closeTaskCreate() {
    setIsTaskCreateOpen(false);
  }

  function closeEventCreate() {
    setIsEventCreateOpen(false);
  }

  function closeCallCreate() {
    setIsCallCreateOpen(false);
  }

  function closeProductModal() {
    setIsProductModalOpen(false);
    setProductFormError("");
    setProductForm({
      productId: "",
      productName: "",
      productCode: "",
      listPrice: "",
      quantity: "1",
      discount: "0",
      tax: "0",
    });
    setProductSearch("");
  }

  function saveTask() {
    const now = new Date();
    const newTask = {
      id: Date.now(),
      name: taskForm.name || "New Task",
      dueDate: taskForm.dueDate || now.toISOString().slice(0, 10),
      status: taskForm.completed ? "Completed" : taskForm.status || "Open",
      owner: "Simran Singh",
      priority: taskForm.priority || "Normal",
      description: taskForm.description || "",
      expenseAmount: taskForm.expenseAmount || "",
    };
    setTasks((prev) => [newTask, ...prev]);
    setTaskForm({
      name: "",
      dueDate: "",
      repeat: "Never",
      reminder: "None",
      relatedTo: safeCustomer.name,
      description: "",
      status: "Open",
      priority: "Normal",
      completed: false,
      expenseAmount: "",
    });
    closeTaskCreate();
  }

  function saveEvent() {
    const newEvent = {
      id: Date.now(),
      title: eventForm.title || "New Event",
      from: eventForm.from || "",
      to: eventForm.to || "",
      host: "Simran Singh",
      location: eventForm.location || "",
      participants: eventForm.participants || "",
      description: eventForm.description || "",
    };
    setEvents((prev) => [newEvent, ...prev]);
    setEventForm({
      title: "",
      from: "",
      to: "",
      repeat: "Never",
      reminder: "None",
      location: "",
      relatedTo: safeCustomer.name,
      participants: "",
      description: "",
    });
    closeEventCreate();
  }

  function saveCall() {
    const now = new Date();
    const newCall = {
      id: Date.now(),
      toFrom: callForm.toFrom || "—",
      callType: callForm.callType || "Outbound",
      startTime: callForm.startTime || "",
      modifiedTime: now.toISOString(),
      owner: "Simran Singh",
      duration: callForm.duration || "—",
      callPurpose: callForm.callPurpose || "",
      callAgenda: callForm.callAgenda || "",
      callStatus: callForm.callStatus || "Planned",
    };
    setCalls((prev) => [newCall, ...prev]);
    setCallForm({
      toFrom: "",
      startTime: "",
      reminder: "None",
      callType: "Outbound",
      callStatus: "Planned",
      relatedTo: safeCustomer.name,
      callPurpose: "",
      callAgenda: "",
      duration: "",
    });
    closeCallCreate();
  }

  function saveProductFromModal() {
    const price = Number(productForm.listPrice);
    const qty = Number(productForm.quantity);
    const discount = Number(productForm.discount) || 0;
    const tax = Number(productForm.tax) || 0;

    if (!productForm.productName || Number.isNaN(price) || price <= 0 || Number.isNaN(qty) || qty <= 0) {
      setProductFormError("Please select a product and enter a valid price and quantity.");
      return;
    }

    const id = Date.now();

    setProducts((prev) => [
      ...prev,
      {
        id,
        name: productForm.productName,
        code: productForm.productCode || "PRD",
        price,
        qty,
        discount,
        tax,
      },
    ]);

    closeProductModal();
  }

  function closeAllConfigSidebars() {
    setIsTaskConfigOpen(false);
    setIsEventConfigOpen(false);
    setIsCallConfigOpen(false);
  }

  return (
    <DashboardLayout
      header={{
        project: 'Customer Details',
        user: { name: 'Admin User', role: 'Administrator' },
        notifications: [],
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50/70 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-shadow duration-300 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Link
                  href="/customers"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Customers
                </Link>
                <span className="text-slate-400">/</span>
                <span className="truncate text-slate-700">{safeCustomer.name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
                  {safeCustomer.name}
                </h1>
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-50 shadow-md shadow-indigo-500/30">
                  <span className="mr-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-100/80">Case Value</span>
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/70 px-3 py-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  Closing Date • Nov 30, 2023
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/70 px-3 py-1">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-[10px] font-semibold text-white flex items-center justify-center">
                    RP
                  </span>
                  <span className="font-medium text-slate-700">Raj Pacharne</span>
                  <span className="text-slate-400">Owner</span>
                </span>
                <button
                  onClick={() => setFollow((f) => !f)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition duration-150 ${
                    follow
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
                      : "border-slate-300/80 bg-white/60 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${follow ? "bg-emerald-500" : "bg-slate-300"}`} />
                  {follow ? "Following" : "Follow record"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition duration-150 hover:translate-y-[1px] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                <CreditCard className="h-4 w-4" />
                Collect Payment
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-sky-500/80 bg-sky-50/80 px-4 py-2 text-sm font-medium text-sky-900 shadow-sm shadow-sky-500/20 transition duration-150 hover:bg-sky-100 hover:shadow-md">
                <Mail className="h-4 w-4" />
                Send Mail
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-3 py-2 text-xs font-medium text-slate-800 shadow-sm transition duration-150 hover:border-indigo-400 hover:text-indigo-700">
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                  Current Stage
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                  <PauseCircle className="h-3.5 w-3.5" />
                  On Hold
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Tracking case journey across all legal and billing stages
              </div>
            </div>

            <div className="relative flex items-center gap-4 overflow-x-auto pb-2">
              <div className="absolute inset-x-10 top-1/2 -z-10 h-[2px] translate-y-[-50%] rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
              {statuses.map((s, i) => {
                const currentIndex = statuses.indexOf(currentStage);
                const completed = currentIndex > i;
                const isCurrent = currentStage === s;
                const isFinalWon = s === "Closed Won";
                const isFinalLost = s === "Closed Lost";
                const isHold = s === "Hold Account";

                return (
                  <div key={s} className="relative flex items-center gap-3 pr-4">
                    <div
                      onClick={() => handleStageChange(s)}
                      title={s}
                      className={`flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 ${
                        completed
                          ? "border-emerald-400 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-emerald-50 shadow-emerald-500/30"
                          : isCurrent
                          ? "border-indigo-400 bg-gradient-to-r from-indigo-600 to-sky-600 text-slate-50 shadow-indigo-500/40 ring-2 ring-indigo-400/40"
                          : isFinalWon
                          ? "border-emerald-500/50 bg-emerald-50 text-emerald-800"
                          : isFinalLost
                          ? "border-rose-400/70 bg-rose-50 text-rose-800"
                          : isHold
                          ? "border-amber-400/70 bg-amber-50 text-amber-800"
                          : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          completed
                            ? "bg-emerald-50 text-emerald-700"
                            : isCurrent
                            ? "bg-white/20 text-slate-50 ring-1 ring-white/40"
                            : isFinalWon
                            ? "bg-emerald-100 text-emerald-700"
                            : isFinalLost
                            ? "bg-rose-100 text-rose-700"
                            : isHold
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                      </div>
                      <span className="whitespace-nowrap">{s}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="mb-5 space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Related Bank
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-semibold text-white shadow-md shadow-emerald-500/30">
                      AH
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Aspir Housing Finance
                      </div>
                      <div className="text-xs text-slate-500">Rahuri Branch</div>
                    </div>
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Case Summary
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs text-slate-700">
                    {customer?.description || "No description added yet for this customer case."}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Financial Snapshot
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                      <span className="text-slate-500">Outstanding Amount</span>
                      <span className="font-semibold text-slate-900">--</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                      <span className="text-slate-500">Required Amount</span>
                      <span className="font-semibold text-slate-900">--</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 border-t border-dashed border-slate-200 pt-3 text-[11px] text-slate-500">
                  Last modified on {lastModified.toLocaleDateString(undefined, { weekday: "long" })},{" "}
                  {lastModified.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
                <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3 text-xs font-medium text-slate-600">
                  {[
                    { key: "timeline", label: "Timeline" },
                    { key: "notes", label: "Notes" },
                    { key: "activities", label: "Activities", count: tasks.length },
                    { key: "stageHistory", label: "Stage History", count: stageHistory.length },
                    { key: "files", label: "Files", count: docs.length },
                    { key: "products", label: "Products", count: products.length },
                    { key: "emails", label: "Emails" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`relative rounded-full px-3 py-1.5 transition-all duration-150 ${
                        activeTab === t.key
                          ? "bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/30"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{t.label}</span>
                        {t.count ? (
                          <span
                            className={`inline-flex h-4 min-w-[1.25rem] items-center justify-center rounded-full border px-1 text-[10px] ${
                              activeTab === t.key
                                ? "border-slate-500/70 bg-slate-800 text-slate-100"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }`}
                          >
                            {t.count}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>

              {activeTab === "timeline" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Activity Timeline</div>
                    <div className="text-xs text-slate-500">Most recent stage changes appear on top</div>
                  </div>
                  <div className="space-y-6">
                    {timelineGroups.map((group) => (
                      <div key={group.key} className="relative pl-4">
                        <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-emerald-400/40 via-slate-200 to-transparent" />
                        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <span>{group.key}</span>
                        </div>
                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-emerald-400/70 hover:shadow-md"
                            >
                              <div className="mt-0.5 w-16 text-[11px] tabular-nums text-slate-400">
                                {new Date(item.time).toLocaleTimeString()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-sm font-medium text-slate-900">{item.message}</div>
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                    Stage update
                                  </span>
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500">
                                  by <span className="font-medium text-slate-700">{item.actor}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Notes</div>
                    <div className="text-xs text-slate-500">Keep key context and decisions attached to this case</div>
                  </div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="What's this note about?"
                    className="h-40 w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-sm text-slate-800 shadow-inner shadow-slate-200/60 outline-none transition focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!noteText.trim()) return;
                        setNotes((prev) => [{ id: Date.now(), title: noteTitle || "Note", text: noteText, file: noteFile }, ...prev]);
                        setNoteText("");
                        setNoteTitle("");
                        setNoteFile(null);
                      }}
                      className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:translate-y-[1px] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNoteText("");
                        setNoteTitle("");
                        setNoteFile(null);
                      }}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                      <PaperclipIcon />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setNoteFile(e.target.files?.[0] || null)}
                      />
                      Attach file
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="ml-auto w-56 rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="Add a Title"
                    />
                  </div>
                  <div className="mt-6 space-y-3">
                    {notes.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
                        This record doesn&apos;t have any notes yet. Capture important context and decisions here.
                      </div>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                        >
                          <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                          <div className="mt-1 text-sm text-slate-700">{n.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "activities" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {["tasks", "events", "calls"].map((k) => (
                        <button
                          key={k}
                          onClick={() => setActivitiesTab(k)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            activitiesTab === k
                              ? "bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/40"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {k[0].toUpperCase() + k.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-1.5 py-1 text-[11px] text-slate-700 shadow-sm shadow-slate-200/70">
                      <button
                        onClick={openTaskCreate}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 hover:text-indigo-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Task</span>
                      </button>
                      <button
                        onClick={openEventCreate}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 hover:text-indigo-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Event</span>
                      </button>
                      <button
                        onClick={openCallCreate}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 hover:text-indigo-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>

                  {activitiesTab === "tasks" && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-950/[0.01] shadow-sm">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Task Name
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Task Owner
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Description
                            </th>
                            {taskColumnConfig.priority && (
                              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Priority
                              </th>
                            )}
                            {taskColumnConfig.expenseAmount && (
                              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Expense Amount
                              </th>
                            )}
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Action
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              <button
                                type="button"
                                onClick={() => setIsTaskConfigOpen(true)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                title="Customize columns"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white/90">
                          {tasks.map((t) => (
                            <tr key={t.id} className="transition hover:bg-slate-50/80">
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-indigo-700">
                                {t.name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                {t.dueDate}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                  {t.status}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{t.owner}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                {t.description || "—"}
                              </td>
                              {taskColumnConfig.priority && (
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{t.priority || "—"}</td>
                              )}
                              {taskColumnConfig.expenseAmount && (
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{t.expenseAmount || "—"}</td>
                              )}
                              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-slate-400">—</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activitiesTab === "events" && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-950/[0.01] shadow-sm">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Title
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              From
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              To
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Host
                            </th>
                            {eventColumnConfig.location && (
                              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Location
                              </th>
                            )}
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Action
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              <button
                                type="button"
                                onClick={() => setIsEventConfigOpen(true)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                title="Customize columns"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white/90">
                          {events.length === 0 ? (
                            <tr>
                              <td className="px-4 py-4 text-center text-xs text-slate-500" colSpan={eventColumnConfig.location ? 7 : 6}>
                                No events yet. Use + Event to create one.
                              </td>
                            </tr>
                          ) : (
                            events.map((e) => (
                              <tr key={e.id} className="transition hover:bg-slate-50/80">
                                <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-indigo-700">
                                  {e.name || e.title}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{e.from || e.date}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{e.to || "—"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{e.owner || e.host || "Simran Singh"}</td>
                                {eventColumnConfig.location && (
                                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{e.location || "—"}</td>
                                )}
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                                    >
                                      <TrashIcon />
                                    </button>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-slate-400">—</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activitiesTab === "calls" && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-950/[0.01] shadow-sm">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              To / From
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Call Type
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Call Start Time
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Modified Time
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Call Owner
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Call Duration
                            </th>
                            {callColumnConfig.purpose && (
                              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Call Purpose
                              </th>
                            )}
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Action
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              <button
                                type="button"
                                onClick={() => setIsCallConfigOpen(true)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                title="Customize columns"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white/90">
                          {calls.length === 0 ? (
                            <tr>
                              <td className="px-4 py-4 text-center text-xs text-slate-500" colSpan={callColumnConfig.purpose ? 9 : 8}>
                                No calls yet. Use + Call to create one.
                              </td>
                            </tr>
                          ) : (
                            calls.map((c) => (
                              <tr key={c.id} className="transition hover:bg-slate-50/80">
                                <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-indigo-700">
                                  {c.toFrom || c.subject}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.callType || "Outbound"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.startTime || c.date}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.modifiedTime || "—"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.owner || "Simran Singh"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.duration || "—"}</td>
                                {callColumnConfig.purpose && (
                                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{c.callPurpose || "—"}</td>
                                )}
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                                    >
                                      <TrashIcon />
                                    </button>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-slate-400">—</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "stageHistory" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Stage History</div>
                    <div className="text-xs text-slate-500">How long the case spent in each stage</div>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-950/[0.01] shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50/80">
                        <tr>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Stage
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Stage Duration (Days)
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Modified By
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/90">
                        {stageHistory.map((row, idx) => (
                          <tr
                            key={row.id}
                            className={`transition ${idx === 0 ? "bg-indigo-50/50" : "hover:bg-slate-50/80"}`}
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-900">
                              {row.stage}
                              {idx === 0 ? " (Current Stage)" : ""}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{formatCurrency(row.amount)}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                                  <div
                                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                    style={{ width: `${Math.min(100, (row.durationDays || 1) * 10)}%` }}
                                  />
                                </div>
                                <span className="w-8 text-right tabular-nums">{row.durationDays}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{row.modifiedBy}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{new Date(row.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "files" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Cases &amp; Files</div>
                    <button
                      onClick={() => setIsCaseModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg"
                    >
                      <Plus className="h-4 w-4" /> Create Case
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {cases.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-300 hover:bg-slate-50 hover:shadow-md"
                      >
                        <button
                          type="button"
                          onClick={() => openCaseViewer(item.id)}
                          className="flex flex-1 items-center gap-3 text-left"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                            <FolderIcon />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">
                              {item.title || item.caseNumber || `Case #${item.id}`}
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveCase(item.id)}
                            className="rounded-full p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Remove case"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                    {cases.length === 0 && (
                      <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
                        No cases yet. Click <span className="font-semibold">Create Case</span> to add one.
                      </p>
                    )}
                  </div>

                  {selectedCaseId && (
                    <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-inner shadow-slate-200/80">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-slate-500">Selected Case</div>
                          <div className="text-base font-semibold text-slate-900">
                            {caseData?.title || caseData?.caseNumber || `Case #${selectedCaseId}`}
                          </div>
                        </div>
                      </div>
                      <form onSubmit={uploadDoc} className="mt-4 flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          className="w-64 rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400"
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          placeholder="Enter document name"
                        />
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                          className="text-xs file:mr-2 file:rounded-full file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                          ref={caseFileInputRef}
                        />
                        <button
                          type="submit"
                          disabled={uploadingDoc || !docFile}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:shadow-none"
                        >
                          <Upload className="h-4 w-4" />
                          {uploadingDoc ? "Uploading..." : "Upload Document"}
                        </button>
                      </form>

                      <div className="mt-4">
                        {docs.length === 0 ? (
                          <p className="text-xs text-slate-500">No documents uploaded. Use Upload Document to add a PDF.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {docs.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-300 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-sm">
                                    <PdfIcon />
                                  </div>
                                  <div>
                                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                                      {doc.documentName || "Document"}
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">
                                      {doc.fileName || "File"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => viewDoc(doc)}
                                    className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                                    title="View document"
                                  >
                                    <Eye className="h-4 w-4" /> View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadDoc(doc)}
                                    className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                                    title="Download document"
                                  >
                                    <Download className="h-4 w-4" /> Download
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeDoc(doc.id)}
                                    className="rounded-full p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                                    title="Remove document"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {viewingDoc && (
                    <>
                      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm" onClick={closeDocViewer} />
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-slate-950/95 shadow-2xl shadow-slate-950/70">
                          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3">
                            <div>
                              <h3 className="text-sm font-semibold text-slate-50">
                                {viewingDoc.documentName || viewingDoc.fileName || "Document"}
                              </h3>
                              <p className="text-xs text-slate-400">{viewingDoc.fileName}</p>
                            </div>
                            <button
                              type="button"
                              onClick={closeDocViewer}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex-1 bg-slate-900 p-1">
                            <iframe
                              src={`http://localhost:8080/api/case-documents/view/${viewingDoc.id}`}
                              className="h-full w-full rounded-lg border-0 bg-slate-900"
                              title="PDF Viewer"
                              style={{ minHeight: 'calc(90vh - 80px)' }}
                              onError={(e) => {
                                window.open(`http://localhost:8080/api/case-documents/view/${viewingDoc.id}`, '_blank');
                                e.target.style.display = 'none';
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'flex items-center justify-center h-full text-red-600';
                                errorDiv.innerHTML = '<div class="text-center"><p class="text-lg font-medium">PDF Viewer Error</p><p class="text-sm mt-2">Opening in new tab...</p></div>';
                                e.target.parentNode.appendChild(errorDiv);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "products" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Products</div>
                    <div className="text-xs text-slate-500">Billing-grade view of charges linked to this case</div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950/[0.01] shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50/80">
                        <tr>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            List Price (₹)
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Discount
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Tax
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Final Amount (₹)
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/90">
                        {products.map((p) => (
                          <tr key={p.id} className="transition hover:bg-slate-50/80">
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-900">
                              <span className="inline-flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[10px] font-bold text-white shadow-sm">
                                  {p.code}
                                </span>
                                {p.name}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{p.price.toLocaleString("en-IN")}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{p.qty.toFixed(2)}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{p.discount.toLocaleString("en-IN")}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">{(p.tax || 0).toLocaleString("en-IN")}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-900">
                              {(p.price * p.qty - (p.discount || 0) + (p.tax || 0)).toLocaleString("en-IN")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={openProductModal}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 shadow-sm transition hover:border-indigo-400 hover:text-indigo-700"
                    >
                      <Plus className="h-4 w-4" /> Product
                    </button>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-md shadow-slate-900/40">
                      <span className="text-slate-400">Grand Total</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "emails" && (
                <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Emails</div>
                    <div className="text-xs text-slate-500">Send and track emails directly from this case</div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="To"
                      defaultValue={customer?.email || ""}
                    />
                    <input
                      type="text"
                      className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="Subject"
                    />
                    <textarea
                      className="h-40 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 shadow-inner shadow-slate-200/60 focus:border-indigo-400 focus:bg-white"
                      placeholder="Compose your message"
                    />
                    <div className="flex items-center justify-end gap-3">
                      <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50">
                        Save Draft
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/40 transition hover:translate-y-[1px] hover:shadow-lg">
                        <Mail className="h-4 w-4" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isProductModalOpen && (
          <>
            <div
              className="fixed inset-0 z-[65] bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
              onClick={closeProductModal}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
              <div
                className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/50 animate-[scaleIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between border-b border-slate-200/80 px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Add Product</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Select a product and configure pricing for this case
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[70vh] flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    {productFormError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {productFormError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-700">Product</label>
                      <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => {
                            setProductSearch(e.target.value);
                            setProductFormError("");
                          }}
                          placeholder="Search products by name or code"
                          className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1 text-xs">
                          {productCatalog
                            .filter((p) => {
                              if (!productSearch.trim()) return true;
                              const q = productSearch.trim().toLowerCase();
                              return (
                                p.name.toLowerCase().includes(q) ||
                                p.code.toLowerCase().includes(q)
                              );
                            })
                            .map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setProductForm((prev) => ({
                                    ...prev,
                                    productId: String(p.id),
                                    productName: p.name,
                                    productCode: p.code,
                                    listPrice: String(p.price),
                                  }));
                                  setProductSearch(`${p.name} (${p.code})`);
                                  setProductFormError("");
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-100 ${
                                  productForm.productId === String(p.id)
                                    ? "bg-slate-900 text-slate-50 hover:bg-slate-900/90"
                                    : "text-slate-700"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[10px] font-semibold text-white">
                                    {p.code}
                                  </span>
                                  <span>{p.name}</span>
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {p.price.toLocaleString("en-IN")}
                                </span>
                              </button>
                            ))}
                        </div>

                        {productForm.productName && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>
                              Selected: {productForm.productName}
                              {productForm.productCode ? ` (${productForm.productCode})` : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700">List Price (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.listPrice}
                          onChange={(e) => {
                            setProductForm((prev) => ({ ...prev, listPrice: e.target.value }));
                            setProductFormError("");
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.quantity}
                          onChange={(e) => {
                            setProductForm((prev) => ({ ...prev, quantity: e.target.value }));
                            setProductFormError("");
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700">Discount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.discount}
                          onChange={(e) => setProductForm((prev) => ({ ...prev, discount: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700">Tax (₹, optional)</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.tax}
                          onChange={(e) => setProductForm((prev) => ({ ...prev, tax: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700">Final Amount (₹)</label>
                      <input
                        type="text"
                        readOnly
                        value={productFinalAmount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeProductModal}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveProductFromModal}
                      className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg"
                    >
                      Save Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {(isTaskCreateOpen || isEventCreateOpen || isCallCreateOpen || isTaskConfigOpen || isEventConfigOpen || isCallConfigOpen) && (
          <div
            className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => {
              closeTaskCreate();
              closeEventCreate();
              closeCallCreate();
              closeAllConfigSidebars();
            }}
          />
        )}

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[460px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isTaskCreateOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Create Task</div>
                  <div className="mt-0.5 text-xs text-slate-500">Add a new task for this customer</div>
                </div>
                <button
                  type="button"
                  onClick={closeTaskCreate}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Task Name</label>
                  <input
                    value={taskForm.name}
                    onChange={(e) => setTaskForm((p) => ({ ...p, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Enter task name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Due Date</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Related To</label>
                    <input
                      value={taskForm.relatedTo}
                      onChange={(e) => setTaskForm((p) => ({ ...p, relatedTo: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                      placeholder={safeCustomer.name}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Repeat</label>
                    <select
                      value={taskForm.repeat}
                      onChange={(e) => setTaskForm((p) => ({ ...p, repeat: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Never</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Reminder</label>
                    <select
                      value={taskForm.reminder}
                      onChange={(e) => setTaskForm((p) => ({ ...p, reminder: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>None</option>
                      <option>5 minutes before</option>
                      <option>15 minutes before</option>
                      <option>1 hour before</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Task Status</label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
                    className="mt-1 h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Add details / notes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Expense Amount</label>
                    <input
                      value={taskForm.expenseAmount}
                      onChange={(e) => setTaskForm((p) => ({ ...p, expenseAmount: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={taskForm.completed}
                        onChange={(e) => setTaskForm((p) => ({ ...p, completed: e.target.checked }))}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Mark as completed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTaskCreate}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveTask}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[460px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isEventCreateOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Create Event</div>
                  <div className="mt-0.5 text-xs text-slate-500">Schedule an event</div>
                </div>
                <button
                  type="button"
                  onClick={closeEventCreate}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Title</label>
                  <input
                    value={eventForm.title}
                    onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">From</label>
                    <input
                      type="datetime-local"
                      value={eventForm.from}
                      onChange={(e) => setEventForm((p) => ({ ...p, from: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">To</label>
                    <input
                      type="datetime-local"
                      value={eventForm.to}
                      onChange={(e) => setEventForm((p) => ({ ...p, to: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                  Working hours warning: please ensure timing is within business hours.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Repeat</label>
                    <select
                      value={eventForm.repeat}
                      onChange={(e) => setEventForm((p) => ({ ...p, repeat: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Never</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Reminder</label>
                    <select
                      value={eventForm.reminder}
                      onChange={(e) => setEventForm((p) => ({ ...p, reminder: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>None</option>
                      <option>15 minutes before</option>
                      <option>1 hour before</option>
                      <option>1 day before</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Location</label>
                    <input
                      value={eventForm.location}
                      onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="Meeting room / link"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Related To</label>
                    <input
                      value={eventForm.relatedTo}
                      onChange={(e) => setEventForm((p) => ({ ...p, relatedTo: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                      placeholder={safeCustomer.name}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Participants</label>
                  <input
                    value={eventForm.participants}
                    onChange={(e) => setEventForm((p) => ({ ...p, participants: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Add participants"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))}
                    className="mt-1 h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Agenda / notes"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEventCreate}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEvent}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[460px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isCallCreateOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Create Call</div>
                  <div className="mt-0.5 text-xs text-slate-500">Log a call activity</div>
                </div>
                <button
                  type="button"
                  onClick={closeCallCreate}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700">To / From</label>
                  <input
                    value={callForm.toFrom}
                    onChange={(e) => setCallForm((p) => ({ ...p, toFrom: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Contact name / number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Call Start Time</label>
                    <input
                      type="datetime-local"
                      value={callForm.startTime}
                      onChange={(e) => setCallForm((p) => ({ ...p, startTime: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Reminder</label>
                    <select
                      value={callForm.reminder}
                      onChange={(e) => setCallForm((p) => ({ ...p, reminder: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>None</option>
                      <option>15 minutes before</option>
                      <option>1 hour before</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Call Type</label>
                    <select
                      value={callForm.callType}
                      onChange={(e) => setCallForm((p) => ({ ...p, callType: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Outbound</option>
                      <option>Inbound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Call Status</label>
                    <select
                      value={callForm.callStatus}
                      onChange={(e) => setCallForm((p) => ({ ...p, callStatus: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                    >
                      <option>Planned</option>
                      <option>Completed</option>
                      <option>Missed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Related To</label>
                    <input
                      value={callForm.relatedTo}
                      onChange={(e) => setCallForm((p) => ({ ...p, relatedTo: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400"
                      placeholder={safeCustomer.name}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Call Duration</label>
                    <input
                      value={callForm.duration}
                      onChange={(e) => setCallForm((p) => ({ ...p, duration: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                      placeholder="e.g. 05:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Call Purpose</label>
                  <input
                    value={callForm.callPurpose}
                    onChange={(e) => setCallForm((p) => ({ ...p, callPurpose: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Purpose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Call Agenda</label>
                  <textarea
                    value={callForm.callAgenda}
                    onChange={(e) => setCallForm((p) => ({ ...p, callAgenda: e.target.value }))}
                    className="mt-1 h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                    placeholder="Agenda / notes"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCallCreate}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCall}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:translate-y-[1px] hover:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isTaskConfigOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Task table settings</div>
                  <div className="mt-0.5 text-xs text-slate-500">Enable/disable columns</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTaskConfigOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">Priority</span>
                  <input
                    type="checkbox"
                    checked={taskColumnConfig.priority}
                    onChange={(e) => setTaskColumnConfig((p) => ({ ...p, priority: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">Expense Amount</span>
                  <input
                    type="checkbox"
                    checked={taskColumnConfig.expenseAmount}
                    onChange={(e) => setTaskColumnConfig((p) => ({ ...p, expenseAmount: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskConfigOpen(false)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isEventConfigOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Event table settings</div>
                  <div className="mt-0.5 text-xs text-slate-500">Enable/disable columns</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEventConfigOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">Location</span>
                  <input
                    type="checkbox"
                    checked={eventColumnConfig.location}
                    onChange={(e) => setEventColumnConfig((p) => ({ ...p, location: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventConfigOpen(false)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] transform bg-white shadow-2xl shadow-slate-900/30 transition-transform duration-300 ease-out ${
            isCallConfigOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Call table settings</div>
                  <div className="mt-0.5 text-xs text-slate-500">Enable/disable columns</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCallConfigOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">Call Purpose</span>
                  <input
                    type="checkbox"
                    checked={callColumnConfig.purpose}
                    onChange={(e) => setCallColumnConfig((p) => ({ ...p, purpose: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCallConfigOpen(false)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {isCaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/70">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">Create New Case</h2>
                  <p className="text-xs text-slate-500">Link a new legal/billing case to this customer</p>
                </div>
                <button
                  onClick={() => setIsCaseModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300">Case Name</label>
                  <input
                    type="text"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    className="mt-1 w-full rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-400"
                    placeholder="Enter case name"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCaseModalOpen(false)}
                    className="rounded-full border border-slate-600 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 hover:translate-y-[1px] hover:shadow-lg"
                  >
                    Add Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>

  );
}

function PaperclipIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.19 9.19a2 2 0 01-2.83-2.83l9.19-9.19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h3.5a2 2 0 011.6.8l1.3 1.733A1 1 0 0011.5 7H16a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8.5a2 2 0 001.414-.586l3.5-3.5A2 2 0 0018 13.5V4a2 2 0 00-2-2H4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM8 8a1 1 0 012 0v7a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v7a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
