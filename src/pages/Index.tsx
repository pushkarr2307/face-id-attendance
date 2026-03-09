import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ScanFace, Shield, Clock, Users, Eye, CheckCircle,
  Camera, Brain, UserCheck, Database, ArrowRight, Mail, MapPin, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-face.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import FeatureModal from "@/components/FeatureModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  }),
};

const features = [
  {
    icon: ScanFace,
    title: "AI Face Detection",
    desc: "Advanced neural network identifies faces in real-time with 99.7% accuracy",
    howItWorks: "The system uses a convolutional neural network (CNN) trained on thousands of face images. When the camera captures a frame, the model extracts facial landmarks — eye positions, nose bridge, jawline — and creates a unique 128-dimensional face embedding. This embedding is compared against stored profiles using cosine similarity to determine identity.",
    whyUseful: "Eliminates manual roll calls, prevents proxy attendance, and provides instant verification. The high accuracy ensures students are correctly identified even with minor changes in appearance like glasses or lighting conditions.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Student names remain hidden during scanning — only admins see identities",
    howItWorks: "During a face scan, the system only displays a generic 'Attendance Marked Successfully' message. Student identities, names, and roll numbers are encrypted and stored server-side. Only authenticated admin users can access the identity-linked attendance data through the secure dashboard.",
    whyUseful: "Protects student privacy in shared environments like classrooms. Prevents unauthorized users from tracking attendance of specific individuals, complying with data protection best practices.",
  },
  {
    icon: Clock,
    title: "Instant Marking",
    desc: "Attendance marked in under 2 seconds with timestamp verification",
    howItWorks: "Once a face is captured, the AI pipeline processes it through detection, alignment, and recognition stages in parallel. The optimized model runs inference in under 500ms, and the attendance record is committed with a precise timestamp immediately upon successful verification.",
    whyUseful: "Saves valuable class time — an entire class of 60 students can complete attendance in under 3 minutes compared to 10+ minutes with traditional methods. The precise timestamps also provide an audit trail.",
  },
  {
    icon: Users,
    title: "Multi-Student",
    desc: "Register unlimited students with individual face profiles",
    howItWorks: "Each student is enrolled by capturing multiple face images at different angles. The system generates a robust face template by averaging these embeddings, creating a reliable reference profile. The database scales efficiently with indexed vector storage for fast lookups.",
    whyUseful: "Supports departments with large class sizes. The multi-angle enrollment ensures reliable recognition regardless of head position, and the scalable architecture handles growing student databases without performance degradation.",
  },
  {
    icon: Eye,
    title: "Anti-Spoofing",
    desc: "Liveness detection prevents photo and video-based spoofing attacks",
    howItWorks: "The system employs passive liveness detection that analyzes texture patterns, depth cues, and micro-movements in the video feed. It detects printed photos, screen replays, and 3D masks by examining specular reflections and moiré patterns unique to display screens.",
    whyUseful: "Prevents students from marking attendance using someone else's photo or video. This ensures the integrity of the attendance system and makes it tamper-proof, which is critical for academic record keeping.",
  },
  {
    icon: Database,
    title: "Attendance Logs",
    desc: "Complete audit trail with date, time, and verification status",
    howItWorks: "Every scan event is recorded with a timestamp, verification result, confidence score, and session metadata. Logs are stored in a structured database with date-based indexing, allowing admins to filter, export, and analyze attendance patterns over any time period.",
    whyUseful: "Provides transparent and verifiable attendance records for academic compliance. Admins can generate reports, identify patterns of absenteeism, and maintain accurate records required by institutional regulations.",
  },
];

const steps = [
  { icon: Camera, title: "Capture", desc: "System accesses device camera and captures a live frame" },
  { icon: Brain, title: "Analyze", desc: "AI model processes the face using deep learning algorithms" },
  { icon: UserCheck, title: "Verify", desc: "Face is matched against the registered student database" },
  { icon: CheckCircle, title: "Mark", desc: "Attendance is recorded with date, time, and verification proof" },
];

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary">AI-Powered Attendance System</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-foreground">AI Face Recognition</span>
                <br />
                <span className="text-gradient">Attendance System</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Revolutionize attendance tracking with cutting-edge facial recognition technology.
                Secure, fast, and completely contactless.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/scan">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display font-semibold gap-2">
                    <ScanFace className="h-5 w-5" />
                    Start Face Scan
                  </Button>
                </Link>
                <a href="#demo">
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary font-display font-semibold gap-2">
                    View Demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden glow-primary-lg">
                <img src={heroImage} alt="AI Face Recognition" className="w-full rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4 animate-pulse-glow">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Face Verified</p>
                    <p className="text-xs text-muted-foreground">Attendance Marked ✓</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10" id="features">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful <span className="text-gradient">Features</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              Built with state-of-the-art AI technology to ensure accurate, secure, and efficient attendance management.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                onClick={() => setSelectedFeature(f)}
                className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_30px_hsl(187_92%_52%/0.15)]"
              >
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4 group-hover:glow-primary transition-shadow duration-300">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
                <span className="inline-block mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to learn more →
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureModal
        feature={selectedFeature}
        open={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />

      {/* How It Works */}
      <section className="py-20 bg-card/30 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-gradient">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              A simple four-step process powered by deep learning face recognition.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="relative mx-auto mb-6">
                  <div className="rounded-full bg-primary/10 p-6 w-20 h-20 flex items-center justify-center mx-auto glow-primary">
                    <s.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center font-display">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-20 relative z-10" id="demo">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Try the <span className="text-gradient">Live Demo</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the face recognition system in action. Click below to start a live face scan using your device camera.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/scan">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display font-semibold gap-2">
                  <Camera className="h-5 w-5" />
                  Launch Face Scanner
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-card/30 relative z-10" id="contact">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in <span className="text-gradient">Touch</span>
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Mail, label: "Email", value: "project@university.edu" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Location", value: "Computer Science Dept." },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-gradient-card rounded-xl p-6 border border-border text-center hover:border-primary/30 hover:scale-[1.02] transition-all duration-300"
              >
                <c.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
