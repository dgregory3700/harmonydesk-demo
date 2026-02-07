// src/lib/demo/client.ts
// Demo data client - provides async methods that return local fixtures
// NO fetch calls, NO network requests

import { demoCases, type MediationCase } from "./data/cases";
import { demoClients, type Client } from "./data/clients";
import { demoMessages, type Message } from "./data/messages";
import { demoSessions, type MediationSession } from "./data/sessions";
import { demoInvoices, type Invoice } from "./data/invoices";
import { demoUserSettings, type UserSettings } from "./data/settings";

// Simulate network delay for realistic UX
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoDataClient = {
  // Cases
  async getCases(): Promise<MediationCase[]> {
    await delay();
    return [...demoCases];
  },

  async getCaseById(id: string): Promise<MediationCase | null> {
    await delay();
    return demoCases.find((c) => c.id === id) ?? null;
  },

  // Clients
  async getClients(): Promise<Client[]> {
    await delay();
    return [...demoClients];
  },

  async getClientById(id: string): Promise<Client | null> {
    await delay();
    return demoClients.find((c) => c.id === id) ?? null;
  },

  // Messages
  async getMessages(): Promise<Message[]> {
    await delay();
    return [...demoMessages];
  },

  async getMessageById(id: string): Promise<Message | null> {
    await delay();
    return demoMessages.find((m) => m.id === id) ?? null;
  },

  // Sessions (Calendar)
  async getSessions(): Promise<MediationSession[]> {
    await delay();
    return [...demoSessions];
  },

  async getSessionById(id: string): Promise<MediationSession | null> {
    await delay();
    return demoSessions.find((s) => s.id === id) ?? null;
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    await delay();
    return [...demoInvoices];
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    await delay();
    return demoInvoices.find((i) => i.id === id) ?? null;
  },

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    await delay();
    return { ...demoUserSettings };
  },
};
