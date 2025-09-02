import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizCreator from "@/components/QuizCreator";
import { MemoryRouter } from "react-router-dom";


const mockQuestion = [
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
describe("QuizCreator", () => {
  it("chama onRemoveQuestion ao clicar no botão de remover", () => {
    const onRemoveQuestion = jest.fn();
    render(
      <MemoryRouter>
        <QuizCreator
          selectedQuestions={mockQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onRemoveAllQuestions={() => {}}
          onStartQuiz={() => {}}
          onBack={() => {}}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTitle(/Remover questão/i));
    expect(onRemoveQuestion).toHaveBeenCalledWith(1);
  });

  it("desabilita iniciar quiz se não houver questões", () => {
    render(
      <MemoryRouter>
        <QuizCreator
          selectedQuestions={[]}
          onRemoveQuestion={() => {}}
          onRemoveAllQuestions={() => {}}
          onStartQuiz={() => {}}
          onBack={() => {}}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Iniciar Questionário/i)).toBeDisabled();
  });
});
