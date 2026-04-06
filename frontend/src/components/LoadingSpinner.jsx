import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        <p className="text-textMuted">Loading...</p>
      </div>
    </div>
  );
}
