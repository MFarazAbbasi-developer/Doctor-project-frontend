import { Suspense } from "react";
import FindDoctorsClient from "./FindDoctorsClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
  <FindDoctorsClient /></Suspense>)
}
