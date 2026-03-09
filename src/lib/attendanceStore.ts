// Simple in-memory store for demo purposes
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  imageUrl: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: "Verified" | "Not Verified";
  verification: string;
}

const STUDENTS_KEY = "faceid_students";
const ATTENDANCE_KEY = "faceid_attendance";
const ADMIN_KEY = "faceid_admin";

const defaultStudents: Student[] = [
  { id: "1", name: "Rahul Sharma", rollNo: "CS2021001", imageUrl: "" },
  { id: "2", name: "Priya Patel", rollNo: "CS2021002", imageUrl: "" },
  { id: "3", name: "Amit Kumar", rollNo: "CS2021003", imageUrl: "" },
];

export function getStudents(): Student[] {
  const stored = localStorage.getItem(STUDENTS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(defaultStudents));
  return defaultStudents;
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getAttendance(): AttendanceRecord[] {
  const stored = localStorage.getItem(ATTENDANCE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addAttendance(record: Omit<AttendanceRecord, "id">) {
  const records = getAttendance();
  records.push({ ...record, id: crypto.randomUUID() });
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function deleteAttendance(id: string) {
  const records = getAttendance().filter(r => r.id !== id);
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function loginAdmin() {
  localStorage.setItem(ADMIN_KEY, "true");
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}
