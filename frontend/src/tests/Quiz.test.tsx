import "@testing-library/jest-dom";
import Quiz from "@/pages/Quiz";
import { QuestionDto } from "@/types/question";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import * as router from "react-router-dom";

jest.mock("@/components/QuizPlayer", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <p>{props.questions[0].enunciado}</p>
      <button data-testid="voltar_btn" onClick={props.onBack}></button>
    </div>
  ),
}));

jest.mock("@/components/QuizCreator", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <button onClick={props.onBack}>Voltar</button>
      <button onClick={props.onRemoveAllQuestions}>Remover Todas</button>
      <p>{props.selectedQuestions[0].olimpiada}</p>
      <button
        data-testid="remover_questao_btn"
        onClick={() => props.onRemoveQuestion(props.selectedQuestions[0].id)}
      ></button>
      <button onClick={props.onStartQuiz}>Iniciar</button>
    </div>
  ),
}));

jest.mock("@/components/QuizIntroduction", () => ({
  __esModule: true,
  default: jest.fn(() => {
    return (
      <div>
        <p>Introdução</p>
      </div>
    );
  }),
}));

jest.mock("marked", () => ({
  marked: (md: string) => `<p>${md}</p>`,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(() => [new URLSearchParams(), jest.fn()]),
}));

jest.spyOn(router, "useLocation").mockReturnValue({
  pathname: "/quiz",
  search: "",
  hash: "",
  state: null,
  key: "test",
});

describe("Quiz", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Object.getPrototypeOf(localStorage), "getItem");
    jest.spyOn(Object.getPrototypeOf(localStorage), "setItem");
  });

  it("should get savedQuestions from localstorage", async () => {
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

    localStorage.setItem("selectedQuestions", JSON.stringify(mockedQuestion));

    render(
      <router.MemoryRouter>
        <Quiz />
      </router.MemoryRouter>
    );

    expect(localStorage.getItem).toHaveBeenCalledWith("selectedQuestions");
    waitFor(() => {
      const olimpiada = screen.findByText("3onhb");
      expect(olimpiada).toBeInTheDocument();
    });
  });

  it("should back to empty state and render quiz introdution", async () => {
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

    localStorage.setItem("selectedQuestions", JSON.stringify(mockedQuestion));

    render(
      <router.MemoryRouter>
        <Quiz />
      </router.MemoryRouter>
    );

    const quizCreatorBackBtn = screen.getByText("Voltar");
    fireEvent.click(quizCreatorBackBtn);

    waitFor(() => {
      const introdutionText = screen.getByText("Introdução");
      expect(introdutionText).toBeInTheDocument();
    });
  });

  it("should change state to playing render quiz player component", async () => {
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

    localStorage.setItem("selectedQuestions", JSON.stringify(mockedQuestion));

    render(
      <router.MemoryRouter>
        <Quiz />
      </router.MemoryRouter>
    );

    const quizCreatorInitBtn = screen.getByText("Iniciar");
    fireEvent.click(quizCreatorInitBtn);

    waitFor(() => {
      const quizPlayerEnunciado = screen.getByText("empty");
      expect(quizPlayerEnunciado).toBeInTheDocument();
    });
  });

  it("should change state to playing render quiz player component", async () => {
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

    localStorage.setItem("selectedQuestions", JSON.stringify(mockedQuestion));

    render(
      <router.MemoryRouter>
        <Quiz />
      </router.MemoryRouter>
    );

    const quizCreatorInitBtn = screen.getByText("Iniciar");
    fireEvent.click(quizCreatorInitBtn);

    waitFor(() => {
      const quizPlayerBackBtn = screen.getByTestId("voltar_btn");
      expect(quizPlayerBackBtn).toBeInTheDocument();

      fireEvent.click(quizPlayerBackBtn);

      const olimpiada = screen.findByText("3onhb");
      expect(olimpiada).toBeInTheDocument();
    });
  });
});
