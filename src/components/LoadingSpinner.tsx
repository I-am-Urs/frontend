import React from "react";

const LoadingSpinner: React.FC<{ label?: string }>= ({ label }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-input border-t-ring" aria-hidden="true" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
