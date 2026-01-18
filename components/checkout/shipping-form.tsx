import { Card } from "@/components/ui";
import { PAKISTAN_CITIES } from "@/lib/schemas/checkout";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutInput } from "@/lib/schemas/checkout";

interface ShippingFormProps {
  register: UseFormRegister<CheckoutInput>;
  errors: FieldErrors<CheckoutInput>;
  selectedCity?: string;
}

export function ShippingForm({ register, errors, selectedCity }: ShippingFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+92 300 1234567"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Street Address *
          </label>
          <textarea
            id="address"
            {...register("address")}
            rows={3}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="House/Flat No., Street, Area"
          />
          {errors.address && (
            <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* City & Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              City *
            </label>
            <select
              id="city"
              {...register("city")}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">Select City</option>
              {PAKISTAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Area */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium mb-2">
              Area/Locality
            </label>
            <input
              id="area"
              type="text"
              {...register("area")}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Gulshan-e-Iqbal"
            />
            {errors.area && (
              <p className="text-sm text-destructive mt-1">{errors.area.message}</p>
            )}
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
            Postal Code (Optional)
          </label>
          <input
            id="postalCode"
            type="text"
            {...register("postalCode")}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="75000"
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
