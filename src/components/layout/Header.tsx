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
    <nav className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap text-lg font-bold tracking-wide md:text-xl"
        >
          ☕ Ambani Coffee
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
        <div className="relative flex h-full shrink-0 items-center md:hidden">
          <button
            onClick={() => setAccountMenuOpen((v) => !v)}
            className="flex items-center justify-center"
            aria-label="Account menu"
          >
            <CircleUserRound className="h-7 w-7 text-[#3F2E22]" strokeWidth={1.5} />
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-44 max-w-[calc(100vw-2rem)] rounded-md border bg-white py-1 shadow-md">
      
              {!auth?.isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#3F2E22] hover:bg-gray-100"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#3F2E22] hover:bg-gray-100"
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to={`/dashboard/${isDashboardAdmin ? "admin" : "user"}`}
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#3F2E22] hover:bg-gray-100"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-[#3F2E22] hover:bg-gray-100"
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
      <div className="flex h-12 items-center border-t px-4 py-2 md:hidden">
        <SearchInput />
      </div>
    </nav>
  );
};

export default Header;