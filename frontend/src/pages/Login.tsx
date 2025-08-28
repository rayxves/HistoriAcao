import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (email && password) {
      if (password.length >= 6) {
        localStorage.setItem("auth_user", JSON.stringify({ email }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("A senha deve ter pelo menos 6 caracteres");
      }
    } else {
      setError("Por favor, preencha todos os campos");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">      <header className="p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-primary">Analytics Pro</h1>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-foreground mb-2">
              Entrar
            </h2>
            <p className="text-muted-foreground text-sm">
              Acesse seus dados do Google Analytics
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 text-base border-0 bg-muted/50 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all duration-200"
                />
              </div>
              
              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 text-base border-0 bg-muted/50 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all duration-200"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-medium text-base transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;