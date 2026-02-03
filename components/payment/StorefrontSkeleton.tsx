"use client";

import React from "react";

export function StorefrontSkeleton() {
  return (
    <main className="min-h-screen animate-pulse">
      {/* Top bar skeleton */}
      <div className="border-b border-border/40 h-14" />

      {/* Header skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-muted/50 mb-6" />
          <div className="mx-auto h-10 w-64 rounded-lg bg-muted/50 mb-3" />
          <div className="mx-auto h-5 w-96 max-w-full rounded bg-muted/30 mb-2" />
          <div className="mx-auto h-5 w-72 max-w-full rounded bg-muted/20 mb-6" />
          <div className="flex justify-center gap-3">
            <div className="h-6 w-28 rounded-full bg-muted/30" />
            <div className="h-6 w-36 rounded-full bg-muted/30" />
            <div className="h-6 w-32 rounded-full bg-muted/30" />
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/30 overflow-hidden"
              >
                <div className="h-1 w-full bg-muted/30" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-40 rounded bg-muted/40" />
                  <div className="h-4 w-full rounded bg-muted/20" />
                  <div className="h-4 w-2/3 rounded bg-muted/15" />
                  <div className="h-8 w-24 rounded bg-muted/30 mt-4" />
                  <div className="h-10 w-full rounded-lg bg-muted/20 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
