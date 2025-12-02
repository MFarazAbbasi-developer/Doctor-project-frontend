import { Suspense } from "react";
import FindDoctorsClient from "./FindDoctorsClient";

// export const dynamic = "force-dynamic"; // <-- add this

export default function Page() {
  return (
    <Suspense >
      <FindDoctorsClient />
    </Suspense>
  );
}
