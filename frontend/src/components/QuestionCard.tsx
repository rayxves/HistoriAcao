import { QuestionDto } from "@/types/question";
import { DocumentDto } from "@/types/document";
import { Info } from "lucide-react";

interface Props {
  question: QuestionDto;
  userAnswerId?: number;
  isFromQuiz?: boolean;
  onAnswerSelect: (questionId: number, alternativeId: number) => void;
  onAddToQuiz?: (question: QuestionDto) => void;
  onViewDocument?: (doc: DocumentDto) => void;
}

const getAlternativeColorClass = (score: number): string => {
  if (score === 0) return "bg-red-100 border-red-300";
  if (score === 5) return "bg-green-100 border-green-300";
  return "bg-yellow-100 border-yellow-200";
};

const sortAlternatives = (alternatives: QuestionDto["alternativas"]) => {
  if (!alternatives) return [];

  const letterOrder = ["A", "B", "C", "D"];

  return [...alternatives].sort((a, b) => {
    return letterOrder.indexOf(a.letra) - letterOrder.indexOf(b.letra);
  });
};

export default function QuestionCard({
  question,
  userAnswerId,
  isFromQuiz,
  onAnswerSelect,
  onAddToQuiz,
  onViewDocument,
}: Props) {
  const hasAnswered = userAnswerId != null && userAnswerId != undefined;
  const sortedAlternatives = sortAlternatives(question.alternativas);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className=" text-xs sm:text-sm py-1 rounded-full font-medium">
              {question.olimpiada}
            </div>
            <div className="bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {question.fase}ª Fase
            </div>
            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${
                question.nivelDificuldade === "Fácil"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : question.nivelDificuldade === "Médio"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {question.nivelDificuldade}
            </div>
          </div>
          {isFromQuiz && (
            <button
              onClick={() => onAddToQuiz?.(question)}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs sm:text-sm"
            >
              Adicionar ao Quiz
            </button>
          )}
        </div>

        {/* Tópico */}
        <div>
          <h4 className="font-bold text-gray-800 text-base sm:text-lg">
            {question.topico}
          </h4>
          {question.subtopico && (
            <p className="text-xs sm:text-sm text-emerald-700 font-medium">
              {question.subtopico}
            </p>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          {question.enunciado}
        </p>

        {question.documentos?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-lg">Recursos:</h4>
            <div className="flex flex-wrap gap-3">
              {question.documentos.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onViewDocument?.(doc)}
                  className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 text-blue-800 text-sm transition-colors"
                >
                  <Info size={14} />
                  <span>{doc.titulo || doc.tipo}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Alternativas */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-lg">Alternativas:</h4>
          <div className="space-y-2">
            {sortedAlternatives.map((alt) => {
              const isSelected = userAnswerId === alt.id;

              let baseClass =
                "p-3 border rounded-lg transition-colors flex items-center justify-between";
              let colorClass = "border-gray-200 hover:bg-gray-50";

              if (hasAnswered) {
                if (isSelected) {
                  colorClass = getAlternativeColorClass(alt.pontuacao);
                } else {
                  colorClass = "bg-gray-50 border-gray-200 opacity-70";
                }
              } else {
                baseClass += " cursor-pointer";
              }

              return (
                <div
                  key={alt.id}
                  className={`${baseClass} ${colorClass} cursor-pointer`}
                  onClick={() =>
                    !hasAnswered && onAnswerSelect(question.id, alt.id)
                  }
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded border min-w-[28px] sm:min-w-[32px] text-center text-xs sm:text-sm">
                      {alt.letra}
                    </span>
                    <span className="flex-1 text-gray-800 text-sm sm:text-base">
                      {alt.texto}
                    </span>
                  </div>
                  {hasAnswered && (
                    <span className="font-bold pr-1 text-xs sm:text-sm text-gray-700">
                      {alt.pontuacao} pts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
