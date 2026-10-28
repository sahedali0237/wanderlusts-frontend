"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";

const navLink =
  "text-base font-medium text-neutral-800 transition-colors hover:text-[#10a5c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2";

const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-[#10a5c4]/40 focus-visible:outline-none";

const mobileMenuItemClass =
  "flex w-full items-center gap-2.5 rounded-md px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#10a5c4]/40 focus-visible:outline-none";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/add-destinations", label: "Add Destinations" },
  { href: "/myBookings", label: "My Bookings" },
];

const desktopLinksClass =
  "hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Reads the pathname, so it must stay behind a Suspense boundary: on routes
 * with dynamic params that aren't known at build time (e.g. /destinations/[id])
 * this hook can only resolve at request time.
 */
function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <div className={desktopLinksClass}>
      {leftLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            navLink,
            isActivePath(pathname, href) &&
              "relative font-semibold text-[#10a5c4] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-[#10a5c4]",
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function DesktopNavLinksFallback() {
  return (
    <div className={desktopLinksClass}>
      {leftLinks.map(({ href, label }) => (
        <Link key={href} href={href} className={navLink}>
          {label}
        </Link>
      ))}
    </div>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {leftLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            mobileMenuItemClass,
            isActivePath(pathname, href) &&
              "bg-[#10a5c4]/20 text-[#10a5c4] font-semibold",
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

function MobileNavLinksFallback({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      {leftLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={mobileMenuItemClass}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
};

function getInitial(user: SessionUser) {
  const source = user.name?.trim() || user.email?.trim() || "U";
  return source.charAt(0).toUpperCase();
}

function UserMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    setOpen(false);
    setSigningOut(false);
    router.push("/");
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Open account menu"
        className="rounded-full transition focus-visible:ring-2 focus-visible:ring-[#10a5c4]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Avatar className="size-9 border border-neutral-200">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "User avatar"} />
          ) : (
            <AvatarFallback className="bg-[#10a5c4]/10 text-sm font-semibold text-[#10a5c4]">
              {getInitial(user)}
            </AvatarFallback>
          )}
        </Avatar>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-60 gap-0 p-0">
        <div className="border-b border-neutral-100 px-4 py-3">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {user.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-neutral-500">
            {user.email}
          </p>
        </div>

        <div className="p-1.5">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <UserIcon className="h-4 w-4 text-neutral-500" strokeWidth={1.8} />
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={cn(
              menuItemClass,
              "text-destructive hover:bg-destructive/5 hover:text-destructive disabled:opacity-60",
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 h-17.5 w-full bg-white shadow-sm">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex h-full w-full max-w-360 items-center justify-between px-4 sm:px-6 lg:px-10"
      >
        {/* Left: desktop links or mobile hamburger */}
        <div className="flex items-center gap-4">
          {/* md and up: normal page links */}
          <Suspense fallback={<DesktopNavLinksFallback />}>
            <DesktopNavLinks />
          </Suspense>

          {/* sm and below: hamburger / X icon on the left */}
          {!isPending && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex md:hidden p-2 rounded-full hover:bg-neutral-100 text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          )}
        </div>

        {/* Center logo (exact center) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link href="/" aria-label="Wanderlast home" className="shrink-0">
            <Image
              src="/assets/Wanderlast.png"
              alt="Wanderlast"
              width={162}
              height={24}
              priority
              className="h-5 w-auto sm:h-6"
            />
          </Link>
        </div>

        {/* Right: sign in / sign up or user popover */}
        <div className="flex items-center gap-4 lg:gap-7">
          {isPending ? (
            <span
              aria-hidden="true"
              className="size-8 animate-pulse rounded-full bg-neutral-100"
            />
          ) : session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Link href="/signIn" className={cn(navLink, "hidden sm:flex")}>
                Sign In
              </Link>
              <Link href="/signUp" className={cn(navLink, "hidden sm:flex")}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay (sm and below) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col lg:hidden">
          <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/Wanderlast.png"
                alt="Wanderlast"
                width={162}
                height={24}
                className="h-5 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <Suspense
              fallback={
                <MobileNavLinksFallback
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              }
            >
              <MobileNavLinks onNavigate={() => setMobileMenuOpen(false)} />
            </Suspense>

            <div className="border-t border-white/10 pt-6 mt-6 space-y-2">
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileMenuItemClass}
                  >
                    <UserIcon
                      className="h-4 w-4 text-white"
                      strokeWidth={1.8}
                    />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={cn(
                      mobileMenuItemClass,
                      "text-[#10a5c4] hover:bg-white/10",
                    )}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signIn"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileMenuItemClass}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signUp"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileMenuItemClass}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
