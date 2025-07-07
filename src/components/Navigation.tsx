
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onAuthClick: () => void;
}

const Navigation = ({ onAuthClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              DocuFlow
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-white text-black hover:bg-gray-200"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/docs" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <Link 
                to="/blog" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => {
                      onAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white text-black hover:bg-gray-200"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
