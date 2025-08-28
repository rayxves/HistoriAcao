import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Target,
  BookText,
  Filter,
  CheckSquare,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

const Index = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <Parallax pages={3}>
        <ParallaxLayer
          offset={0}
          speed={0.5}
          className="flex justify-center items-center relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("./independencia.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center w-full h-full flex flex-col items-center justify-center ">
            <div className="relative w-full max-w-2xl flex items-center justify-center">
              <div className="absolute z-[-1] -inset-0.5 mx-3 py-3 bg-gradient-to-r from-ring_independency1 to-ring_independency2 rounded-lg blur  group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-8 md:p-10 border border-green-100 shadow-[15_15_15px_5px] shadow-white/50 w-full mx-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Histori<span className="text-green-700">A</span>ção
                </h1>

                <p className="text-md sm:text-lg text-gray-700 mb-8 leading-relaxed">
                  Plataforma digital para explorar e criar questionários com
                  questões das Olimpíadas de História do Brasil, desenvolvida
                  pelo IF Goiano.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/questoes"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 group shadow-md hover:shadow-lg"
                  >
                    Explorar Questões
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/quiz"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg bg-white hover:bg-green-50 transition-all duration-300 shadow-sm"
                  >
                    Criar Quiz
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={0.99}
          speed={0.7}
          className="flex justify-end items-start pointer-events-none"
        >
          <img
            src="/anita-removebg-preview.png"
            alt="Ilustração de Anita Garibaldi"
            className="w-1/3 md:w-1/5 mr-4 md:mr-8 opacity-95"
            style={{
              filter: "drop-shadow(0px 8px 15px rgba(0, 0, 0, 0.2))",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={1}
          className="flex justify-center items-center flex-col px-4 py-16 bg-gradient-to-b from-white to-green-50"
        >
          <div className="text-center mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-gray-700 text-lg md:text-xl">
              Uma ferramenta completa para professores e estudantes explorarem
              as questões das Olimpíadas de História no Brasil.
            </p>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              {
                icon: BookText,
                title: "Explorar",
                desc: "Navegue por questões organizadas por olimpíada, tema, fase, ano e dificuldade",
              },
              {
                icon: Filter,
                title: "Filtrar",
                desc: "Use filtros inteligentes para encontrar exatamente o que precisa",
              },
              {
                icon: CheckSquare,
                title: "Selecionar",
                desc: "Adicione questões ao seu quiz personalizado com um clique",
              },
              {
                icon: Play,
                title: "Aplicar",
                desc: "Use o quiz criado em suas aulas ou estudos",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.9}
          speed={0.7}
          className="flex justify-start items-center pointer-events-none"
        >
          <img
            src="/zumbi.png"
            alt="Ilustração de Zumbi dos Palmares"
            className="w-1/3 md:w-1/5 mr-4 md:mr-8 opacity-85"
            style={{
              filter: "drop-shadow(0px 8px 15px rgba(0, 0, 0, 0.2))",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={1}
          className="flex justify-center items-center relative bg-gradient-to-br from-green-600 to-green-700"
        >
          <div className="text-center w-full h-full flex flex-col items-center justify-center px-4 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/20 max-w-2xl ">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comece agora
              </h2>
              <p className="text-md sm:text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
                Descubra uma nova forma de ensinar e aprender História com
                questões cuidadosamente selecionadas das Olimpíadas.
              </p>
              <Link
                to="/questoes"
                className="inline-flex items-center px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Começar Exploração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Index;
