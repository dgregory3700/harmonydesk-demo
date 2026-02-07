"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { Invoice, InvoiceStatus } from "@/lib/demo/data/invoices";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        setError(null);

        const data = await demoDataClient.getInvoices();
        setInvoices(data);
      } catch (err: any) {
        console.error("Error loading invoices:", err);
        setError(err?.message ?? "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "All" ? true : inv.status === statusFilter;

      const haystack = (
        inv.invoiceNumber +
        " " +
        inv.clientName +
        " " +
        (inv.caseName ?? "")
      ).toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase().trim());

      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, search]);

  const stats = useMemo(() => {
    const draft = invoices.filter((i) => i.status === "Draft").length;
    const sent = invoices.filter((i) => i.status === "Sent").length;
    const paid = invoices.filter((i) => i.status === "Paid").length;
    const overdue = invoices.filter((i) => i.status === "Overdue").length;
    const totalRevenue = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);

    return { draft, sent, paid, overdue, totalRevenue };
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Invoices
          </h1>
          <p className="text-sm text-slate-400">
            Track invoices, payments, and billing for your mediation sessions.
          </p>
        </div>

        <DemoDisable>
          <Link
            href="/invoices/new"
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            + New invoice
          </Link>
        </DemoDisable>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Draft</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {stats.draft}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Sent</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {stats.sent}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Paid</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {stats.paid}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Overdue</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {stats.overdue}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Total Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Status:</span>

          {["All", "Draft", "Sent", "Paid", "Overdue"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status as any)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                statusFilter === status
                  ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
                  : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, client…"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium text-slate-300">Invoice list</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading invoices…</p>
        ) : error ? (
          <p className="text-sm text-red-400">
            {error || "Something went wrong loading invoices."}
          </p>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-sm text-slate-500">
            No invoices match your filters. Try clearing the search or switching
            status tabs.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 md:flex-row md:items-center md:justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">
                    {inv.invoiceNumber} — {inv.clientName}
                  </p>
                  {inv.caseName && (
                    <p className="text-xs text-slate-400">{inv.caseName}</p>
                  )}
                  {inv.notes && (
                    <p className="text-xs text-slate-500">{inv.notes}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Issued: {formatDate(inv.issueDate)} • Due:{" "}
                    {formatDate(inv.dueDate)}
                    {inv.paidDate && ` • Paid: ${formatDate(inv.paidDate)}`}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 text-xs md:items-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                        inv.status === "Draft"
                          ? "border-slate-500/20 bg-slate-500/10 text-slate-400"
                          : inv.status === "Sent"
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-400"
                          : inv.status === "Paid"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {inv.status}
                    </span>

                    <span className="text-slate-200 font-semibold">
                      {formatCurrency(inv.amount)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      View details
                    </Link>
                    <DemoDisable>
                      <button
                        type="button"
                        className="rounded-md border border-slate-700 bg-transparent px-3 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                      >
                        Send reminder
                      </button>
                    </DemoDisable>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
