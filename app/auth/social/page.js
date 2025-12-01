import { Suspense } from "react";
import SocialLoginClient from "./SocialLoginClient";

export default function SocialLoginPageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SocialLoginClient />
    </Suspense>
  );
}
