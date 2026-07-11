"use client";

import { QUOTE_STATUS_CONFIG, CONTACT_STATUS_CONFIG } from "@/types/admin";
import type { QuoteStatus, ContactStatus } from "@/types/admin";

interface Props {
  status: string;
  type: "quote" | "contact";
}

export default function StatusBadge({ status, type }: Props) {
  const config =
    type === "quote"
      ? QUOTE_STATUS_CONFIG[status as QuoteStatus]
      : CONTACT_STATUS_CONFIG[status as ContactStatus];

  if (!config) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      {status}
    </span>
  );

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}
