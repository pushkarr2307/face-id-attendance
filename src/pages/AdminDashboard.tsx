import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LogIn, LogOut, Users, ClipboardList, Plus, Trash2, Edit2, X, Camera,
  CheckCircle, XCircle, Calendar, Search, Upload, Image, UserPlus, Mail, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import {
  getStudents, addStudent, updateStudent, deleteStudent, uploadFaceImage,
  getAttendance, deleteAttendance,
  Student, AttendanceRecord
} from "@/lib/attendanceStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"students" | "attendance">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Student form state
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formRoll, setFormRoll] = useState("");
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [faceImageBlob, setFaceImageBlob] = useState<Blob | null>(null);
  const [showCapture, setShowCapture] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Verified" | "Rejected">("all");

  // Camera refs for face capture
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [captureStream, setCaptureStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loggedIn = !!session;

  const loadData = useCallback(async () => {
    setLoading(true);
    const [s, a] = await Promise.all([getStudents(), getAttendance()]);
    setStudents(s);
    setAttendance(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loggedIn) loadData();
  }, [loggedIn, loadData]);

  const filteredAttendance = useMemo(() => {
    let filtered = attendance;
    if (dateFilter) {
      filtered = filtered.filter(a => a.date === new Date(dateFilter).toLocaleDateString());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.studentName.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    return filtered;
  }, [attendance, dateFilter, searchQuery, statusFilter]);

  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleAuth = async () => {
    setLoginError("");
    if (!email || !password) {
      setLoginError("Please enter email and password.");
      return;
    }
    if (authSubmitting) return;
    setAuthSubmitting(true);

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setLoginError(error.message);
        } else {
          toast({ title: "Account Created", description: "You are now signed in." });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setLoginError(error.message);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setLoginError("Network error. Please check your connection and try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- Face capture ---

  const startCapture = async () => {
    setShowCapture(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setCaptureStream(mediaStream);
      setTimeout(() => {
        if (captureVideoRef.current) {
          captureVideoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      toast({ title: "Camera Error", description: "Could not access camera", variant: "destructive" });
      setShowCapture(false);
    }
  };

  const takePicture = () => {
    if (!captureVideoRef.current || !captureCanvasRef.current) return;
    const canvas = captureCanvasRef.current;
    const video = captureVideoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setFaceImageBlob(blob);
        setFaceImagePreview(URL.createObjectURL(blob));
      }
    }, "image/jpeg", 0.9);

    stopCapture();
  };

  const stopCapture = () => {
    captureStream?.getTracks().forEach(t => t.stop());
    setCaptureStream(null);
    setShowCapture(false);
  };

  useEffect(() => {
    return () => {
      captureStream?.getTracks().forEach(t => t.stop());
    };
  }, [captureStream]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaceImageBlob(file);
    setFaceImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormName("");
    setFormRoll("");
    setFaceImagePreview(null);
    setFaceImageBlob(null);
    setShowAdd(false);
    setEditId(null);
    stopCapture();
  };

  // --- CRUD ---

  const handleAddStudent = async () => {
    if (!formName || !formRoll) return;
    setLoading(true);
    let imageUrl = "";
    if (faceImageBlob) {
      const tempId = crypto.randomUUID();
      const url = await uploadFaceImage(faceImageBlob, tempId);
      if (url) imageUrl = url;
    }
    const result = await addStudent({ name: formName, rollNo: formRoll, imageUrl });
    if (result) {
      toast({ title: "Student Added", description: `${formName} has been registered` });
      await loadData();
    } else {
      toast({ title: "Error", description: "Failed to add student", variant: "destructive" });
    }
    resetForm();
    setLoading(false);
  };

  const handleEditStudent = async (id: string) => {
    if (!formName || !formRoll) return;
    setLoading(true);
    let imageUrl: string | undefined;
    if (faceImageBlob) {
      const url = await uploadFaceImage(faceImageBlob, id);
      if (url) imageUrl = url;
    }
    const success = await updateStudent(id, {
      name: formName,
      rollNo: formRoll,
      ...(imageUrl !== undefined && { imageUrl }),
    });
    if (success) {
      toast({ title: "Student Updated", description: `${formName} has been updated` });
      await loadData();
    } else {
      toast({ title: "Error", description: "Failed to update student", variant: "destructive" });
    }
    resetForm();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await deleteStudent(id);
    await loadData();
    setLoading(false);
  };

  const handleDeleteAttendance = async (id: string) => {
    setLoading(true);
    await deleteAttendance(id);
    await loadData();
    setLoading(false);
  };

  const startEdit = (s: Student) => {
    setEditId(s.id);
    setFormName(s.name);
    setFormRoll(s.rollNo);
    setFaceImagePreview(s.imageUrl || null);
    setFaceImageBlob(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

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
              <h2 className="font-display text-2xl font-bold text-foreground">
                {authMode === "login" ? "Admin Login" : "Create Account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {authMode === "login" ? "Sign in to access the dashboard" : "Register a new admin account"}
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary border-border text-foreground pl-9"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  className="bg-secondary border-border text-foreground pl-9"
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <Button onClick={handleAuth} disabled={authSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold gap-2">
                {authSubmitting ? "Please wait..." : authMode === "login" ? (
                  <><LogIn className="h-4 w-4" /> Sign In</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Create Account</>
                )}
              </Button>
              <button
                onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setLoginError(""); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
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
              <p className="text-sm text-muted-foreground mt-1">
                Signed in as {session?.user?.email}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-border text-foreground hover:bg-secondary gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students", value: students.length, color: "text-primary" },
              { label: "With Face Image", value: students.filter(s => s.imageUrl).length, color: "text-success" },
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
            <Button onClick={() => setTab("students")} variant={tab === "students" ? "default" : "outline"} className={tab === "students" ? "bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}>
              <Users className="h-4 w-4 mr-2" /> Students
            </Button>
            <Button onClick={() => setTab("attendance")} variant={tab === "attendance" ? "default" : "outline"} className={tab === "attendance" ? "bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}>
              <ClipboardList className="h-4 w-4 mr-2" /> Attendance
            </Button>
          </div>

          {/* Students Tab */}
          {tab === "students" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-end mb-4">
                <Button onClick={() => { resetForm(); setShowAdd(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" /> Add Student
                </Button>
              </div>

              {/* Add/Edit Form */}
              {(showAdd || editId) && (
                <div className="bg-gradient-card rounded-xl border border-border p-5 mb-4 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Input placeholder="Student Name" value={formName} onChange={(e) => setFormName(e.target.value)} className="bg-secondary border-border text-foreground flex-1 min-w-[200px]" />
                    <Input placeholder="Roll Number" value={formRoll} onChange={(e) => setFormRoll(e.target.value)} className="bg-secondary border-border text-foreground flex-1 min-w-[200px]" />
                  </div>

                  {/* Face Image Section */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Face Image</p>
                    {faceImagePreview && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                        <img src={faceImagePreview} alt="Face preview" className="w-full h-full object-cover" />
                        <button onClick={() => { setFaceImagePreview(null); setFaceImageBlob(null); }} className="absolute top-1 right-1 bg-background/80 rounded-full p-1">
                          <X className="h-3 w-3 text-foreground" />
                        </button>
                      </div>
                    )}
                    {showCapture && (
                      <div className="space-y-2">
                        <div className="relative w-64 h-48 rounded-xl overflow-hidden border border-border bg-background/50">
                          <video ref={captureVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={takePicture} className="bg-primary text-primary-foreground gap-1">
                            <Camera className="h-3 w-3" /> Capture
                          </Button>
                          <Button size="sm" variant="outline" onClick={stopCapture} className="border-border text-foreground">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <canvas ref={captureCanvasRef} className="hidden" />
                      </div>
                    )}
                    {!showCapture && !faceImagePreview && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={startCapture} className="border-border text-foreground gap-1">
                          <Camera className="h-3 w-3" /> Capture Face
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="border-border text-foreground gap-1">
                          <Upload className="h-3 w-3" /> Upload Image
                        </Button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </div>
                    )}
                    {!showCapture && faceImagePreview && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={startCapture} className="border-border text-foreground gap-1">
                          <Camera className="h-3 w-3" /> Recapture
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="border-border text-foreground gap-1">
                          <Upload className="h-3 w-3" /> Re-upload
                        </Button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => editId ? handleEditStudent(editId) : handleAddStudent()} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={resetForm} variant="outline" className="border-border text-foreground">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Students Table */}
              <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Face</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Roll No</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center">
                            {s.imageUrl ? (
                              <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                            ) : (
                              <Image className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.rollNo}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(s)} className="border-border text-foreground h-8">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(s.id)} className="border-destructive text-destructive h-8">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No students registered yet. Add a student with their face image to get started.
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
                  <Input placeholder="Search by student name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-secondary border-border text-foreground pl-9" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-secondary border-border text-foreground pl-9 w-[200px]" />
                </div>
                <div className="flex gap-1 rounded-lg border border-border p-0.5 bg-secondary">
                  {(["all", "Verified", "Rejected"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${statusFilter === s ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
                {(dateFilter || searchQuery || statusFilter !== "all") && (
                  <Button variant="outline" onClick={() => { setDateFilter(""); setSearchQuery(""); setStatusFilter("all"); }} className="border-border text-foreground hover:bg-secondary">
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-card rounded-xl border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Logs</p>
                  <p className="font-display text-lg font-bold text-foreground">{filteredAttendance.length}</p>
                </div>
                <div className="bg-gradient-card rounded-xl border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="font-display text-lg font-bold text-success">{filteredAttendance.filter(a => a.status === "Verified").length}</p>
                </div>
                <div className="bg-gradient-card rounded-xl border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Rejected</p>
                  <p className="font-display text-lg font-bold text-destructive">{filteredAttendance.filter(a => a.status === "Rejected").length}</p>
                </div>
              </div>

              <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Confidence</th>
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
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${a.status === "Verified" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                            {a.status === "Verified" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${(a.confidence || 0) >= 70 ? "bg-success" : (a.confidence || 0) >= 40 ? "bg-warning" : "bg-destructive"}`}
                                style={{ width: `${a.confidence || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-foreground">{a.confidence != null ? `${a.confidence}%` : "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAttendance(a.id)} className="border-destructive text-destructive h-8">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredAttendance.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          {dateFilter || searchQuery || statusFilter !== "all" ? "No records match your filters." : "No attendance records yet."}
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
