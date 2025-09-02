import { useState, useEffect } from "react";
import { QuestionDto } from "@/types/question";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import { DocumentDto } from "@/types/document";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ImageWithLoader from "@/components/ImageWithLoader";

interface QuizPlayerProps {
  questions: QuestionDto[];
  onBack: () => void;
}

interface QuizResults {
  score: number;
  maxPossibleScore: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  answersBreakdown: {
    questionId: number;
    pointsEarned: number;
    maxPoints: number;
  }[];
}

const QuizPlayer = ({ questions, onBack }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDto | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    if (!selectedDoc) return;

    if (selectedDoc.url) {
      setIsModalLoading(true);
      const img = new Image();
      img.src = selectedDoc.url;
      img.onload = () => setIsModalLoading(false);
      img.onerror = () => setIsModalLoading(false);
    } else {
      setIsModalLoading(false);
    }
  }, [selectedDoc]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId: number, alternativeId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: alternativeId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleViewDocument = (doc: DocumentDto) => {
    setSelectedDoc(doc);
  };

  const calculateResults = (): QuizResults => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const answersBreakdown = [];

    questions.forEach((question) => {
      const maxPoints = Math.max(
        ...(question.alternativas?.map((a) => a.pontuacao) || [0])
      );
      maxPossibleScore += maxPoints;

      const userAnswerId = userAnswers[question.id];
      if (userAnswerId) {
        const selectedAlternative = question.alternativas?.find(
          (a) => a.id === userAnswerId
        );
        const pointsEarned = selectedAlternative?.pontuacao || 0;
        totalScore += pointsEarned;

        answersBreakdown.push({
          questionId: question.id,
          pointsEarned,
          maxPoints,
        });
      } else {
        answersBreakdown.push({
          questionId: question.id,
          pointsEarned: 0,
          maxPoints,
        });
      }
    });

    return {
      score: totalScore,
      maxPossibleScore,
      totalQuestions: questions.length,
      percentage: Math.round((totalScore / maxPossibleScore) * 100),
      timeSpent,
      answersBreakdown,
    };
  };

  const handleFinishQuiz = () => {
    const results = calculateResults();
    setQuizResults(results);
    setIsQuizFinished(true);
  };

  const handleFinalClose = () => {
    onBack();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (isQuizFinished && quizResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[95vw] mx-auto py-4 sm:py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Award className="h-12 w-12 text-emerald-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Concluído!
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-800">
                      Pontuação
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">
                    {quizResults.score}/{quizResults.maxPossibleScore} pts
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <span className="text-lg font-semibold text-purple-800">
                      Desempenho
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">
                    {quizResults.percentage}%
                  </p>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <span className="text-lg font-semibold text-amber-800">
                      Tempo
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatTime(quizResults.timeSpent)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Detalhes por questão:
                </h3>
                <div className="space-y-3">
                  {quizResults.answersBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>Questão {index + 1}:</span>
                      <span className="font-medium">
                        {item.pointsEarned} / {item.maxPoints} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFinalClose}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Voltar para a lista de questões
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedDoc.titulo || "Documento"}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedDoc.tipo}{" "}
                {selectedDoc.origem && `- Origem: ${selectedDoc.origem}`}
              </p>
            </div>

            {isModalLoading ? (
              <div className="flex-grow flex items-center justify-center p-6 min-h-[200px]">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              </div>
            ) : (
               <div className="overflow-y-auto">
                {selectedDoc.url && (
                  <div className="p-6">
                    <ImageWithLoader
                      src={selectedDoc.url}
                      alt={selectedDoc.titulo || "Documento"}
                      containerClassName="mx-auto"
                      className="max-h-[70vh] object-contain"
                    />
                    {selectedDoc.descricao && (
                      <div
                        className="text-sm text-gray-500 p-2 text-center"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            marked.parse(selectedDoc.descricao) as string
                          ),
                        }}
                      />
                    )}
                  </div>
                )}

                {selectedDoc.texto && (
                  <>
                    <div
                      className="p-6 prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          marked.parse(selectedDoc.texto) as string
                        ),
                      }}
                    />
                    {selectedDoc.descricao && !selectedDoc.url && (
                      <div>
                        <p className="text-sm text-gray-500 p-2 text-center">
                          {selectedDoc.descricao}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            <div className="p-4 bg-gray-50 border-t text-right mt-auto">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[95vw] mx-auto py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-600">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>

          <div className="p-2 sm:p-6">
            <QuestionCard
              question={currentQuestion}
              userAnswerId={userAnswers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              onViewDocument={handleViewDocument}
            />
          </div>

          <div className="p-6 border-t flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Próxima
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Finalizar Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;