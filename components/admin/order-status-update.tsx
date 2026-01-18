"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/actions/admin-orders";
import type { Order } from "@prisma/client";

interface OrderStatusUpdateProps {
  order: Order;
}

export function OrderStatusUpdate({ order }: OrderStatusUpdateProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
    order.paymentStatus
  );

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) return;

    setIsUpdating(true);
    const result = await updateOrderStatus(order.orderNumber, selectedStatus as any);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsUpdating(false);
  };

  const handleUpdatePaymentStatus = async () => {
    if (selectedPaymentStatus === order.paymentStatus) return;

    setIsUpdating(true);
    const result = await updatePaymentStatus(
      order.orderNumber,
      selectedPaymentStatus as any
    );

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsUpdating(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Update Status</h2>

      {/* Order Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Order Status</label>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Current:</span>
          <Badge
            variant={
              order.status === "DELIVERED"
                ? "default"
                : order.status === "CANCELLED"
                ? "destructive"
                : "outline"
            }
          >
            {order.status}
          </Badge>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background mb-2"
        >
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <Button
          size="sm"
          onClick={handleUpdateStatus}
          disabled={isUpdating || selectedStatus === order.status}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Order Status"}
        </Button>
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Payment Status</label>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Current:</span>
          <Badge
            variant={order.paymentStatus === "PAID" ? "default" : "outline"}
          >
            {order.paymentStatus}
          </Badge>
        </div>
        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
          className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background mb-2"
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <Button
          size="sm"
          onClick={handleUpdatePaymentStatus}
          disabled={isUpdating || selectedPaymentStatus === order.paymentStatus}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Payment Status"}
        </Button>
      </div>
    </Card>
  );
}
