"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, Calendar } from "lucide-react";

const PaymentCanceledPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft-br text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-12 h-12 text-yellow-600" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Canceled</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Your payment was not completed. Your appointment is still on hold and
          will need to be paid for to confirm.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Your appointment slot
            is temporarily reserved. Please complete the payment within 24 hours
            to confirm your booking.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Try Payment Again
          </button>

          <button
            onClick={() => router.push("/customer/my-profile")}
            className="w-full px-6 py-4 border-2 border-border rounded-lg font-semibold text-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            View My Appointments
          </button>

          <button
            onClick={() => router.push("/customer")}
            className="w-full px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a
              href="mailto:support@salon.com"
              className="text-primary hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceledPage;
