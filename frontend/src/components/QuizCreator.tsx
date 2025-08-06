import { useState } from "react";
import { QuestionDto } from "@/types/question";
import { exportQuestionsToPDF } from "@/utils/pdfExport";
import {
  Trash2,
  Play,
  Download,
  FileText,
  ArrowLeft,
  Trash,
} from "lucide-react";

interface QuizCreatorProps {
  selectedQuestions: QuestionDto[];
  onRemoveQuestion: (questionId: number) => void;
  onRemoveAllQuestions: () => void;
  onStartQuiz: () => void;
  onBack: () => void;
}

const QuizCreator = ({
  selectedQuestions,
  onRemoveQuestion,
  onRemoveAllQuestions,
  onStartQuiz,
  onBack,
}: QuizCreatorProps) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const title = quizTitle.trim() || "Questões Selecionadas";

    try {
      await exportQuestionsToPDF(selectedQuestions, title);
    } catch (error) {
      console.error("Falha ao exportar PDF:", error);
      alert(
        "Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.length === 0) {
      alert("Selecione pelo menos uma questão para iniciar o quiz!");
      return;
    }
    onStartQuiz();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-row gap-2 sm:gap-0 items-center justify-between">
        <div className="">
          <div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Criar Questionário
            </h1>
            <p className="text-gray-600 mt-2">
              Revise suas questões selecionadas e finalize seu quiz.
            </p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-md">
          <p className="text-emerald-800 font-semibold">
            {selectedQuestions.length} quest
            {selectedQuestions.length !== 1 ? "ões" : "ão"} selecionada
            {selectedQuestions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Quiz Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Configurações do Quiz
        </h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Título do Questionário
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Digite o título do questionário"
            className="w-full p-3 sm:p-4 border-2 border-emerald-400 focus:border-0 focus:outline-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
          />
        </div>
      </div>

      {/* Selected Questions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Questões Selecionadas
          </h3>
          {selectedQuestions.length > 0 && (
            <button
              onClick={onRemoveAllQuestions}
              className="flex h-full items-center gap-1 sm:gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm sm:text-md"
            >
              <Trash className="h-4 " />
              Remover Todas
            </button>
          )}
        </div>

        {selectedQuestions.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 text-lg">
              Nenhuma questão selecionada ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
            {selectedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-center justify-between px-4 sm:px-6 py-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="sm:text-lg font-bold text-gray-900">
                      {index + 1}.
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 bg-emerald-100 px-3 py-1 rounded-full">
                      {question.olimpiada}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                      {question.fase}ª Fase
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {question.topico}
                  </h4>
                  {question.subtopico && (
                    <p className="text-sm text-gray-600">
                      {question.subtopico}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onRemoveQuestion(question.id)}
                  className="sm:p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-4"
                  title="Remover questão"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleStartQuiz}
          disabled={selectedQuestions.length === 0}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Play size={20} />
          Iniciar Questionário
        </button>
        <button
          onClick={handleExportPDF}
          disabled={selectedQuestions.length === 0 || isExporting}
          className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          Exportar PDF
        </button>
      </div>
    </div>
  );
};

export default QuizCreator;
