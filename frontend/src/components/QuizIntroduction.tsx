
import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";

const QuizIntroduction = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
        <FileText className="h-10 w-10 text-emerald-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Criar Novo Quiz
      </h1>
      
      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        Para começar, você precisa selecionar as questões que farão parte do seu questionário.
      </p>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-12 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Como funciona?
        </h2>
        
        <div className="space-y-6 text-left">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Explore as questões</h3>
              <p className="text-gray-600">Use os filtros para encontrar questões por tema, fase, dificuldade e mais</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Adicione ao quiz</h3>
              <p className="text-gray-600">Clique em "Adicionar ao Quiz" nas questões que desejar incluir</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 text-sm font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Finalize o quiz</h3>
              <p className="text-gray-600">Volte aqui para revisar e iniciar seu questionário</p>
            </div>
          </div>
        </div>
      </div>
      
      <Link
        to="/questoes?from=quiz"
        className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="mr-3 h-5 w-5" />
        Selecionar Questões
      </Link>
      
      <p className="text-sm text-gray-500 mt-6">
        Você será redirecionado para a página de questões
      </p>
    </div>
  );
};

export default QuizIntroduction;
