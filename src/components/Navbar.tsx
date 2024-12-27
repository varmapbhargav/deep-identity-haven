import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnecting, connect, disconnect } = useAuth();
  const location = useLocation();

  const handleConnectClick = () => {
    if (address) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DIDentity
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {address && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === "/dashboard" ? "text-primary" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/attestations"
                  className={`text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === "/attestations" ? "text-primary" : ""
                  }`}
                >
                  Attestations
                </Link>
              </>
            )}
            <Button
              className="button-gradient text-white"
              onClick={handleConnectClick}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : address ? (
                `${address.slice(0, 6)}...${address.slice(-4)}`
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            {address && (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === "/dashboard" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/attestations"
                  className={`block px-3 py-2 text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === "/attestations" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Attestations
                </Link>
              </>
            )}
            <div className="px-3 py-2">
              <Button
                className="button-gradient text-white w-full"
                onClick={handleConnectClick}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : address ? (
                  `${address.slice(0, 6)}...${address.slice(-4)}`
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};