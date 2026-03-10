'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/lib/hooks/useTheme';
import Navigation from './Navigation';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import { assetUrl, getAuthCallbackUrl, userImageUrl } from '@/lib/utils';

interface HeaderProps {
  variant?: 'light' | 'dark' | 'transparent';
  sticky?: boolean;
}

export default function Header({ variant = 'light', sticky = true }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSearchCategories, setShowSearchCategories] = useState(false);
  const [showOffcanvasMenu, setShowOffcanvasMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Handle scroll for sticky header
  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  // Handle body scroll lock when offcanvas is open
  useEffect(() => {
    if (showOffcanvasMenu) {
      document.body.classList.add('offcanvas-open');
    } else {
      document.body.classList.remove('offcanvas-open');
    }

    return () => {
      document.body.classList.remove('offcanvas-open');
    };
  }, [showOffcanvasMenu]);

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserDropdown && !target.closest('.user-profile-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Simple blur handler - much cleaner approach

  const headerClasses = `menu-area menu1 ${
    variant === 'light' ? 'menu--light' : 'menu--dark'
  } ${sticky && isScrolled ? 'menu--fixed' : ''}`;

  // Determine logo based on variant
  // light variant = white logo + white text (used on dark backgrounds like hero)
  // dark variant = dark logo + dark text (used on white/light backgrounds)
  const logoSrc = variant === 'light' ? assetUrl('/images/logo-white.png') : assetUrl('/images/Logo.png');

  return (
    <div className={headerClasses}>
      <div className="top-menu-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="menu-fullwidth">
                {/* Logo */}
                <div className="logo-wrapper order-lg-0 order-sm-1">
                  <div className="logo logo-top">
                    <Link href="/">
                      <img
                        src={logoSrc}
                        alt="Direo Logo"
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                </div>

                {/* Navigation */}
                <Navigation pathname={pathname} />

                {/* Right side actions */}
                <div className="menu-right order-lg-2 order-sm-2">
                  {/* Search Wrapper */}
                  <div className="search-wrapper">
                    <div className={`nav_right_module search_module ${showSearchCategories ? 'active' : ''}`}>
                      <span className="icon-left" id="basic-addon9">
                        <i className="la la-search"></i>
                      </span>
                      <div className="search_area">
                        <form action="/listings">
                          <div className="input-group input-group-light">
                            <input
                              onFocus={() => setShowSearchCategories(true)}
                              onBlur={() => setShowSearchCategories(false)}
                              type="text"
                              name="search"
                              className="form-control search_field top-search-field"
                              placeholder="What are you looking for?"
                              autoComplete="off"
                            />
                          </div>
                        </form>
                      </div>
                      
                    </div>
                    {showSearchCategories && (
                      <div className={`search-categories ${showSearchCategories ? 'active' : ''}`}>
                        <ul className="list-unstyled">
                          <li>
                            <Link href="/listings?category=food-drinks" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-glass bg-danger"></span> Food & Drinks
                            </Link>
                          </li>
                          <li>
                            <Link href="/listings?category=restaurants" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-cutlery bg-primary"></span> Restaurants
                            </Link>
                          </li>
                          <li>
                            <Link href="/listings?category=places" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-map-marker bg-success"></span> Places
                            </Link>
                          </li>
                          <li>
                            <Link href="/listings?category=shopping" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-shopping-cart bg-secondary"></span> Shopping & Store
                            </Link>
                          </li>
                          <li>
                            <Link href="/listings?category=hotels" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-bed bg-info"></span> Hotels
                            </Link>
                          </li>
                          <li>
                            <Link href="/listings?category=art-history" onClick={() => setShowSearchCategories(false)}>
                              <span className="la la-bank bg-warning"></span> Art & History
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Author Area */}
                  <div className="author-area">
                    <div className="author__access_area">
                      <ul className="d-flex list-unstyled align-items-center">
                        
                        
                        {/* Conditional content based on authentication */}
                        {status === 'loading' ? (
                          // Loading state
                          <li>
                            <span className="text-muted">Loading...</span>
                          </li>
                        ) : session ? (
                          // Authenticated user menu
                          <>
                            <li>
                              <Link
                                href="/add-listing"
                                className="btn btn-xs btn-gradient btn-gradient-two"
                              >
                                <span className="la la-plus"></span> Add Listing
                              </Link>
                            </li>
                            
                          </>
                        ) : (
                          // Guest user menu
                          <>
                            <li>
                              <Link
                                href="/add-listing"
                                className="btn btn-xs btn-gradient btn-gradient-two"
                              >
                                <span className="la la-plus"></span> Add Listing
                              </Link>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="access-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowLoginModal(true);
                                }}
                              >
                                Login
                              </a>
                              <span> or </span>
                              <a
                                href="#"
                                className="access-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowRegisterModal(true);
                                }}
                              >
                                Register
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Offcanvas Menu for Mobile */}
                  <div className={`offcanvas-menu ${session ? 'd-lg-block' : 'd-lg-none'}`}>
                    {status === 'loading' ? (
                      <a href="#" className="offcanvas-menu__user loading">
                        <i className="la la-spinner la-spin"></i>
                      </a>
                    ) : session ? (
                      <a
                        href="#"
                        className="offcanvas-menu__user authenticated"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowOffcanvasMenu(true);
                        }}
                      >
                        {session.user?.image ? (
                          <img 
                            src={userImageUrl(session.user.image)} 
                            alt={session.user?.name || 'User'}
                            className="mobile-user-avatar"
                          />
                        ) : (
                          <i className="la la-user"></i>
                        )}
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="offcanvas-menu__user guest"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowLoginModal(true);
                        }}
                      >
                        <i className="la la-user"></i>
                      </a>
                    )}
                    <div className={`offcanvas-menu__contents ${showOffcanvasMenu ? 'active' : ''}`}>
                      <a
                        href="#"
                        className="offcanvas-menu__close"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowOffcanvasMenu(false);
                        }}
                      >
                        <i className="la la-times-circle"></i>
                      </a>
                      
                      {session ? (
                        <>
                          <div className="author-avatar">
                            {session.user?.image ? (
                              <img 
                                src={userImageUrl(session.user.image)} 
                                alt={session.user?.name || 'User'} 
                                className="rounded-circle" 
                              />
                            ) : (
                              <div className="avatar-placeholder-mobile">
                                <i className="la la-user"></i>
                              </div>
                            )}
                          </div>
                          <div className="mobile-user-info">
                            <h5>{session.user?.name || 'User'}</h5>
                            <p className="text-muted">{session.user?.email}</p>
                          </div>
                          <ul className="list-unstyled">
                            <li>
                              <Link href="/dashboard-listings" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-tachometer"></i> Dashboard
                              </Link>
                            </li>
                            <li>
                              <Link href="/author-profile" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-user"></i> My Profile
                              </Link>
                            </li>
                            <li>
                              <Link href="/dashboard/listings" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-list"></i> My Listings
                              </Link>
                            </li>
                            <li>
                              <Link href="/dashboard/messages" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-envelope"></i> Messages
                                <span className="badge badge-primary ml-2">3</span>
                              </Link>
                            </li>
                            <li>
                              <Link href="/dashboard/orders" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-shopping-cart"></i> My Orders
                              </Link>
                            </li>
                            <li>
                              <Link href="/add-listing" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-plus"></i> Add Listing
                              </Link>
                            </li>
                            <li className="logout-item">
                              <button
                                onClick={() => {
                                  setShowOffcanvasMenu(false);
                                  signOut({ callbackUrl: getAuthCallbackUrl('/') });
                                }}
                                className="btn btn-outline-danger btn-block"
                              >
                                <i className="la la-sign-out"></i> Sign Out
                              </button>
                            </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <div className="guest-user-info">
                            <div className="guest-avatar">
                              <i className="la la-user-circle"></i>
                            </div>
                            <h5>Welcome to Direo</h5>
                            <p className="text-muted">Sign in to access your account</p>
                          </div>
                          <ul className="list-unstyled">
                            <li>
                              <button
                                onClick={() => {
                                  setShowOffcanvasMenu(false);
                                  setShowLoginModal(true);
                                }}
                                className="btn btn-primary btn-block mb-2"
                              >
                                <i className="la la-sign-in"></i> Sign In
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  setShowOffcanvasMenu(false);
                                  setShowRegisterModal(true);
                                }}
                                className="btn btn-outline-primary btn-block"
                              >
                                <i className="la la-user-plus"></i> Sign Up
                              </button>
                            </li>
                            <li>
                              <Link href="/add-listing" onClick={() => setShowOffcanvasMenu(false)}>
                                <i className="la la-plus"></i> Add Listing
                              </Link>
                            </li>
                          </ul>
                        </>
                      )}
                      <div className="search_area">
                        <form action="/listings">
                          <div className="input-group input-group-light">
                            <input
                              type="text"
                              className="form-control search_field"
                              placeholder="Search here..."
                              autoComplete="off"
                            />
                          </div>
                          <button type="submit" className="btn btn-sm btn-secondary mt-2">
                            Search
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas Backdrop */}
      {showOffcanvasMenu && (
        <div
          className={`offcanvas-backdrop ${showOffcanvasMenu ? 'active' : ''}`}
          onClick={() => setShowOffcanvasMenu(false)}
        ></div>
      )}

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onSwitchToForgotPassword={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        onSwitchToForgotPassword={() => {
          setShowRegisterModal(false);
          setShowForgotPasswordModal(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSwitchToLogin={() => {
          setShowForgotPasswordModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}

