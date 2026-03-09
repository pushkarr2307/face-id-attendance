import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LogIn, LogOut, Users, ClipboardList, Plus, Trash2, Edit2, X, Upload,
  CheckCircle, XCircle, Calendar, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import {
  getStudents, saveStudents, getAttendance, deleteAttendance,
  isAdminLoggedIn, loginAdmin, logoutAdmin, Student, AttendanceRecord
} from "@/lib/attendanceStore";

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"students" | "attendance">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formRoll, setFormRoll] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loggedIn) {
      setStudents(getStudents());
      setAttendance(getAttendance());
    }
  }, [loggedIn]);

  const filteredAttendance = useMemo(() => {
    let filtered = attendance;
    if (dateFilter) {
      filtered = filtered.filter(a => a.date === new Date(dateFilter).toLocaleDateString());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.studentName.toLowerCase().includes(q));
    }
    return filtered;
  }, [attendance, dateFilter, searchQuery]);

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      loginAdmin();
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Use admin / admin123");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setLoggedIn(false);
  };

  const handleAddStudent = () => {
    if (!formName || !formRoll) return;
    const updated = [
      ...students,
      { id: crypto.randomUUID(), name: formName, rollNo: formRoll, imageUrl: "" },
    ];
    saveStudents(updated);
    setStudents(updated);
    setFormName("");
    setFormRoll("");
    setShowAdd(false);
  };

  const handleEditStudent = (id: string) => {
    if (!formName || !formRoll) return;
    const updated = students.map((s) =>
      s.id === id ? { ...s, name: formName, rollNo: formRoll } : s
    );
    saveStudents(updated);
    setStudents(updated);
    setEditId(null);
    setFormName("");
    setFormRoll("");
  };

  const handleDelete = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    setStudents(updated);
  };

  const handleDeleteAttendance = (id: string) => {
    deleteAttendance(id);
    setAttendance(getAttendance());
  };

  const startEdit = (s: Student) => {
    setEditId(s.id);
    setFormName(s.name);
    setFormRoll(s.rollNo);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <ParticleBackground />
        <Navbar />
        <div className="pt-28 pb-20 flex items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card rounded-2xl border border-border p-8 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 glow-primary">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Admin Login</h2>
              <p className="text-sm text-muted-foreground mt-1">Access the attendance dashboard</p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-secondary border-border text-foreground"
              />
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <Button
                onClick={handleLogin}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />

      <div className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Manage students and attendance records</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students", value: students.length, color: "text-primary" },
              { label: "Today's Attendance", value: attendance.filter(a => a.date === new Date().toLocaleDateString()).length, color: "text-success" },
              { label: "Total Records", value: attendance.length, color: "text-warning" },
              { label: "Verified", value: attendance.filter(a => a.status === "Verified").length, color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="bg-gradient-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-300">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setTab("students")}
              variant={tab === "students" ? "default" : "outline"}
              className={tab === "students" ? "bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}
            >
              <Users className="h-4 w-4 mr-2" />
              Students
            </Button>
            <Button
              onClick={() => setTab("attendance")}
              variant={tab === "attendance" ? "default" : "outline"}
              className={tab === "attendance" ? "bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Attendance
            </Button>
          </div>

          {/* Students Tab */}
          {tab === "students" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => { setShowAdd(true); setFormName(""); setFormRoll(""); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>

              {showAdd && (
                <div className="bg-gradient-card rounded-xl border border-border p-4 mb-4 flex flex-wrap gap-3 items-end">
                  <Input placeholder="Student Name" value={formName} onChange={(e) => setFormName(e.target.value)} className="bg-secondary border-border text-foreground flex-1 min-w-[200px]" />
                  <Input placeholder="Roll Number" value={formRoll} onChange={(e) => setFormRoll(e.target.value)} className="bg-secondary border-border text-foreground flex-1 min-w-[200px]" />
                  <Button onClick={handleAddStudent} className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
                  <Button onClick={() => setShowAdd(false)} variant="outline" className="border-border text-foreground"><X className="h-4 w-4" /></Button>
                </div>
              )}

              <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Roll No</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        {editId === s.id ? (
                          <>
                            <td className="px-4 py-3">
                              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="bg-secondary border-border text-foreground h-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Input value={formRoll} onChange={(e) => setFormRoll(e.target.value)} className="bg-secondary border-border text-foreground h-8" />
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <Button size="sm" onClick={() => handleEditStudent(s.id)} className="bg-primary text-primary-foreground h-8">Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="border-border text-foreground h-8"><X className="h-3 w-3" /></Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-sm text-foreground">{s.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{s.rollNo}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => startEdit(s)} className="border-border text-foreground h-8"><Edit2 className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete(s.id)} className="border-destructive text-destructive h-8"><Trash2 className="h-3 w-3" /></Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No students registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Attendance Tab */}
          {tab === "attendance" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-secondary border-border text-foreground pl-9"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-secondary border-border text-foreground pl-9 w-[200px]"
                  />
                </div>
                {(dateFilter || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={() => { setDateFilter(""); setSearchQuery(""); }}
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>

              <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Verification</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{a.studentName}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.date}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{a.time}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            a.status === "Verified"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {a.status === "Verified" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {a.verification || "Face Match"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAttendance(a.id)}
                            className="border-destructive text-destructive h-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredAttendance.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          {dateFilter || searchQuery ? "No records match your filters." : "No attendance records yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
