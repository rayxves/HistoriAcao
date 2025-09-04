import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QuestionDto } from "@/types/question";
import Header from "@/components/Header";
import QuizCreator from "@/components/QuizCreator";
import QuizPlayer from "@/components/QuizPlayer";
import QuizIntroduction from "@/components/QuizIntroduction";
import { Check, X } from "lucide-react";

type QuizState = "empty" | "creating" | "playing";

const Quiz = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionDto[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("empty");
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const location = useLocation();

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 3000);
  };

  useEffect(() => {
    const loadSelectedQuestions = () => {
      const savedQuestions = localStorage.getItem("selectedQuestions");
      if (savedQuestions) {
        try {
          const parsed: QuestionDto[] = JSON.parse(savedQuestions);
          if (Array.isArray(parsed)) {
            setSelectedQuestions(parsed);
            setQuizState(parsed.length > 0 ? "creating" : "empty");
          }
        } catch (error) {
          showNotification("error", "Não foi possível carregar o quiz salvo.");
          localStorage.removeItem("selectedQuestions");
          setSelectedQuestions([]);
          setQuizState("empty");
        }
      } else {
        setSelectedQuestions([]);
        setQuizState("empty");
      }
    };

    loadSelectedQuestions();
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "selectedQuestions",
        JSON.stringify(selectedQuestions)
      );
    } catch (error) {
      showNotification(
        "error",
        "Ocorreu um erro ao salvar o progresso do quiz."
      );
    }
  }, [selectedQuestions]);

  const handleRemoveQuestion = (questionId: number) => {
    const updatedQuestions = selectedQuestions.filter(
      (q) => q.id !== questionId
    );
    setSelectedQuestions(updatedQuestions);
    if (updatedQuestions.length === 0) {
      setQuizState("empty");
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.length > 0) {
      setQuizState("playing");
    } else {
      showNotification("error", "Adicione questões ao quiz para começar.");
    }
  };

  const handleRemoveAllQuestions = () => {
    setSelectedQuestions([]);
    setQuizState("empty");
  };

  const handleBackToCreating = () => {
    setQuizState("creating");
  };

  const handleBackToEmpty = () => {
    setSelectedQuestions([]);
    setQuizState("empty");
  };

  const renderContent = () => {
    switch (quizState) {
      case "playing":
        return (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <QuizPlayer
              questions={selectedQuestions}
              onBack={handleBackToCreating}
            />
          </main>
        );
      case "creating":
        return (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <QuizCreator
              selectedQuestions={selectedQuestions}
              onRemoveAllQuestions={handleRemoveAllQuestions}
              onRemoveQuestion={handleRemoveQuestion}
              onStartQuiz={handleStartQuiz}
              onBack={handleBackToEmpty}
            />
          </main>
        );
      case "empty":
      default:
        return (
          <main className="max-w-4xl mx-auto px-4 py-16">
            <QuizIntroduction />
          </main>
        );
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
      {renderContent()}
    </div>
  );
};

export default Quiz;