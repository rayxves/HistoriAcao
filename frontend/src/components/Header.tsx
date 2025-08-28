import { Link } from "react-router-dom";
import { Home, BookOpen, Plus, Menu, X, Activity } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-700">
      <div className="bg-green-700 text-white py-2">
        <div className=" mx-auto px-4">
          <div className="flex justify-end items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Instituto Federal Goiano</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src="/if-goiano-icon/fdc0dc36-5857-4d56-af96-bfc771d71966.png"
                alt="IF Goiano"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 ">
                  Histori<span className="text-green-700">A</span>ção
                </h1>
                <p className="text-sm text-green-700 font-medium">
                  IF Goiano - Campus Morrinhos
                </p>
              </div>
            </div>
          </div>

          <nav
            className={
              user
                ? "hidden lg:flex items-center space-x-8"
                : "hidden md:flex items-center space-x-8"
            }
          >
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
            >
              <Home size={20} />
              <span>Início</span>
            </Link>
            <Link
              to="/questoes"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
            >
              <BookOpen size={20} />
              <span>Explorar Questões</span>
            </Link>
            {user && (
              <Link
                to="/analytics"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
              >
                <Activity size={20} />
                <span>Ver análises</span>
              </Link>
            )}
            <Link
              to="/quiz"
              className="flex items-center space-x-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Criar Quiz</span>
            </Link>
          </nav>

          <button
            className={user ? "lg:hidden p-2 text-gray-600 hover:text-green-700" : "md:hidden p-2 text-gray-600 hover:text-green-700"}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav
            className={
              user
                ? "lg:hidden mt-4 py-4 border-t border-gray-200 "
                : "md:hidden  mt-4 py-4 border-t border-gray-200 "
            }
          >
            <div className="flex flex-col w-full justify-end space-y-3">
              <Link
                to="/"
                className="flex w-full items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={20} />
                <span>Início</span>
              </Link>
              <Link
                to="/questoes"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen size={20} />
                <span>Explorar Questões</span>
              </Link>
              {user && (
                <Link
                  to="/analytics"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-700 transition-colors font-medium px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Activity size={20} />
                  <span>Ver análises</span>
                </Link>
              )}
              <Link
                to="/quiz"
                className="flex items-center space-x-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors font-medium w-fit"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus size={20} />
                <span>Criar Quiz</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
