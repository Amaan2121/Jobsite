import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLocation("/");
    window.location.reload();
  };

  const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => {
    const isActive = location === href;
    const baseClasses = mobile 
      ? "block px-3 py-2 text-base font-medium" 
      : "px-3 py-2 text-sm font-medium";
    
    const activeClasses = isActive 
      ? "text-primary" 
      : "text-neutral-600 hover:text-primary";

    return (
      <button
        onClick={() => {
          setLocation(href);
          if (mobile) setMobileMenuOpen(false);
        }}
        className={`${baseClasses} ${activeClasses}`}
        data-testid={`nav-link-${href.replace("/", "") || "home"}`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => setLocation("/")}
                className="text-2xl font-bold text-primary"
                data-testid="logo"
              >
                KareerAI
              </button>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <NavLink href="/jobs">Find Jobs</NavLink>
              <NavLink href="/companies">Companies</NavLink>
              <NavLink href="/latex-editor">Resume Editor</NavLink>
              <NavLink href="/#ai-tools">AI Tools</NavLink>
              <NavLink href="/#salary-guide">Salary Guide</NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden md:block"
              data-testid="button-for-employers"
            >
              For Employers
            </Button>
            
            {user?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="dropdown-user-menu">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-item-profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setLocation("/login")}
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavLink href="/jobs" mobile>Find Jobs</NavLink>
                  <NavLink href="/companies" mobile>Companies</NavLink>
                  <NavLink href="/latex-editor" mobile>Resume Editor</NavLink>
                  <NavLink href="/#ai-tools" mobile>AI Tools</NavLink>
                  <NavLink href="/#salary-guide" mobile>Salary Guide</NavLink>
                  
                  {!user?.user && (
                    <>
                      <div className="border-t border-neutral-200 pt-4">
                        <Button 
                          onClick={() => {
                            setLocation("/login");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full mb-2"
                          data-testid="mobile-button-sign-in"
                        >
                          Sign In
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setLocation("/register");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full"
                          data-testid="mobile-button-register"
                        >
                          Sign Up
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
