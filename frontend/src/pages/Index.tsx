
import { ArrowRight, BookOpen, Users, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding py-20">
        <div className="container-width">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Histori<span className="text-green-700">A</span>ção
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma digital para explorar e criar questionários com questões das 
              Olimpíadas de História do Brasil, desenvolvida pelo IF Goiano.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/questoes"
                className="inline-flex items-center px-8 py-4 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors shadow-modern-lg group"
              >
                Explorar Questões
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/quiz"
                className="inline-flex items-center px-8 py-4 border-2 border-green-700 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors"
              >
                Criar Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding py-16 bg-white">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uma ferramenta completa para professores e estudantes explorarem 
              as questões das Olimpíadas de História no Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Explorar</h3>
              <p className="text-gray-600 text-sm">
                Navegue por questões organizadas por tema, fase, ano e dificuldade
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Filtrar</h3>
              <p className="text-gray-600 text-sm">
                Use filtros inteligentes para encontrar exatamente o que precisa
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Selecionar</h3>
              <p className="text-gray-600 text-sm">
                Adicione questões ao seu quiz personalizado com um clique
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aplicar</h3>
              <p className="text-gray-600 text-sm">
                Use o quiz criado em suas aulas ou estudos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-16 bg-green-700">
        <div className="container-width text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Comece agora
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Descubra uma nova forma de ensinar e aprender História com 
            questões cuidadosamente selecionadas das Olimpíadas.
          </p>
          
          <Link
            to="/questoes"
            className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-modern-lg"
          >
            Começar Exploração
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
