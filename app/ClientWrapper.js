"use client";
import { Suspense } from "react";

export default function ClientWrapper({ children }) {
  return <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
}
