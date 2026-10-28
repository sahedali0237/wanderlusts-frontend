"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  CalendarDays,
  Globe,
  Plane,
  Map,
  DollarSign,
  Edit2,
  Upload,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface ProfileData {
  name: string;
  email: string;
  image: string;
  memberSince: string;
  nationality: string;
  stats: {
    totalBookings: number;
    countriesVisited: number;
    upcomingTrips: number;
    totalSpent: string;
  };
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? "";

  const initial = (name || email || "U").charAt(0).toUpperCase();
  const displayImage = avatarPreview ?? profile?.image ?? image;

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => (prev ? { ...prev, image: data.imageUrl } : prev));
        setAvatarPreview(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  useEffect(() => {
    if (isPending || !session?.user) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user]);

  const stats = profile?.stats || {
    totalBookings: 0,
    countriesVisited: 0,
    upcomingTrips: 0,
    totalSpent: "$0",
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Profile Card (Left) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-3 group cursor-pointer">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt="Avatar"
                      className="size-24 rounded-full object-cover border border-neutral-200 transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-24 rounded-full bg-[#10a5c4]/10 flex items-center justify-center text-[#10a5c4] font-semibold text-2xl border border-neutral-200">
                      {initial}
                    </div>
                  )}
                  <label
                    className="absolute bottom-0 right-0 bg-[#10a5c4] text-white rounded-full size-6 flex items-center justify-center text-xs font-medium shadow-sm cursor-pointer hover:bg-[#0e8ea9] transition-colors"
                    title="Change profile picture"
                  >
                    <Upload className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {name || "User"}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
                  {profile?.nationality ? (
                    <>
                      {profile.nationality}
                      {profile.memberSince && (
                        <span className="ml-2 text-[11px] opacity-60">
                          • Member since {profile.memberSince}
                        </span>
                      )}
                    </>
                  ) : (
                    "San Francisco, CA"
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Member since</span>
                  <span className="font-medium text-neutral-900">
                    {profile?.memberSince ?? "Mar 2024"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Nationality</span>
                  <span className="font-medium text-neutral-900">
                    {profile?.nationality ?? "United States"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  disabled={uploading}
                  className={`w-full flex items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2 ${
                    uploading
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-[#10a5c4] hover:bg-[#0e8ea9]"
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading…
                    </span>
                  ) : (
                    <>
                      <Edit2 className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
                      Change Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Travel Statistics (Right) */}
          <div className="lg:w-3/4 flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-normal tracking-tight text-neutral-900 mb-1">
                My Profile
              </h1>
              <p className="text-neutral-500">
                Manage your account settings and travel preferences.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-6">
                Travel Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Bookings",
                    value: stats.totalBookings.toString(),
                    icon: Plane,
                    color: "text-[#10a5c4]",
                    bg: "bg-[#10a5c4]/10",
                  },
                  {
                    label: "Countries Visited",
                    value: stats.countriesVisited.toString(),
                    icon: Map,
                    color: "text-[#10a5c4]",
                    bg: "bg-[#10a5c4]/10",
                  },
                  {
                    label: "Upcoming Trips",
                    value: stats.upcomingTrips.toString(),
                    icon: CalendarDays,
                    color: "text-[#f59e0b]",
                    bg: "bg-[#f59e0b]/10",
                  },
                  {
                    label: "Total Spent",
                    value: stats.totalSpent,
                    icon: DollarSign,
                    color: "text-[#ec4899]",
                    bg: "bg-[#ec4899]/10",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-neutral-50 rounded-lg p-4"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
                      <stat.icon
                        className={`h-5 w-5 ${stat.color}`}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
