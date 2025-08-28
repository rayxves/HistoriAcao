import Questoes from "@/pages/Questoes";
import {

  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import { TopicDto } from "@/types/topic";
import CompactQuestionFilters from "@/components/CompactQuestionFilters";
import QuestionCard from "@/components/QuestionCard";
import * as topicServices from "@/services/topicServices";
import * as questionServices from "@/services/questionServices";
import { QuestionDto } from "@/types/question";
import { DocumentDto } from "@/types/document";

jest.mock("marked", () => ({
  marked: (md: string) => `<p>${md}</p>`,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(() => [new URLSearchParams(), jest.fn()]),
}));

jest.mock("axios");
const mockedUseLocation = useLocation as jest.Mock;
const mockedUseNavigate = useNavigate as jest.Mock;

test("should show back to quiz button when location.state.fromQuiz its true", () => {
  const navigate = jest.fn();
  mockedUseNavigate.mockReturnValue(navigate);
  mockedUseLocation.mockReturnValue({
    state: { fromQuiz: true },
    pathname: "/questoes",
  });

  render(
    <MemoryRouter>
      <Questoes />
    </MemoryRouter>
  );
  const backToQuizButton = screen.getByRole("button", {
    name: /Voltar .* Quiz/i,
  });

  expect(backToQuizButton).toBeInTheDocument();

  fireEvent.click(backToQuizButton);
  expect(navigate).toHaveBeenCalledWith("/quiz");
});

jest.mock("@/components/CompactQuestionFilters", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Filters</div>),
}));

jest.mock("@/services/topicServices", () => ({
  getAllTopics: jest.fn(),
}));

it("should get topics from api and pass to CompactQuestionFilters", async () => {
  const mockTopics: TopicDto[] = [
    {
      id: 1,
      nome: "tal topico",
      dataInicio: null,
      dataFim: null,
      subtopicos: [],
    },
  ];
  (topicServices.getAllTopics as jest.Mock).mockResolvedValue(mockTopics);
  (questionServices.getQuestionsByFilters as jest.Mock).mockResolvedValue([]);

  render(
    <MemoryRouter>
      <Questoes />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(topicServices.getAllTopics).toHaveBeenCalled();

    expect(CompactQuestionFilters).toHaveBeenCalledWith(
      expect.objectContaining({ allTopics: mockTopics }),
      expect.anything()
    );
  });
});

jest.mock("@/components/QuestionCard", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Questions</div>),
}));

jest.mock("@/services/questionServices", () => ({
  getQuestionsByFilters: jest.fn(),
}));

it("should get questions from api and pass to QuestionCard", async () => {
  const mockedQuestion: QuestionDto[] = [
    {
      id: 1,
      fase: 1,
      olimpiada: "3onhb",
      nivelDificuldade: "facil",
      topico: "brasil",
      subtopico: "colonia",
      dataInicio: "20/07/1500",
      dataFim: "20/07/1800",
      enunciado: "empty",
      documentos: [],
      alternativas: [],
    },
  ];

  (questionServices.getQuestionsByFilters as jest.Mock).mockResolvedValue(
    mockedQuestion
  );

  render(
    <MemoryRouter>
      <Questoes />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(questionServices.getQuestionsByFilters).toHaveBeenCalled();
    expect(QuestionCard).toHaveBeenCalledWith(
      expect.objectContaining({ question: mockedQuestion[0] }),
      {}
    );
  });
});

jest.mock("@/components/QuestionCard");

it("should show notification when handleAddToQuiz is called", async () => {
  const navigate = jest.fn();
  mockedUseNavigate.mockReturnValue(navigate);
  mockedUseLocation.mockReturnValue({
    state: { fromQuiz: true },
    pathname: "/questoes",
  });

  const mockedQuestion: QuestionDto[] = [
    {
      id: 1,
      fase: 1,
      olimpiada: "3onhb",
      nivelDificuldade: "facil",
      topico: "brasil",
      subtopico: "colonia",
      dataInicio: "20/07/1500",
      dataFim: "20/07/1800",
      enunciado: "empty",
      documentos: [],
      alternativas: [],
    },
  ];
  (questionServices.getQuestionsByFilters as jest.Mock).mockResolvedValue(
    mockedQuestion
  );
  (topicServices.getAllTopics as jest.Mock).mockResolvedValue([]);

  (QuestionCard as jest.Mock).mockImplementation(
    ({ isFromQuiz, onAddToQuiz, question }) => {
      return (
        <div>
          {isFromQuiz && (
            <button onClick={() => onAddToQuiz(question)}>
              Adicionar ao Quiz
            </button>
          )}
        </div>
      );
    }
  );

  render(
    <MemoryRouter>
      <Questoes />
    </MemoryRouter>
  );

  expect(screen.queryByTestId("notification")).not.toBeInTheDocument();

  const addToQuizButton = await screen.findByRole("button", {
    name: /Adicionar .* Quiz/i,
  });

  fireEvent.click(addToQuizButton);

  const finalNotification = await screen.findByTestId("notification");
  expect(finalNotification).toHaveTextContent("Questão adicionada ao quiz!");
});

it("should show document when view document state change", async () => {
  const mockedDocument: DocumentDto[] = [
    {
      id: 1,
      titulo: "exemplo",
      tipo: "texto",
      descricao: "documento de exemplo",
      origem: "nenhuma",
      url: null,
      texto: "este é um documento de exemplo",
    },
  ];
  const mockedQuestion: QuestionDto[] = [
    {
      id: 1,
      fase: 1,
      olimpiada: "3onhb",
      nivelDificuldade: "facil",
      topico: "brasil",
      subtopico: "colonia",
      dataInicio: "20/07/1500",
      dataFim: "20/07/1800",
      enunciado: "empty",
      documentos: mockedDocument,
      alternativas: [],
    },
  ];

  (questionServices.getQuestionsByFilters as jest.Mock).mockResolvedValue(
    mockedQuestion
  );
  (topicServices.getAllTopics as jest.Mock).mockResolvedValue([]);

  (QuestionCard as jest.Mock).mockImplementation(
    ({ question, onViewDocument }) => {
      return (
        <>
          {question.documentos?.length > 0 && (
            <div>
              <h4>Recursos:</h4>
              <div>
                {question.documentos.map((doc) => (
                  <button key={doc.id} onClick={() => onViewDocument?.(doc)}>
                    <span>{doc.titulo || doc.tipo}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }
  );

  render(
    <MemoryRouter>
      <Questoes />
    </MemoryRouter>
  );

  const documentBtn = await screen.findByRole("button", { name: "exemplo" });

  fireEvent.click(documentBtn);

  await waitFor(async () => {
    const documentOpen = await screen.findByText(
      `${mockedDocument[0].tipo} - Origem: ${mockedDocument[0].origem}`
    );
    expect(documentOpen).toBeInTheDocument();
  });
});
