import { backendApi, delay } from "@/services/api";

function buildTeamwiseAttendance(employees) {
  const map = new Map();

  employees.forEach((e) => {
    const teamName = e.teamName || "Unassigned";
    const current = map.get(teamName) || { teamName, punchedIn: 0, punchedOut: 0, total: 0 };

    current.total += 1;
    if (e.punchStatus === "IN") current.punchedIn += 1;
    else current.punchedOut += 1;

    map.set(teamName, current);
  });

  return Array.from(map.values()).sort((a, b) => a.teamName.localeCompare(b.teamName));
}

function buildRealtimeStatus(employees) {
  const totalEmployees = employees.length;
  const punchedIn = employees.filter((e) => e.punchStatus === "IN").length;
  const punchedOut = totalEmployees - punchedIn;
  const punchedInInactive = employees.filter((e) => e.punchStatus === "IN" && !e.isActive).length;

  return {
    totalEmployees,
    punchedIn,
    punchedOut,
    punchedInInactive,
  };
}

export async function getDashboardOverview() {
  await delay(250);

  let employees = [];

  try {
    const rawEmployees = await backendApi.get("/test/employees");

    employees = (rawEmployees || []).map((e) => {
      const name = e.firstName
        ? `${e.firstName} ${e.lastName || ""}`.trim()
        : e.fullName || e.employeeId || e.userId || "-";

      return {
        id: e.id,
        name,
        teamName: e.team?.name || e.teamName || "",
        // Fallbacks for punch/attendance related fields so dashboard still works
        punchStatus: e.punchStatus || "OUT",
        isActive: e.status ? e.status === "ACTIVE" : true,
        lastPunchTime: e.lastPunchTime || null,
        punchMode: e.punchMode || null,
        lastLocation: e.lastLocation || "",
      };
    });
  } catch (err) {
    console.error("Failed to load employees for dashboard", err);
    employees = [];
  }

  const project = {
    name: "Yash Enterprises",
    environment: "Elite",
  };

  const navigation = {
    brand: "YAS",
    activeKey: "dashboard",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/" },
      { key: "attendance", label: "Attendance", icon: "attendance", href: "/attendance" },
      { key: "leaves", label: "Leaves", icon: "leaves", href: "/leaves" },
      { key: "organization", label: "Organization", icon: "org", href: "/organization" },
      { key: "tasks", label: "Tasks", icon: "plus", href: "/tasks" },
      { key: "reports", label: "Reports", icon: "plus", href: "/reports" },
    ],
  };

  const headerTabs = {
    activeTabKey: "overview",
    items: [
      { key: "overview", label: "Overview" },
      { key: "live-location", label: "Live Location" },
      { key: "timeline", label: "Timeline" },
      { key: "card-view", label: "Card View" },
      { key: "compliance", label: "Compliance Status" },
      { key: "site-attendance", label: "Site Attendance" },
    ],
  };

  const user = {
    name: "Dashboard User",
  };

  const notifications = {
    unreadCount: 0,
  };

  const staffingStrength = {
    present: employees.length,
    required: employees.length,
  };

  return {
    project,
    navigation,
    user,
    notifications,
    headerTabs,
    staffingStrength,
    realtimeStatus: buildRealtimeStatus(employees),
    teamwiseAttendance: buildTeamwiseAttendance(employees),
    employees,
    offDutyEmployees: [],
  };
}

export async function getEmployees() {
  await delay(200);
  return backendApi.get("/test/employees");
}

export async function getOffDutyEmployees() {
  await delay(200);
  return [];
}
