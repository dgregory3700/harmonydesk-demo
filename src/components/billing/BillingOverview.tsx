"use client";

import React, { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { DemoDisable } from "@/components/demo/DemoDisable";
import { demoDataClient } from "@/lib/demo/client";
import type { Invoice as InvoiceData } from "@/lib/demo/data/invoices";

type InvoiceStatus = "Draft" | "Sent" | "For county report";

type Invoice = {
  id: string;
  caseNumber: string;
  matter: string;
  contact: string;
  hours: number;
  rate: number;
  status: InvoiceStatus;
  due: string;
};

export default function BillingOverview() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Load demo invoices and convert to billing format
  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        setError(null);
        const data = await demoDataClient.getInvoices();
        
        // Convert to billing format
        const converted = data.map((inv): Invoice => ({
          id: inv.id,
          caseNumber: inv.caseName?.split(' ')[0] || "CASE-001",
          matter: inv.caseName || inv.clientName,
          contact: inv.clientName,
          hours: inv.amount / 250, // Assuming $250/hr
          rate: 250,
          status: inv.status === "Draft" ? "Draft" : inv.status === "Paid" ? "Sent" : "Sent",
          due: inv.dueDate,
        }));
        
        setInvoices(converted);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  // Derived values
  const draftTotal = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Draft")
        .reduce((sum, inv) => sum + inv.hours * inv.rate, 0),
    [invoices]
  );

  const countyInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === "For county report"),
    [invoices]
  );

  const countyTotals = useMemo(
    () => ({
      cases: countyInvoices.length,
      hours: countyInvoices.reduce((sum, inv) => sum + inv.hours, 0),
      amount: countyInvoices.reduce(
        (sum, inv) => sum + inv.hours * inv.rate,
        0
      ),
    }),
    [countyInvoices]
  );

  // Simple preview for invoices (read-only demo)
  function handleViewInvoice(inv: Invoice) {
    const total = inv.hours * inv.rate;
    alert(
      [
        "Invoice details (preview):",
        "",
        `Case: ${inv.caseNumber}`,
        `Matter: ${inv.matter}`,
        `Bill to: ${inv.contact}`,
        `Hours: ${inv.hours.toFixed(2)}`,
        `Rate: $${inv.rate.toFixed(2)}`,
        `Total: $${total.toFixed(2)}`,
        "",
        "Demo mode — read-only",
      ].join("\n")
    );
  }

  function downloadKingCountyCsv() {
    if (countyInvoices.length === 0) return;

    const header = ["Case Number", "Matter", "Bill To", "Hours", "Rate", "Total"];
    const rows = countyInvoices.map((inv) => [
      inv.caseNumber,
      inv.matter,
      inv.contact,
      inv.hours.toString(),
      inv.rate.toFixed(2),
      (inv.hours * inv.rate).toFixed(2),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "king-county-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadPierceCountyPdf() {
    if (countyInvoices.length === 0) return;

    const doc = new jsPDF("landscape", "mm", "letter");
    const marginLeft = 10;
    let cursorY = 20;

    doc.setFontSize(14);
    doc.text(
      "Pierce County District Court - Month End Report",
      marginLeft,
      cursorY
    );

    cursorY += 8;
    doc.setFontSize(11);
    doc.text(
      `Total cases: ${countyTotals.cases}    Total hours: ${countyTotals.hours.toFixed(
        2
      )}    Total amount: $${countyTotals.amount.toFixed(2)}`,
      marginLeft,
      cursorY
    );

    cursorY += 10;

    // Table headers
    doc.setFontSize(10);
    doc.text("Case #", marginLeft, cursorY);
    doc.text("Matter", marginLeft + 40, cursorY);
    doc.text("Hours", marginLeft + 120, cursorY);
    doc.text("Total ($)", marginLeft + 150, cursorY);
    doc.text("Bill To", marginLeft + 190, cursorY);

    cursorY += 6;

    const maxY = 190;

    countyInvoices.forEach((inv) => {
      if (cursorY > maxY) {
        doc.addPage("letter", "landscape");
        cursorY = 20;

        doc.setFontSize(10);
        doc.text("Case #", marginLeft, cursorY);
        doc.text("Matter", marginLeft + 40, cursorY);
        doc.text("Hours", marginLeft + 120, cursorY);
        doc.text("Total ($)", marginLeft + 150, cursorY);
        doc.text("Bill To", marginLeft + 190, cursorY);

        cursorY += 6;
      }

      const total = inv.hours * inv.rate;
      const matterTrunc =
        inv.matter.length > 40
          ? inv.matter.slice(0, 37) + "..."
          : inv.matter;
      const contactTrunc =
        inv.contact.length > 30
          ? inv.contact.slice(0, 27) + "..."
          : inv.contact;

      doc.text(inv.caseNumber, marginLeft, cursorY);
      doc.text(matterTrunc, marginLeft + 40, cursorY);
      doc.text(inv.hours.toFixed(2), marginLeft + 120, cursorY);
      doc.text(total.toFixed(2), marginLeft + 150, cursorY);
      doc.text(contactTrunc, marginLeft + 190, cursorY);

      cursorY += 6;
    });

    doc.save("pierce-county-report.pdf");
  }

  return (
    <div className="space-y-6">
      {/* Header + Draft total */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Client billing
          </h1>
          <p className="text-sm text-slate-400">
            Track mediation sessions, invoices, and county reports.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Draft total</p>
          <p className="text-xl font-semibold text-slate-100">
            ${draftTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Loading invoices…
        </p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* New invoice card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-200">New invoice</h2>
          <DemoDisable>
            <button
              type="button"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              New invoice
            </button>
          </DemoDisable>
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium text-slate-300">Invoices</h2>
        {invoices.length === 0 && !loading ? (
          <p className="text-sm text-slate-500">
            No invoices yet. Use “New invoice” to create your first one.
          </p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const total = inv.hours * inv.rate;
              return (
                <div
                  key={inv.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{inv.matter}</p>
                    <p className="text-xs text-slate-400">
                      {inv.caseNumber} • {inv.contact}
                    </p>
                    <p className="text-xs text-slate-400">
                      {inv.hours.toFixed(2)} hours @ ${inv.rate.toFixed(2)} •{" "}
                      <span className="font-medium text-slate-200">
                        ${total.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {inv.due}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DemoDisable>
                      <select
                        className="rounded-md border border-slate-700 bg-slate-900 text-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={inv.status}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="For county report">
                          For county report
                        </option>
                      </select>
                    </DemoDisable>
                    <button
                      type="button"
                      className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                      onClick={() => handleViewInvoice(inv)}
                    >
                      View invoice
                    </button>
                    <DemoDisable>
                      <button
                        type="button"
                        className="rounded-md border border-slate-700 bg-transparent px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-900/20 hover:border-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </DemoDisable>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* County month-end report */}
      {countyInvoices.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-medium text-slate-200">
                County month-end report preview
              </h2>
              <p className="text-xs text-slate-400">
                {countyTotals.cases} cases • {countyTotals.hours.toFixed(2)}{" "}
                hours • ${countyTotals.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                onClick={downloadKingCountyCsv}
              >
                King County CSV
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                onClick={downloadPierceCountyPdf}
              >
                Pierce County PDF
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-200">
                  <th className="px-2 py-1 font-medium">Case #</th>
                  <th className="px-2 py-1 font-medium">Matter</th>
                  <th className="px-2 py-1 font-medium">Bill to</th>
                  <th className="px-2 py-1 font-medium">Hours</th>
                  <th className="px-2 py-1 font-medium">Rate</th>
                  <th className="px-2 py-1 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {countyInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-2 py-1">{inv.caseNumber}</td>
                    <td className="px-2 py-1">{inv.matter}</td>
                    <td className="px-2 py-1">{inv.contact}</td>
                    <td className="px-2 py-1">
                      {inv.hours.toFixed(2)}
                    </td>
                    <td className="px-2 py-1">
                      ${inv.rate.toFixed(2)}
                    </td>
                    <td className="px-2 py-1">
                      ${(inv.hours * inv.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
