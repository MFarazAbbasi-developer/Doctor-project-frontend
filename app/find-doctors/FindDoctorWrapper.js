"use client";
import { Suspense } from "react";
export default function FindDoctorWrapper(props) {
  return <Suspense fallback={<p>Loading...</p>}>{props.children}</Suspense>;
}
