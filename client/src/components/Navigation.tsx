import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BookOpen, Home, Library, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    ...(user ? [
      { path: "/library", label: "My Library", icon: Library },
      { path: "/profile", label: "Profile", icon: User },
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-hero rounded-lg shadow-glow group-hover:shadow-lg transition-all">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                LearnHub
              </h1>
              <p className="text-xs text-muted-foreground">Discover & Learn</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "transition-all",
                    isActive(item.path) ? "shadow-elegant" : ""
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Avatar className="cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};