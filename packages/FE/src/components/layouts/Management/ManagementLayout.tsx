import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, UtensilsCrossed, Package, Ruler, Tags, ChefHat, Users, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { to: "/management", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/management/recipes", label: "Recipes", icon: UtensilsCrossed },
  { to: "/management/ingredients", label: "Ingredients", icon: Package },
  { to: "/management/units", label: "Units", icon: Ruler },
  { to: "/management/categories", label: "Categories", icon: Tags },
  { to: "/management/kitchenware", label: "Kitchenware", icon: ChefHat },
  { to: "/management/users", label: "Users", icon: Users },
];

const ManagementLayout = () => {
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f7] text-[#1a1c1b]">
      <aside className="hidden md:flex h-screen w-64 border-r border-stone-200/50 glass-sidebar flex-col sticky top-0 z-50">
        <div className="py-8 px-6">
          <h1 className="font-serif text-xl text-stone-900 italic">
            Management
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-stone-400 mt-1">
            Management Panel
          </p>
        </div>
        <nav className="flex-grow">
          <ul className="flex flex-col space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <li
                  key={to}
                  className={
                    active
                      ? "bg-stone-200/60 text-stone-900 border-l-4 border-stone-900 px-6 py-3 flex items-center transition-all"
                      : "text-stone-500 px-6 py-3 flex items-center hover:bg-stone-100/50 transition-all cursor-pointer"
                  }
                >
                  <Link to={to} className="flex items-center w-full">
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-sans text-sm tracking-wide uppercase font-medium">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-6 border-t border-stone-200/50">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Site
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
              <div className="h-full w-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm font-medium">
                A
              </div>
            </div>
            <div>
              <p className="font-sans text-xs font-bold text-stone-900">
                Admin User
              </p>
              <p className="font-sans text-[10px] text-stone-500 uppercase tracking-tighter">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 max-w-[1200px] mx-auto px-8 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagementLayout;
