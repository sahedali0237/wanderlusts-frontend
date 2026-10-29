"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api-client";
import type { Destination } from "@/lib/destinations";

interface DeleteDestinationDialogProps {
  destination: Destination;
}

const actionClass =
  "inline-flex h-9 items-center justify-center gap-2 rounded-sm border bg-white px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4514f] focus-visible:ring-offset-2";

const DeleteDestinationDialog = ({
  destination,
}: DeleteDestinationDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) return;

    setOpen(nextOpen);
    if (!nextOpen) setError(null);
  }

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await apiFetch(
        `/destination/${encodeURIComponent(destination._id)}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(
          errorData.error ||
            errorData.message ||
            `Failed to delete (Status: ${res.status})`,
        );
        setIsDeleting(false);
        return;
      }

      setIsDeleting(false);
      setOpen(false);

  
      router.push("/destinations");
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Could not connect to server.");
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        className={`${actionClass} border-[#f4514f] text-[#f4514f] hover:bg-[#f4514f]/10`}
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent
        size="lg"
        showCloseButton
        className="gap-0 rounded-lg p-0 text-left shadow-lg"
      >
        <div className="p-8">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#fdeaea]">
              <AlertTriangle
                className="size-7 text-[#ef5350]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </span>
            <AlertDialogTitle className="text-xl font-semibold text-neutral-900">
              Delete Travel Package
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="mt-5 text-left text-sm leading-6 text-pretty text-neutral-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-900">
              &quot;{destination.destinationName}&quot;
            </span>
            ? This action cannot be undone and will permanently remove this
            travel package from the system.
          </AlertDialogDescription>

          {error && (
            <p
              role="alert"
              className="mt-5 border border-[#f4514f]/30 bg-[#f4514f]/10 px-3 py-2 text-sm text-[#f4514f]"
            >
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-11 rounded-[3px] border-neutral-300 bg-white px-7 text-sm font-medium text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
            >
              Cancel
            </AlertDialogCancel>

            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-11 gap-2 rounded-[3px] bg-[#f4514f] px-7 text-sm font-medium text-white shadow-none hover:bg-[#e04341] focus-visible:ring-[#f4514f]/30 disabled:opacity-60"
            >
              {isDeleting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" strokeWidth={1.8} />
              )}
              {isDeleting ? "Deleting..." : "Delete Package"}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDestinationDialog;
