import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QuestionDto } from "@/types/question";
import Header from "@/components/Header";
import QuizCreator from "@/components/QuizCreator";
import QuizPlayer from "@/components/QuizPlayer";
import QuizIntroduction from "@/components/QuizIntroduction";


type QuizState = "empty" | "creating" | "playing";

const Quiz = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionDto[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("empty");
  const location = useLocation();

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
          console.error("Erro ao processar questões salvas:", error);
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
      localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  }, [selectedQuestions]);

  const handleRemoveQuestion = (questionId: number) => {
    const updatedQuestions = selectedQuestions.filter(q => q.id !== questionId);
    setSelectedQuestions(updatedQuestions);
    if (updatedQuestions.length === 0) {
      setQuizState("empty");
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.length > 0) {
      setQuizState("playing");
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


  if (quizState === "playing") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <QuizPlayer questions={selectedQuestions} onBack={handleBackToCreating}/>
        </main>
      </div>
    );
  }

  if (quizState === "creating") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <QuizCreator selectedQuestions={selectedQuestions}  onRemoveAllQuestions={handleRemoveAllQuestions} onRemoveQuestion={handleRemoveQuestion} onStartQuiz={handleStartQuiz} onBack={handleBackToEmpty}/>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <QuizIntroduction />
      </main>
    </div>
  );
};

export default Quiz;