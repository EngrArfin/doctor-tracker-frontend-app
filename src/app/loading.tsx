import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center p-6">
      {/* Pure Circular Loader - No Icons */}
      <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
