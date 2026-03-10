'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAVIGATION_ITEMS } from '@/lib/constants';

interface NavigationProps {
  pathname: string;
}

export default function Navigation({ pathname }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (itemLabel: string) => {
    setOpenDropdown(openDropdown === itemLabel ? null : itemLabel);
  };

  const handleMouseEnter = (itemLabel: string) => {
    // Only open on hover for desktop (screen width > 991px)
    if (window.innerWidth > 991) {
      setOpenDropdown(itemLabel);
    }
  };

  const handleMouseLeave = () => {
    // Only close on mouse leave for desktop
    if (window.innerWidth > 991) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className="menu-container order-lg-1 order-sm-0">
      <div className="d_menu">
        <nav className="navbar navbar-expand-lg mainmenu__menu">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-controls="direo-navbar-collapse"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon icon-menu">
              <i className="la la-reorder"></i>
            </span>
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="direo-navbar-collapse">
            <ul className="navbar-nav">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isDropdownOpen = openDropdown === item.label;

                if (hasSubmenu) {
                  return (
                    <li
                      key={item.href}
                      className={`dropdown has_dropdown ${isDropdownOpen ? 'show' : ''}`}
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={item.href}
                        className="dropdown-toggle"
                        onClick={(e) => {
                          // On mobile, prevent navigation and toggle dropdown
                          if (window.innerWidth <= 991) {
                            e.preventDefault();
                            toggleDropdown(item.label);
                          }
                        }}
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                      >
                        {item.label}
                      </Link>
                      <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                        {item.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link href={subItem.href}>{subItem.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={item.href} className={isActive ? 'active' : ''}>
                    <Link href={item.href} onClick={closeMobileMenu}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

