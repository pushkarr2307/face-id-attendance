import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";

interface FeatureDetail {
  icon: LucideIcon;
  title: string;
  desc: string;
  howItWorks: string;
  whyUseful: string;
}

interface FeatureModalProps {
  feature: FeatureDetail | null;
  open: boolean;
  onClose: () => void;
}

const FeatureModal = ({ feature, open, onClose }: FeatureModalProps) => {
  if (!feature) return null;
  const Icon = feature.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-3 glow-primary">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl text-foreground">
              {feature.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            {feature.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="rounded-lg bg-secondary/50 p-4 border border-border">
            <h4 className="font-display text-sm font-semibold text-primary mb-2">
              How It Works
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.howItWorks}
            </p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4 border border-border">
            <h4 className="font-display text-sm font-semibold text-primary mb-2">
              Why It's Useful
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.whyUseful}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal;
