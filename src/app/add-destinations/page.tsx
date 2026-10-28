"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, AuthTokenError } from "@/lib/api-client";

const categories = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
];

const inputClass =
  "mt-2 h-10 rounded-sm border-neutral-100 bg-[#f9fafb] px-3 text-sm text-neutral-800 shadow-none transition-colors placeholder:text-neutral-400 focus-visible:border-[#10a5c4] focus-visible:ring-3 focus-visible:ring-[#10a5c4]/20";
const labelClass = "text-[13px] font-medium text-neutral-800";

export default function AddPackagePage() {
  const [category, setCategory] = useState("beach");
  const [date, setDate] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const name = formData.get("destinationName")?.toString().trim();
    const form = Object.fromEntries(formData.entries());

    setError(null);

    try {
      const res = await apiFetch("/destination", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(
          errorData.error ||
            errorData.message ||
            `Failed to save (Status: ${res.status})`,
        );
        return;
      }
    } catch (err) {
      console.error("Create destination error:", err);
      setError(
        err instanceof AuthTokenError
          ? err.message
          : "Could not connect to server. Make sure your backend is running on port 5000.",
      );
      return;
    }

    formElement.reset();
    setCreated(name || "Your travel package");
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6 sm:p-12 bg-white">
      <h1 className="mb-8 text-4xl font-[60px] text-neutral-900">
        Add New Travel Package
      </h1>

      <form
        onSubmit={handleSubmit}
        onReset={() => {
          setCategory("beach");
          setCreated(null);
          setError(null);
          setDate(""); // Reset the date state when form is cancelled/submitted
        }}
        className="border border-neutral-100 bg-white p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] mx-auto max-w-3xl ml-0"
      >
        {created && (
          <p
            role="status"
            className="mb-6 border border-[#10a5c4]/30 bg-[#e8f6fc] px-3 py-2 text-sm text-neutral-700"
          >
            <span className="font-medium">{created}</span> has been added to
            your travel packages.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-6 border border-[#f4514f]/30 bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]"
          >
            {error}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="destinationName" className={labelClass}>
              Destination Name
            </Label>
            <Input
              id="destinationName"
              name="destinationName"
              placeholder="Bali Paradise"
              required
              className={inputClass}
            />
          </div>

          <div>
            <Label htmlFor="country" className={labelClass}>
              Country
            </Label>
            <Input
              id="country"
              name="country"
              placeholder="Indonesia"
              required
              className={inputClass}
            />
          </div>

          <div>
            <Label htmlFor="category" className={labelClass}>
              Category
            </Label>
            <Select
              name="category"
              value={category}
              onValueChange={(value) => setCategory(value ?? "beach")}
            >
              <SelectTrigger
                id="category"
                className={`${inputClass} w-full justify-between`}
              >
                <SelectValue className="text-neutral-800" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price" className={labelClass}>
              Price (USD)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 1299"
              className={inputClass}
            />
          </div>

          <div>
            <Label htmlFor="duration" className={labelClass}>
              Duration
            </Label>
            <Input
              id="duration"
              name="duration"
              placeholder="e.g., 7 Days/6 Nights"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="departureDate" className={labelClass}>
              Departure Date
            </Label>
            <Input
              id="departureDate"
              name="departureDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              // Switch between light gray (empty) and standard dark gray (filled)
              className={`${inputClass} ${date ? "text-neutral-800" : "text-neutral-400"}`}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="imageUrl" className={labelClass}>
              Image URL
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description" className={labelClass}>
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the travel experience..."
              className={`${inputClass} h-auto min-h-[120px] resize-y py-3`}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            type="reset"
            variant="outline"
            className="h-10 gap-2 rounded-sm border-[#ff6b6b] bg-white px-6 text-sm font-medium text-[#ff6b6b] shadow-none hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b]"
          >
            <Trash2 className="size-4" strokeWidth={1.8} />
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-10 gap-2 rounded-sm bg-[#10a5c4] px-6 text-sm font-medium text-white shadow-none hover:bg-[#0e8ea9] focus-visible:border-[#0e8ea9] focus-visible:ring-[#10a5c4]/30"
          >
            <Save className="size-4" strokeWidth={1.8} />
            Add Travel Package
          </Button>
        </div>
      </form>
    </div>
  );
}
