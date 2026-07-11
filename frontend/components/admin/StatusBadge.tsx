"use client";

import {
  QUOTE_STATUS_CONFIG,
  CONTACT_STATUS_CONFIG,
  CAMPAIGN_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "@/types/admin";
import type { QuoteStatus, ContactStatus, CampaignStatus, PaymentStatus } from "@/types/admin";

interface Props {
  status: string;
  type: "quote" | "contact" | "campaign" | "payment";
}

export default function StatusBadge({ status, type }: Props) {
  let config: { label: string; color: string; bg: string } | undefined;

  if (type === "quote")    config = QUOTE_STATUS_CONFIG[status as QuoteStatus];
  if (type === "contact")  config = CONTACT_STATUS_CONFIG[status as ContactStatus];
  if (type === "campaign") config = CAMPAIGN_STATUS_CONFIG[status as CampaignStatus];
  if (type === "payment")  config = PAYMENT_STATUS_CONFIG[status as PaymentStatus];

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
