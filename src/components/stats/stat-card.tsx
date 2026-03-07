import { cn } from "@/lib/utils";
import Image from "next/image";

interface StatCardProps {
  label: string;
  value: string | number;
  iconSrc: string;
  className?: string;
}

export function StatCard({ label, value, iconSrc, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-primary/10 flex flex-col gap-5 items-center p-5 relative rounded-xl w-full border border-border/50",
      className
    )}>
      <div className="bg-primary/20 flex items-center p-2 rounded-full size-9 shrink-0 justify-center">
        <Image src={iconSrc} alt={label} width={16} height={16} className="size-4" />
      </div>
      <div className="flex flex-col gap-1.5 items-center justify-center text-center">
        <p className="font-tight text-2xl font-semibold text-foreground leading-none">
          {value}
        </p>
        <p className="font-tight text-xs text-muted-foreground leading-none">
          {label}
        </p>
      </div>
    </div>
  );
}
