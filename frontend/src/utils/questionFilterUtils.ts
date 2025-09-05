import { QuestionDto, QuestionApiFilters } from "@/types/question";

interface ApplyFiltersParams {
  allQuestions: QuestionDto[];
  filters: QuestionApiFilters;
  searchTerm: string;
}
export const applyFrontendFilters = ({
  allQuestions,
  filters,
  searchTerm,
}: ApplyFiltersParams): QuestionDto[] => {
  const filtered = allQuestions.filter((question) => {
    const olimpiadaMatch = filters.olimpiada
      ? question.olimpiada === filters.olimpiada
      : true;
    const faseMatch = filters.fase ? question.fase === filters.fase : true;
    const dificuldadeMatch = filters.nivelDificuldade
      ? question.nivelDificuldade === filters.nivelDificuldade
      : true;
    const topicMatch = filters.topicName
      ? question.topico === filters.topicName
      : true;
    const subtopicMatch = filters.subtopicName
      ? question.subtopico === filters.subtopicName
      : true;

    let dateMatch = true;
    const { inicialDate, finishDate } = filters;

    if (inicialDate || finishDate) {
      const userStartDate = inicialDate ? new Date(inicialDate) : null;
      const userFinishDate = finishDate ? new Date(finishDate) : null;

      const itemStartDate = question.dataInicio
        ? new Date(question.dataInicio)
        : null;

      const itemEndDate = question.dataFim ? new Date(question.dataFim) : null;

      const startsBeforeEnd = userStartDate
        ? !itemEndDate || userStartDate <= itemEndDate
        : true;
      const endsAfterStart = userFinishDate
        ? !itemStartDate || userFinishDate >= itemStartDate
        : true;

      dateMatch = startsBeforeEnd && endsAfterStart;
    }

    return (
      olimpiadaMatch &&
      faseMatch &&
      dificuldadeMatch &&
      topicMatch &&
      subtopicMatch &&
      dateMatch
    );
  });

  if (!searchTerm) {
    return filtered;
  }

  return filtered.filter((question) =>
    question.enunciado.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
