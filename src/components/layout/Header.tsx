import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import {  CircleUserRound } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useCart } from "@/hooks/useCart";

const Header: React.FC = () => {

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { cart } = useCart();
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const isDashboardAdmin = auth?.user?.roles?.some((role: any) =>
    ["ROLE_DEVELOPER", "ROLE_ADMIN"].includes(role.name)
  );

  const handleLogout = (): void => {
    dispatch(logout());
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    setAccountMenuOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#E8DDD0] bg-white/95 shadow-[0_4px_18px_rgba(46,31,20,0.08)] backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-2.5 md:px-6 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="min-w-0 flex items-center gap-2 whitespace-nowrap text-base font-bold tracking-wide text-[#2E1F14] sm:text-lg md:text-xl"
        >
          <span aria-hidden="true">☕</span>
          <span className="truncate">Ambani Coffee</span>
        </Link>

        {/* Search - desktop only, mobile gets its own permanent row below */}
        <div className="hidden max-w-sm flex-1 md:block">
          <SearchInput />
        </div>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 text-sm font-medium uppercase tracking-wide md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "border-b-2 border-black pb-1" : "text-muted-foreground hover:text-black"
            }
          >
            Home
          </NavLink>

          <div className="group relative">
            {/* <button className="flex items-center gap-1 text-muted-foreground hover:text-black">
              Categories
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 normal-case opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
              <Link to="/categories" className="block px-4 py-2 text-sm hover:bg-gray-100">
                All Categories
              </Link>
              {categories?.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {c.name}
                </Link>
              ))}
            </div> */}
            <button className="flex items-center gap-1 text-muted-foreground hover:text-black">
            <Link to="/categories" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Categories
              </Link>
            </button>
          </div>

          {!auth?.isAuthenticated ? (
            <>
              <NavLink to="/register" className="text-muted-foreground hover:text-black">
                Register
              </NavLink>
              <NavLink to="/login" className="text-muted-foreground hover:text-black">
                Login
              </NavLink>
            </>
          ) : (
            <div className="group relative">
              <button className="text-muted-foreground hover:text-black">{auth?.user?.name}</button>
              <div className="invisible absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 normal-case opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                <NavLink
                  to={`/dashboard/${isDashboardAdmin ? "admin" : "user"}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
                <NavLink onClick={handleLogout} to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Logout
                </NavLink>
              </div>
            </div>
          )}

          <NavLink to="/cart" className="relative flex items-center gap-1">
            Cart
            <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          </NavLink>
        </div>

        {/* Mobile: account icon replaces hamburger */}
        <div className="relative md:hidden">
          <button
            onClick={() => setAccountMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DDD0] bg-[#FBF7F2] transition-colors hover:bg-[#F3EAE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E1F14]/30"
            aria-label="Account menu"
          >
            <CircleUserRound className="h-7 w-7 text-[#3F2E22]" strokeWidth={1.5} />
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 top-full z-[60] mt-2 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#E8DDD0] bg-white p-1 shadow-lg">
      
              {!auth?.isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#3F2E22] transition-colors hover:bg-[#F7F2EC]"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#3F2E22] transition-colors hover:bg-[#F7F2EC]"
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to={`/dashboard/${isDashboardAdmin ? "admin" : "user"}`}
                    onClick={() => setAccountMenuOpen(false)}
                    className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#3F2E22] transition-colors hover:bg-[#F7F2EC]"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block min-h-11 w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#3F2E22] transition-colors hover:bg-[#F7F2EC]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: permanent search row, no toggle */}
      <div className="border-t border-[#E8DDD0] bg-[#FCFAF7] px-3 py-2.5 md:hidden">
        <SearchInput />
      </div>
    </nav>
  );
};

export default Header;