import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { marked } from "marked";
import { getQuestionsByFilters } from "@/services/questionServices";
import { getAllTopics } from "@/services/topicServices";
import { QuestionDto, QuestionApiFilters } from "@/types/question";
import { TopicDto } from "@/types/topic";
import { DocumentDto } from "@/types/document";
import Header from "@/components/Header";
import CompactQuestionFilters from "@/components/CompactQuestionFilters";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  Check,
  X,
} from "lucide-react";
import QuestionCard from "@/components/QuestionCard";

const Questoes = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [allTopics, setAllTopics] = useState<TopicDto[]>([]);
  const [filters, setFilters] = useState<QuestionApiFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [viewingDocument, setViewingDocument] = useState<DocumentDto | null>(
    null
  );
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionsPerPage = 5;

  const isFromQuiz =
    location.state?.fromQuiz === true || searchParams.get("from") === "quiz";

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getAllTopics();
        setAllTopics(topicsData);
      } catch (error) {
        console.error("Erro ao buscar tópicos:", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const activeFilters: QuestionApiFilters = { ...filters };
        if (searchTerm) {
          activeFilters.search = searchTerm;
        }

        if (
          (filters.topicName || filters.subtopicName) &&
          !searchParams.get("dataManual")
        ) {
          delete activeFilters.inicialDate;
          delete activeFilters.finishDate;
        }

        Object.keys(activeFilters).forEach((key) => {
          if (
            activeFilters[key as keyof QuestionApiFilters] == null ||
            activeFilters[key as keyof QuestionApiFilters] === ""
          ) {
            delete activeFilters[key as keyof QuestionApiFilters];
          }
        });
        const data = await getQuestionsByFilters(activeFilters);
        setQuestions(data);
      } catch (error) {
        console.error("Erro ao buscar questões:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const getVisiblePages = () => {
    const maxVisible = 4;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - Math.floor(maxVisible / 2);
    let end = currentPage + Math.floor(maxVisible / 2);

    if (start < 1) {
      start = 1;
      end = maxVisible;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    return questions.slice(startIndex, startIndex + questionsPerPage);
  }, [questions, currentPage]);

  const handleAnswerSelect = (questionId: number, alternativeId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: alternativeId,
    }));
  };

  const handleAddToQuiz = (question: QuestionDto) => {
    const savedQuestions = localStorage.getItem("selectedQuestions");
    const selectedQuestions: QuestionDto[] = savedQuestions
      ? JSON.parse(savedQuestions)
      : [];

    if (!selectedQuestions.find((q) => q.id === question.id)) {
      selectedQuestions.push(question);
      localStorage.setItem(
        "selectedQuestions",
        JSON.stringify(selectedQuestions)
      );
      showNotification("success", "Questão adicionada ao quiz!");
    } else {
      showNotification("error", "Esta questão já foi adicionada ao quiz!");
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 3000);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            notification.show ? "animate-fade-in" : "animate-fade-out"
          }`}
        >
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-emerald-100 border border-emerald-200"
                : "bg-red-100 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="h-5 w-5 text-emerald-600 mr-2" />
            ) : (
              <X className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span
              data-testId="notification"
              className={`text-sm ${
                notification.type === "success"
                  ? "text-emerald-800"
                  : "text-red-800"
              }`}
            >
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          {isFromQuiz && (
            <div className="w-full flex justify-end">
              {" "}
              <button
                onClick={() => navigate("/quiz")}
                className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
              >
                <span>Voltar ao Quiz</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 sm:mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Explorar Questões
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Encontre questões por fase, tema, nível de dificuldade e muito
                mais.
              </p>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search
              className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar questões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 md:pl-6 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <button
              data-testId="show-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 ring-1 ring-gray-300/[.50] shadow-sm rounded-lg bg-white/90 hover:outline-0 focus:outline-0 hover:border-1 hover:border-gray-300 text-sm sm:text-md"
            >
              <Filter size={14} />
              Filtros {showFilters ? "−" : "+"}
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600">
                {questions.length} quest{questions.length !== 1 ? "ões" : "ão"}{" "}
                encontrada{questions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8">
            <CompactQuestionFilters
              filters={filters}
              onFiltersChange={setFilters}
              allTopics={allTopics}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou termos de busca para encontrar o que
              procura.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {paginatedQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  isFromQuiz={isFromQuiz}
                  userAnswerId={userAnswers[question.id]}
                  onAnswerSelect={handleAnswerSelect}
                  onAddToQuiz={handleAddToQuiz}
                  onViewDocument={setViewingDocument}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 md:space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-2 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden md:inline">Anterior</span>
                </button>
                <div className="flex space-x-1">
                  {getVisiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                        currentPage === page
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-2 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden md:inline">Próxima</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {viewingDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setViewingDocument(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl sm:max-w-[80vw] md:max-w-[70vw] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {viewingDocument.titulo || "Documento"}
              </h3>
              <p className="text-sm text-gray-500">
                {viewingDocument.tipo}{" "}
                {viewingDocument.origem &&
                  `- Origem: ${viewingDocument.origem}`}
              </p>
            </div>

            {viewingDocument.url && (
              <div className="p-6">
                <img
                  src={viewingDocument.url}
                  alt=""
                  className="mx-auto max-h-[70vh]"
                />
                {viewingDocument.descricao && (
                  <div
                    className="text-sm text-gray-500 p-2 text-center"
                    dangerouslySetInnerHTML={{
                      __html: marked(viewingDocument.descricao) as string,
                    }}
                  />
                )}
              </div>
            )}

            {viewingDocument.texto && (
              <>
                <div
                  className="p-6 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: marked(viewingDocument.texto) as string,
                  }}
                />
                {viewingDocument.descricao && !viewingDocument.url && (
                  <div>
                    <p className="text-sm text-gray-500 p-2 text-center">
                      {viewingDocument.descricao}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="p-4 bg-gray-50 border-t text-right">
              <button
                onClick={() => setViewingDocument(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questoes;
