import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AspectRatioButtonProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}

export const AspectRatioButton = ({
  icon: Icon,
  label,
  value,
  isActive,
  onClick
}: AspectRatioButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center h-20 gap-2 transition-all",
        isActive
          ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg scale-105"
          : "bg-card border-border hover:bg-accent hover:border-accent-foreground hover:scale-105"
      )}
    >
      <Icon className="w-6 h-6 transition-transform" />
      <span className="text-sm">{label}</span>
    </Button>
  );
};
