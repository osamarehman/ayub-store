"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={siteConfig.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-smooth group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -left-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
      </span>
    </a>
  );
}
