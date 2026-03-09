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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  }),
};

const features = [
  { icon: ScanFace, title: "AI Face Detection", desc: "Advanced neural network identifies faces in real-time with 99.7% accuracy" },
  { icon: Shield, title: "Privacy First", desc: "Student names remain hidden during scanning — only admins see identities" },
  { icon: Clock, title: "Instant Marking", desc: "Attendance marked in under 2 seconds with timestamp verification" },
  { icon: Users, title: "Multi-Student", desc: "Register unlimited students with individual face profiles" },
  { icon: Eye, title: "Anti-Spoofing", desc: "Liveness detection prevents photo and video-based spoofing attacks" },
  { icon: Database, title: "Attendance Logs", desc: "Complete audit trail with date, time, and verification status" },
];

const steps = [
  { icon: Camera, title: "Capture", desc: "System accesses device camera and captures a live frame" },
  { icon: Brain, title: "Analyze", desc: "AI model processes the face using deep learning algorithms" },
  { icon: UserCheck, title: "Verify", desc: "Face is matched against the registered student database" },
  { icon: CheckCircle, title: "Mark", desc: "Attendance is recorded with date, time, and verification proof" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-6 relative">
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
      <section className="py-20" id="features">
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
                className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/30">
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
      <section className="py-20" id="demo">
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
      <section className="py-20 bg-card/30" id="contact">
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
                className="bg-gradient-card rounded-xl p-6 border border-border text-center"
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
