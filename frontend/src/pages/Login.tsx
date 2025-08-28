import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Eye, EyeOff, LogIn, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (email && password) {
      if (password.length >= 6) {
        try {
          const result = await login(email, password);

          if (result.status === 200 || result.status === 201) {
            toast({
              title: "Login realizado com sucesso!",
              description: "Redirecionando pra tela inicial",
              className: "w-fit text-base px-6 py-4",
            });
            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            toast({
              title: "Usuário não foi encontrado.",
              description: "Credenciais inválidas!",
              className: "w-fit text-base px-6 py-4",
            });
          } else {
            toast({
              title: "Erro interno.",
              description: "Erro ao realizar login",
              className: "w-fit text-base px-6 py-4",
            });
          }
        }
      }
    }

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="w-full max-w-md flex flex-col gap-6 bg-white/95 backdrop-blur-sm border border-green-200/60 shadow-lg shadow-emerald-100/50 px-6 sm:px-10 py-10 rounded-2xl">
          <div className="text-center mb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <BookOpen className="h-8 w-8 text-emerald-700" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600 text-sm">
              Entre na sua conta para acessar o conteúdo
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 text-base border border-gray-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 px-4 pr-12 text-base border border-gray-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-base transition-all duration-200 shadow-md shadow-emerald-200 hover:shadow-emerald-300 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn size={18} />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
