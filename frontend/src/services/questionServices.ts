import api from "./api";
import { QuestionDto } from "@/types/question";
import { CreateQuestionDto } from "@/types/question";

export async function getAllQuestions() {
  const response = await api.get<QuestionDto[]>("/question");
  return response.data;
}

export async function getQuestionById(id: number) {
  const response = await api.get<QuestionDto>(`/question/by-id/${id}`);
  return response.data;
}

export async function getQuestionsByFilters(filters: {
  topicName?: string;
  subtopicName?: string;
  fase?: number;
  olimpiada?: string;
  inicialDate?: string;
  finishDate?: string;
  search?: string
  nivelDificuldade?: string;
}) {
  const response = await api.get<QuestionDto[]>("/question/by-filters", {
    params: filters,
  });
  return response.data;
}

export async function createQuestion(data: CreateQuestionDto) {
  const response = await api.post<QuestionDto>("/question/create", data);
  return response.data;
}

export async function updateQuestion(data: QuestionDto) {
  const response = await api.put<QuestionDto>("/question/update", data);
  return response.data;
}

export async function deleteQuestion(id: number) {
  const response = await api.delete(`/question/delete/${id}`);
  return response.data;
}
