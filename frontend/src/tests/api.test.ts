import * as topicServices from "@/services/topicServices";
import * as questionServices from "@/services/questionServices";
import { QuestionDto } from "@/types/question";
import { TopicDto } from "@/types/topic";

jest.mock("axios");

jest.mock("@/services/questionServices", () => ({
  getAllQuestions: jest.fn(),
  getQuestionById: jest.fn(),
  getQuestionsByFilters: jest.fn(),
}));

describe("should call api and get questions", () => {
  it("should get all questions from api", async () => {
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

    (questionServices.getAllQuestions as jest.Mock).mockResolvedValue(
      mockedQuestion
    );

    const question = await questionServices.getAllQuestions();
    expect(question).toEqual(mockedQuestion);
  });

  it("should get question by id", async () => {
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

    (questionServices.getQuestionById as jest.Mock).mockResolvedValue(
      mockedQuestion
    );

    const question = await questionServices.getQuestionById(1);
    expect(question).toEqual(mockedQuestion);
  });

  it("should get question by filters", async () => {
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
      {
        id: 1,
        fase: 1,
        olimpiada: "4onhb",
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

    const filters = {
      topicName: "brasil",
      subtopicName: "colonia",
      fase: 1,
      olimpiada: "4onhb",
      inicialDate: "20/07/1500",
      finishDate: "20/07/1800",
      search: "brasil",
      nivelDificuldade: "facil",
    };

    const questions = await questionServices.getQuestionsByFilters(filters);
    expect(questions).toEqual(mockedQuestion);
  });
});

jest.mock("@/services/topicServices", () => ({
  getAllTopics: jest.fn(),
  getQuestionsByTopicId: jest.fn(),
  getQuestionsBySubtopicId: jest.fn(),
}));

describe("should call topics functions from api", () => {
  it("should get all topics from api", async () => {
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
    const topics = await topicServices.getAllTopics();
    expect(topics).toEqual(mockTopics);
  });

  it("should get questions by topicId", async () => {
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

    (topicServices.getQuestionsByTopicId as jest.Mock).mockResolvedValue(mockedQuestion)
  })
});
