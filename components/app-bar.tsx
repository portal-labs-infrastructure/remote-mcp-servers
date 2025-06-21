'use client'; // Needed for Sheet state and potentially other client hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To highlight active link
import { useState } from 'react'; // For managing sheet open/close if needed, though Sheet handles its own
// import { AuthButton } from '@/components/auth-button';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription, // To close sheet on link click
} from '@/components/ui/sheet';
import { Menu, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional class names
import { navLinks } from '@/lib/const';

export default function AppBar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Helper to render individual nav links
  const renderNavLink = (link: (typeof navLinks)[0], isMobile = false) => {
    const isActive = pathname === link.href;
    const commonClasses = cn(
      'text-sm font-medium transition-colors hover:text-primary',
      isActive ? 'text-primary' : 'text-muted-foreground',
      isMobile ? 'flex items-center gap-3 py-3 text-base' : 'px-3 py-2', // Adjusted padding for mobile
    );

    if (link.isExternal) {
      return (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClasses}
          onClick={() => isMobile && setIsSheetOpen(false)} // Close sheet on click for mobile
        >
          <div className="flex items-center gap-3">
            {isMobile && link.Icon && (
              <link.Icon
                className={cn('h-5 w-5', isMobile ? 'mr-0' : 'mr-0')}
              />
            )}{' '}
            {/* Icon always visible */}
            {link.label}
            <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5 opacity-70" />
          </div>
        </a>
      );
    }

    const linkContent = (
      <>
        {isMobile && link.Icon && (
          <link.Icon className={cn('h-5 w-5', isMobile ? 'mr-0' : 'mr-0')} />
        )}
        {link.label}
      </>
    );

    if (isMobile) {
      return (
        // Using SheetClose for Next.js Links inside Sheet to ensure it closes
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

  return (
    <nav className="sticky top-0 z-50 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-4 md:px-6 text-sm">
        {/* Logo and Desktop Nav (grouped left) */}
        <div className="flex items-center gap-x-4 md:gap-x-6">
          <Logo />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-x-1 lg:gap-x-2">
            {navLinks.map((link) => renderNavLink(link, false))}
          </div>
        </div>

        {/* Right side: Auth Button and Mobile Menu Trigger */}
        <div className="flex items-center gap-x-2 md:gap-x-4">
          {/* <AuthButton /> */}

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
                aria-describedby="mobile-nav"
                className="w-full max-w-xs sm:max-w-sm">
                {' '}
                {/* Responsive width */}
                <SheetHeader className="mb-4 border-b pb-4">
                  <SheetDescription />
                  <SheetTitle asChild>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-1 px-4">
                  {navLinks.map((link) => renderNavLink(link, true))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
