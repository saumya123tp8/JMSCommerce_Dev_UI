import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
// import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { useCategories } from "@/hooks/useCategories";
// import { useCart } from "../../context/cart";
// import { Badge } from "antd";
import { Menu, X, ChevronDown } from "lucide-react";
import type {AuthState} from "../../types/auth";
import { useAppSelector,useAppDispatch } from "../../redux/hooks";
import { loginThunk } from "../../redux/thunks/authThunks/loginThunk";
import { logout } from "../../redux/slices/authSlice";

const Header: React.FC = () => {
  //   const [auth, setAuth] = useAuth();
  //   const [cart] = useCart();
  // const [auth, setAuth] = useState(true);
  const [cart, setCart] = useState("");
  const { categories } = useCategories({ activeOnly: true });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state)=>state.auth);
  console.log("auth in header", auth);
  const handleLogout = (): void => {
    // setAuth({
    //   ...auth,
    //   user: null,
    //   token: "",
    // });
    // setAuth(false);
    dispatch(logout());
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap text-lg font-bold tracking-wide md:text-xl"
        >
          ☕ Ambani Coffee
        </Link>
        {/* Search - hidden on mobile, shown on md+ */}
        <div className="hidden flex-1 max-w-sm md:block">
          <SearchInput />
        </div>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 text-sm font-medium uppercase tracking-wide md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-black pb-1"
                : "text-muted-foreground hover:text-black"
            }
          >
            Home
          </NavLink>

          <div className="group relative">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-black">
              Categories
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 normal-case opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
              <Link
                to="/categories"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
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
            </div>
          </div>

          {!auth?.isAuthenticated ? (
          // {!auth ? (
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
              <button className="text-muted-foreground hover:text-black">
                {auth?.user?.name}
                {/* UserName */}
              </button>
              <div className="invisible absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 normal-case shadow-md opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <NavLink
                    // to={`/dashboard/`}
                  to={`/dashboard/${auth?.user?.roles?.includes("ADMIN")? "admin" : "user"}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  onClick={handleLogout}
                  to="/login"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </NavLink>
              </div>
            </div>
          )}


          <NavLink to="/cart" className="relative flex items-center gap-1">
            Cart
            <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {/* {cart?.length ?? 0} */}
              0
            </span>
          </NavLink>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t bg-white px-4 pb-4 pt-2 text-sm font-medium md:hidden">
          <div className="pb-2">
            <SearchInput />
          </div>

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "py-2 font-semibold" : "py-2 text-muted-foreground"
            }
          >
            Home
          </NavLink>

          <div>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex w-full items-center justify-between py-2 text-muted-foreground"
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {categoriesOpen && (
              <div className="flex flex-col gap-1 pl-4">
                <Link
                  to="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="py-1 text-muted-foreground"
                >
                  All Categories
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="py-1 text-muted-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!auth?.isAuthenticated ? (
            <>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className="py-2 text-muted-foreground">
                Register
              </NavLink>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="py-2 text-muted-foreground">
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`/dashboard/${auth?.user?.roles?.includes("ADMIN") ? "admin" : "user"}`}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-muted-foreground"
              >
                Dashboard
              </NavLink>
              <NavLink
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                to="/login"
                className="py-2 text-muted-foreground"
              >
                Logout
              </NavLink>
            </>
          )}

          

          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-muted-foreground"
          >
            Cart
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {/* {cart?.length ?? 0} */}
              0
            </span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Header;