import { ArrowRight, BookOpen, Users, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

const Index = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <Header />
      <Parallax pages={3}>
        <ParallaxLayer
          offset={0}
          speed={0.5}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("./independencia.jpg"), url("./brasil.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center max-w-2xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Histori<span className="text-green-700">A</span>ção
            </h1>
            <p className="text-xl text-gray-900 mb-8 leading-relaxed">
              Plataforma digital para explorar e criar questionários com
              questões das Olimpíadas de História do Brasil, desenvolvida pelo
              IF Goiano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/questoes"
                className="inline-flex items-center justify-center mx-2 sm:mx-0 px-8 py-4 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors shadow-modern-lg group"
              >
                Explorar Questões
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center mx-2 sm:mx-0  px-8 py-4 border-2 border-green-700 text-green-700 font-medium rounded-lg bg-green-50 opacity-80 hover:opacity-100 transition-colors"
              >
                Criar Quiz
              </Link>
            </div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0.99}
          speed={0.7}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            pointerEvents: "none",
          }}
        >
          <img
            src="/anita-removebg-preview.png"
            alt="Ilustração de Zumbi dos Palmares"
            className="w-1/4 md:w-1/5 mr-8 rounded-xl"
          />
        </ParallaxLayer>

        {/* <ParallaxLayer
          offset={1}
          speed={0.1}
          style={{ backgroundColor: "white" }}
        /> */}

        <ParallaxLayer
          offset={1}
          speed={0.8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "white",
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Uma ferramenta completa para professores e estudantes explorarem
              as questões das Olimpíadas de História no Brasil.
            </p>
          </div>
          <div className="container-width grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Explorar</h3>
              <p className="text-gray-800 text-sm">
                Navegue por questões organizadas por tema, fase, ano e
                dificuldade
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Filtrar</h3>
              <p className="text-gray-800 text-sm">
                Use filtros inteligentes para encontrar exatamente o que precisa
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Selecionar</h3>
              <p className="text-gray-800 text-sm">
                Adicione questões ao seu quiz personalizado com um clique
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aplicar</h3>
              <p className="text-gray-800 text-sm">
                Use o quiz criado em suas aulas ou estudos
              </p>
            </div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.95}
          speed={0.1}
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("./independencia.jpg"), url("./brasil.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <ParallaxLayer
          offset={2}
          speed={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#15803d",
            position: "relative",
            backgroundImage: `
            linear-gradient(
              to bottom right, 
              #15803d 50%, 
              transparent 100%
            ), 
            url("./brasil.jpg")
  `,

            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container-width text-center justify-between z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Comece agora</h2>
            <p className="text-gray-50 text-lg mb-8 max-w-2xl mx-6 sm:mx-4 md:mx-auto ">
              Descubra uma nova forma de ensinar e aprender História com
              questões cuidadosamente selecionadas das Olimpíadas.
            </p>
            <Link
              to="/questoes"
              className="inline-flex items-center px-5 py-2.5 sm:px-8 sm:py-4 bg-white text-green-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-modern-lg"
            >
              Começar Exploração
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <img
            src="/zumbi-removebg-preview.png"
            alt="Ilustração de Zumbi dos Palmares"
            className="absolute bottom-0 left-0 w-[30%] sm:w-[20%] md:w-[15%] opacity-90"
          />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Index;
