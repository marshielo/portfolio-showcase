"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Projects", link: "/#projects" },
  { name: "About", link: "/#about" },
  { name: "Experience", link: "/#experience" },
  { name: "Contact", link: "/#contact" },
];

interface PortfolioNavbarProps {
  email?: string;
}

export function PortfolioNavbar({ email }: PortfolioNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactHref = email ? `mailto:${email}` : "/#contact";

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavbarButton href={contactHref} variant="primary">
            Get in Touch
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
          <NavbarButton
            href={contactHref}
            variant="primary"
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get in Touch
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
