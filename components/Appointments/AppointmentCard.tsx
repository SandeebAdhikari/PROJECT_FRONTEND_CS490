"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export type Appointment = {
    id: string;
    customer: string;
    service: string;
    stylist: string;
    date: string;
    time: string;
    price: number;
    status: "confirmed" | "pending" | "canceled";
    avatarUrl?: string;
};

export default function AppointmentCard({ a }: { a: Appointment }) {
    const statusClasses: Record<Appointment["status"], string> = {
        confirmed: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-200 text-amber-800",
        canceled: "bg-red-100 text-red-700",
    };

    return (
        <div className="border border-border bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-smooth flex items-center justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3">
                {a.avatarUrl ? (
                    <img
                        src={a.avatarUrl}
                        alt={a.customer}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {a.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                )}

                <div>
                    <div className="font-semibold text-sm sm:text-base">{a.customer}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                        {a.service} with {a.stylist}
                    </div>
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex items-center gap-6 text-sm">
                {/* Date and Time */}
                <div className="text-right leading-tight">
                    <div className="font-semibold text-gray-900">{a.date}</div>
                    <div className="text-gray-500 font-medium">{a.time}</div>
                </div>

                {/* Price */}
                <div className="font-semibold text-gray-900 text-base">
                    ${a.price}
                </div>

                {/* Status */}
                <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${statusClasses[a.status]}`}
                >
                    {a.status}
                </span>

                {/* Icons */}
                <div className="flex items-center gap-2 text-gray-500">
                    <Eye className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                    <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                    <Trash2 className="h-4 w-4 cursor-pointer hover:text-red-600" />
                </div>
            </div>

        </div>
    );
}

