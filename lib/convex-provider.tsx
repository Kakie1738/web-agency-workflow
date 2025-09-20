"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Initialize Convex client with environment variable
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Check if we have a valid URL before creating provider
  if (!convexUrl) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg m-4">
        <h2 className="text-red-800 font-bold text-lg mb-2">🔧 Database Connection Required</h2>
        <p className="text-red-700 mb-4">Your app needs to connect to Convex database.</p>
        <div className="bg-white p-4 rounded border text-sm font-mono">
          <p className="mb-2">1. Open terminal and run:</p>
          <code className="bg-gray-100 p-1 rounded mr-2">npx convex login</code><br/>
          <code className="bg-gray-100 p-1 rounded mr-2">npx convex dev</code>
          <p className="mt-2">2. Then restart this server</p>
        </div>
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);
  
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}