import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "@/components/QuestionCard";

const mockQuestion = {
  id: 1,
  olimpiada: "3ONHB",
  fase: 1,
  nivelDificuldade: "Fácil",
  topico: "brasil",
  subtopico: "colonia",
  enunciado: "Qual a correta?",
  alternativas: [
    { id: 1, letra: "A", texto: "b", pontuacao: 0 },
    { id: 2, letra: "B", texto: "a", pontuacao: 5 },
  ],
  documentos: [],
};

describe("QuestionCard", () => {
  it("chama onAnswerSelect ao clicar na alternativa", () => {
    const onAnswerSelect = jest.fn();
    render(<QuestionCard question={mockQuestion} onAnswerSelect={onAnswerSelect} />);
    fireEvent.click(screen.getByText("b"));
    expect(onAnswerSelect).toHaveBeenCalledWith(1, 1);
  });

  it("mostra botao adicionar ao quiz se isFromQuiz", () => {
    const onAddToQuiz = jest.fn();
    render(<QuestionCard question={mockQuestion} isFromQuiz onAnswerSelect={() => {}} onAddToQuiz={onAddToQuiz} />);
    fireEvent.click(screen.getByText(/Adicionar ao Quiz/i));
    expect(onAddToQuiz).toHaveBeenCalledWith(mockQuestion);
  });
});
