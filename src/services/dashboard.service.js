import { mockDashboardData } from "@/data/mockDashboardData";
import { delay } from "@/services/api";

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

  const employees = mockDashboardData.employees;

  return {
    project: mockDashboardData.project,
    navigation: mockDashboardData.navigation,
    user: mockDashboardData.user,
    notifications: mockDashboardData.notifications,
    headerTabs: mockDashboardData.headerTabs,
    staffingStrength: mockDashboardData.staffingStrength,
    realtimeStatus: buildRealtimeStatus(employees),
    teamwiseAttendance: buildTeamwiseAttendance(employees),
    employees,
    offDutyEmployees: mockDashboardData.offDutyEmployees,
  };
}

export async function getEmployees() {
  await delay(200);
  return mockDashboardData.employees;
}

export async function getOffDutyEmployees() {
  await delay(200);
  return mockDashboardData.offDutyEmployees;
}
