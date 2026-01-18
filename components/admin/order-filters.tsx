"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Search, X } from "lucide-react";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [paymentStatus, setPaymentStatus] = useState(
    searchParams.get("paymentStatus") || ""
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);

    router.push(`/admin/orders?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    router.push("/admin/orders");
  };

  const hasFilters = search || status || paymentStatus;

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Order Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Payment Status */}
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="">All Payments</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <Button onClick={applyFilters} size="sm">
          Apply Filters
        </Button>
        {hasFilters && (
          <Button onClick={clearFilters} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}
