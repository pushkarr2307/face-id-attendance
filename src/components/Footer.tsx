import { ScanFace } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ScanFace className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground">
            Face<span className="text-primary">ID</span> Attend
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 AI Face Recognition Attendance System. Built for academic demonstration.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
