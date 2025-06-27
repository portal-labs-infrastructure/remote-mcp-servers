'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  ExternalLink as ExternalLinkIcon,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { iconMap, IconName } from '@/lib/const';
import { LogoutButton } from './logout-button'; // Import the logout button

type NavLink = {
  href: string;
  label: string;
  isExternal?: boolean;
  iconName?: IconName;
};

interface AppBarClientProps {
  navLinks: NavLink[];
  isAuthed: boolean; // New prop to determine auth state
  children: React.ReactNode; // This will be the desktop <AuthButton />
}

export default function AppBarClient({
  navLinks,
  isAuthed,
  children,
}: AppBarClientProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // This helper function remains the same
  const renderNavLink = (link: NavLink, isMobile = false) => {
    // ... (no changes needed in this function)
    const isActive = pathname === link.href;
    const Icon = link.iconName ? iconMap[link.iconName] : null;
    const commonClasses = cn(
      'text-sm font-medium transition-colors hover:text-primary',
      isActive ? 'text-primary' : 'text-muted-foreground',
      isMobile ? 'flex items-center gap-3 py-3 text-base' : 'px-3 py-2',
    );
    if (link.isExternal) {
      return (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClasses}
          onClick={() => isMobile && setIsSheetOpen(false)}>
          <div className="flex items-center gap-2">
            {isMobile && Icon && <Icon className="h-5 w-5" />}
            {link.label}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </div>
        </a>
      );
    }
    const linkContent = (
      <>
        {isMobile && Icon && <Icon className="h-5 w-5" />}
        {link.label}
      </>
    );
    if (isMobile) {
      return (
        <SheetClose asChild key={link.href}>
          <Link href={link.href} className={commonClasses}>
            {linkContent}
          </Link>
        </SheetClose>
      );
    }
    return (
      <Link key={link.href} href={link.href} className={commonClasses}>
        {linkContent}
      </Link>
    );
  };

  const mobileLinkClasses =
    'flex items-center gap-3 py-3 text-base text-muted-foreground font-medium transition-colors hover:text-primary';

  return (
    <nav className="sticky top-0 z-50 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-4 md:px-6 text-sm">
        <div className="flex items-center gap-x-4 md:gap-x-6">
          <Logo />
          <div className="hidden md:flex items-center gap-x-1">
            {navLinks.map((link) => renderNavLink(link, false))}
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          {/* The desktop AuthButton is passed as children and rendered here */}
          {children}

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs sm:max-w-sm">
                <SheetHeader className="mb-2 border-b text-left">
                  <SheetTitle asChild>
                    <SheetTrigger>
                      <Logo />
                    </SheetTrigger>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col px-5">
                  {/* Regular Nav Links */}
                  {navLinks.map((link) => renderNavLink(link, true))}

                  {/* --- Mobile Auth Section --- */}
                  <div className="my-6 border-t border-border" />

                  {isAuthed ? (
                    // If logged in, show Logout button
                    <LogoutButton />
                  ) : (
                    // If logged out, show Sign In and Sign Up links
                    <>
                      <SheetClose asChild>
                        <Link href="/auth/login" className={mobileLinkClasses}>
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/auth/sign-up"
                          className={mobileLinkClasses}>
                          <UserPlus className="h-5 w-5" />
                          Sign Up
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
