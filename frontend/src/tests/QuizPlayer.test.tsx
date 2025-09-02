import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPlayer from "@/components/QuizPlayer";

jest.mock("marked", () => ({
  parse: (md: string) => `<p>${md}</p>`,
}));

const mockQuestions = [
  {
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
  },
];
describe("QuizPlayer", () => {
  it("navega entre questões e finaliza quiz", () => {
    const onBack = jest.fn();
    render(<QuizPlayer questions={mockQuestions} onBack={onBack} />);
    fireEvent.click(screen.getByText(/Finalizar Quiz/i));
    expect(screen.getByText(/Quiz Concluído/i)).toBeInTheDocument();
  });
});
