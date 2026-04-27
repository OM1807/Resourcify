import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import {
  incidents as seedIncidents,
  volunteers as seedVolunteers,
  type Incident,
  type IncidentStatus,
  type Volunteer,
} from "./mock-data";

export interface ProofPhoto {
  id: string;
  incidentId: string;
  name: string;
  dataUrl: string;
  uploadedAt: number;
  verified: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: number;
  read: boolean;
  kind: "critical" | "info" | "success";
}

interface AppStore {
  incidents: Incident[];
  volunteers: Volunteer[];
  assignments: Record<string, string>; // incidentId -> volunteerId
  proofs: ProofPhoto[];
  notifications: Notification[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  assignVolunteer: (incidentId: string, volunteerId: string) => void;
  autoAssignAll: () => number;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  addProof: (incidentId: string, name: string, dataUrl: string) => void;
  removeProof: (proofId: string) => void;
  addIncident: (incident: Incident) => void;
  markNotificationsRead: () => void;
}

const Ctx = createContext<AppStore | null>(null);

const initialNotifications: Notification[] = [
  { id: "n1", title: "Critical incident reported", body: "INC-2041 · Flood victims in Chennai", time: Date.now() - 1000 * 60 * 2, read: false, kind: "critical" },
  { id: "n2", title: "Volunteer accepted", body: "Aarav Mehta accepted INC-2040", time: Date.now() - 1000 * 60 * 9, read: false, kind: "success" },
  { id: "n3", title: "Daily digest ready", body: "8 incidents resolved in last 24h", time: Date.now() - 1000 * 60 * 60, read: true, kind: "info" },
];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(seedIncidents);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(seedVolunteers);
  const [assignments, setAssignments] = useState<Record<string, string>>({
    "INC-2040": "V-01",
    "INC-2039": "V-02",
    "INC-2038": "V-04",
    "INC-2037": "V-05",
  });
  const [proofs, setProofs] = useState<ProofPhoto[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState("");

  const pushNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, time: Date.now(), read: false },
      ...prev,
    ]);
  }, []);

  const assignVolunteer = useCallback((incidentId: string, volunteerId: string) => {
    setAssignments((prev) => ({ ...prev, [incidentId]: volunteerId }));
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId && i.status === "reported" ? { ...i, status: "assigned" } : i)),
    );
    setVolunteers((prev) => prev.map((v) => (v.id === volunteerId ? { ...v, status: "on_task" } : v)));
    const v = volunteers.find((x) => x.id === volunteerId);
    pushNotification({
      title: "Volunteer assigned",
      body: `${v?.name ?? "Volunteer"} assigned to ${incidentId}`,
      kind: "success",
    });
  }, [volunteers, pushNotification]);

  const autoAssignAll = useCallback(() => {
    const unassigned = incidents.filter((i) => i.status === "reported" && !assignments[i.id]);
    const available = volunteers.filter((v) => v.status === "available");
    const newAssign: Record<string, string> = {};
    unassigned.forEach((inc, idx) => {
      const v = available[idx % Math.max(available.length, 1)];
      if (v) newAssign[inc.id] = v.id;
    });
    if (Object.keys(newAssign).length === 0) return 0;
    setAssignments((prev) => ({ ...prev, ...newAssign }));
    setIncidents((prev) =>
      prev.map((i) => (newAssign[i.id] ? { ...i, status: "assigned" as IncidentStatus } : i)),
    );
    pushNotification({
      title: "Auto-assignment complete",
      body: `${Object.keys(newAssign).length} incidents matched to volunteers`,
      kind: "success",
    });
    return Object.keys(newAssign).length;
  }, [incidents, assignments, volunteers, pushNotification]);

  const updateIncidentStatus = useCallback((incidentId: string, status: IncidentStatus) => {
    setIncidents((prev) => prev.map((i) => (i.id === incidentId ? { ...i, status } : i)));
    if (status === "resolved") {
      const v = volunteers.find((vv) => vv.id === assignments[incidentId]);
      if (v) {
        setVolunteers((prev) =>
          prev.map((vv) => (vv.id === v.id ? { ...vv, status: "available", completed: vv.completed + 1 } : vv)),
        );
      }
      pushNotification({ title: "Incident resolved", body: `${incidentId} marked as resolved`, kind: "success" });
    }
  }, [assignments, volunteers, pushNotification]);

  const addProof = useCallback((incidentId: string, name: string, dataUrl: string) => {
    setProofs((prev) => [
      { id: `p-${Date.now()}`, incidentId, name, dataUrl, uploadedAt: Date.now(), verified: true },
      ...prev,
    ]);
    pushNotification({ title: "Proof uploaded", body: `${name} verified · +5 reliability`, kind: "info" });
  }, [pushNotification]);

  const removeProof = useCallback((proofId: string) => {
    setProofs((prev) => prev.filter((p) => p.id !== proofId));
  }, []);

  const addIncident = useCallback((incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
    pushNotification({
      title: "New incident received",
      body: `${incident.id} · ${incident.location}`,
      kind: incident.priority === "critical" ? "critical" : "info",
    });
  }, [pushNotification]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<AppStore>(() => ({
    incidents,
    volunteers,
    assignments,
    proofs,
    notifications,
    searchQuery,
    setSearchQuery,
    assignVolunteer,
    autoAssignAll,
    updateIncidentStatus,
    addProof,
    removeProof,
    addIncident,
    markNotificationsRead,
  }), [incidents, volunteers, assignments, proofs, notifications, searchQuery, setSearchQuery, assignVolunteer, autoAssignAll, updateIncidentStatus, addProof, removeProof, addIncident, markNotificationsRead]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

export function rankVolunteersForIncident(volunteers: Volunteer[]) {
  return [...volunteers].sort(
    (a, b) => b.reliability * 2 - b.distanceKm * 0.1 - (a.reliability * 2 - a.distanceKm * 0.1),
  );
}

export function exportIncidentsCsv(incidents: Incident[], assignments: Record<string, string>, volunteers: Volunteer[]) {
  const header = ["id", "title", "location", "priority", "needType", "people", "severity", "status", "assigned_volunteer"];
  const rows = incidents.map((i) => {
    const v = volunteers.find((vv) => vv.id === assignments[i.id]);
    return [i.id, i.title, i.location, i.priority, i.needType, i.peopleAffected, i.severity, i.status, v?.name ?? ""]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(",");
  });
  return [header.join(","), ...rows].join("\n");
}
