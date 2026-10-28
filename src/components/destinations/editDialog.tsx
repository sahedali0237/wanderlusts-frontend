"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, AuthTokenError } from "@/lib/api-client";
import type { Destination } from "@/lib/destinations";

interface EditDestinationDialogProps {
  destination: Destination & { id?: string };
}

const actionClass =
  "inline-flex h-9 items-center justify-center gap-2 rounded-sm border bg-white px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2";

const labelClass = "mb-2 block text-xs font-medium text-neutral-700";

const inputClass =
  "h-10 rounded-sm border-neutral-200 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus-visible:border-[#10a5c4] focus-visible:ring-[#10a5c4]/20";

const categories = [
  { value: "beach", label: "Beach" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "nature", label: "Nature" },
  { value: "city", label: "City" },
];

const EditDestinationDialog = ({ destination }: EditDestinationDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const initialDate = destination.departureDate
    ? new Date(destination.departureDate).toISOString().split("T")[0]
    : "";

  const [category, setCategory] = useState(
    destination.category?.toLowerCase() || "beach",
  );
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const targetId = destination._id || destination.id;

    if (!targetId) {
      setError("Error: Destination ID is missing.");
      setIsSaving(false);
      return;
    }

    const payload = {
      ...Object.fromEntries(formData.entries()),
      category,
      price: String(formData.get("price") ?? "").trim(),
    };

    try {
      const res = await apiFetch(
        `/destination/${encodeURIComponent(targetId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(
          errorData.error ||
            errorData.message ||
            `Failed to update (Status: ${res.status})`,
        );
        setIsSaving(false);
        return;
      }

      setIsSaving(false);

      // 2. Programmatically click DialogClose AND update state to guarantee it closes
      closeButtonRef.current?.click();
      setOpen(false);

      // 3. Refresh the page data
      router.refresh();
    } catch (err) {
      console.error("Patch error:", err);
      setError(
        err instanceof AuthTokenError
          ? err.message
          : "Could not connect to server. Make sure your backend is running on port 5000.",
      );
      setIsSaving(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={`${actionClass} border-neutral-300 text-neutral-700 hover:bg-neutral-50`}
        >
          <Pencil
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          Edit
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {/* 4. Hidden DialogClose trigger that we click via closeButtonRef */}
          <DialogClose ref={closeButtonRef} className="hidden" />

          <DialogHeader>
            <DialogTitle>Update Travel Package</DialogTitle>
            <DialogDescription>
              Make changes to {destination.destinationName} below. Click save
              when you are done.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            onReset={() => {
              setCategory(destination.category?.toLowerCase() || "beach");
              setError(null);
              setDate(initialDate);
              closeButtonRef.current?.click();
              setOpen(false);
            }}
            className="mt-2"
          >
            {error && (
              <p
                role="alert"
                className="mb-6 border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-3 py-2 text-sm text-[#ff6b6b]"
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
                  defaultValue={destination.destinationName}
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
                  defaultValue={destination.country}
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
                    {categories.map(
                      (option: { value: string; label: string }) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ),
                    )}
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
                  defaultValue={destination.price}
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
                  defaultValue={destination.duration}
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
                  className={`${inputClass} ${
                    date ? "text-neutral-800" : "text-neutral-400"
                  }`}
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
                  defaultValue={destination.imageUrl}
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
                  defaultValue={destination.description}
                  placeholder="Describe the travel experience..."
                  className={`${inputClass} h-auto min-h-30 resize-y py-3`}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
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
                disabled={isSaving}
                className="h-10 gap-2 rounded-sm bg-[#10a5c4] px-6 text-sm font-medium text-white shadow-none hover:bg-[#0e8ea9] focus-visible:border-[#0e8ea9] focus-visible:ring-[#10a5c4]/30 disabled:opacity-60"
              >
                <Save className="size-4" strokeWidth={1.8} />
                {isSaving ? "Saving..." : "Update Travel Package"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDestinationDialog;
