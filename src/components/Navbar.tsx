import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          VaultGuard
        </Link>
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <>
              {location.pathname !== "/login" && (
                <Button asChild variant="secondary"><Link to="/login">Login</Link></Button>
              )}
              {location.pathname !== "/register" && (
                <Button asChild><Link to="/register">Register</Link></Button>
              )}
            </>
          )}
          {isAuthenticated && (
            <Button variant="outline" onClick={logout} aria-label="Logout">Logout</Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
