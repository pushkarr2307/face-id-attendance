import { supabase } from "@/integrations/supabase/client";

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

// ---- Students ----

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    rollNo: s.roll_no,
    imageUrl: s.face_image_url || "",
  }));
}

export async function addStudent(student: { name: string; rollNo: string; imageUrl: string }): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .insert({
      name: student.name,
      roll_no: student.rollNo,
      face_image_url: student.imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding student:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    rollNo: data.roll_no,
    imageUrl: data.face_image_url || "",
  };
}

export async function updateStudent(id: string, updates: { name?: string; rollNo?: string; imageUrl?: string }): Promise<boolean> {
  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.rollNo !== undefined) payload.roll_no = updates.rollNo;
  if (updates.imageUrl !== undefined) payload.face_image_url = updates.imageUrl;

  const { error } = await supabase.from("students").update(payload).eq("id", id);
  if (error) {
    console.error("Error updating student:", error);
    return false;
  }
  return true;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    console.error("Error deleting student:", error);
    return false;
  }
  return true;
}

export async function uploadFaceImage(file: Blob, studentId: string): Promise<string | null> {
  const fileName = `${studentId}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from("face-images").upload(fileName, file, {
    contentType: "image/jpeg",
    upsert: true,
  });

  if (error) {
    console.error("Error uploading face image:", error);
    return null;
  }

  const { data: urlData } = supabase.storage.from("face-images").getPublicUrl(fileName);
  return urlData.publicUrl;
}

// ---- Attendance ----

export async function getAttendance(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }

  return (data || []).map((a: any) => ({
    id: a.id,
    studentId: a.student_id,
    studentName: a.student_name,
    date: a.date,
    time: a.time,
    status: a.status as "Verified" | "Not Verified",
    verification: a.verification || "",
  }));
}

export async function addAttendance(record: Omit<AttendanceRecord, "id">): Promise<boolean> {
  const { error } = await supabase.from("attendance_records").insert({
    student_id: record.studentId,
    student_name: record.studentName,
    date: record.date,
    time: record.time,
    status: record.status,
    verification: record.verification,
  });

  if (error) {
    console.error("Error adding attendance:", error);
    return false;
  }
  return true;
}

export async function deleteAttendance(id: string): Promise<boolean> {
  const { error } = await supabase.from("attendance_records").delete().eq("id", id);
  if (error) {
    console.error("Error deleting attendance:", error);
    return false;
  }
  return true;
}

// ---- Face Verification ----

export async function verifyFace(capturedImageBase64: string): Promise<{
  matched: boolean;
  studentId?: string;
  studentName?: string;
  confidence?: number;
  message?: string;
}> {
  const { data, error } = await supabase.functions.invoke("verify-face", {
    body: { capturedImageBase64 },
  });

  if (error) {
    console.error("Error verifying face:", error);
    return { matched: false, message: "Verification service error" };
  }

  return data;
}

// ---- Admin (kept local for simplicity) ----

const ADMIN_KEY = "faceid_admin";

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function loginAdmin() {
  localStorage.setItem(ADMIN_KEY, "true");
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}
