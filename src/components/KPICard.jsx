import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const variantStyles = {
  default: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    iconBg: "bg-status-approved-bg",
    iconColor: "text-status-approved",
  },
  warning: {
    iconBg: "bg-status-pending-bg",
    iconColor: "text-status-pending",
  },
  danger: {
    iconBg: "bg-status-rejected-bg",
    iconColor: "text-status-rejected",
  },
  brand: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}) {
  const styles = variantStyles[variant];

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 border border-gray-200 shadow-sm",
        className
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center mb-3",
          styles.iconBg
        )}
      >
        <Icon className={cn("w-5 h-5", styles.iconColor)} />
      </div>

      <p className="text-sm text-gray-600">{title}</p>

      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}

      {trend && TrendIcon && (
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <TrendIcon className="w-3.5 h-3.5" />
          {trend.value}%
        </div>
      )}
    </div>
  );
}

export function MiniKPI({ label, value, className }) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}