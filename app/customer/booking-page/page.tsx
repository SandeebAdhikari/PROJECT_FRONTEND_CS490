import { Suspense } from "react";
import BookingContent from "./BookingContent";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
