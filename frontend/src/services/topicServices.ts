import api from "./api";
import { TopicDto } from "@/types/topic";
import { QuestionDto } from "@/types/question";

export async function getAllTopics() {
  const response = await api.get<TopicDto[]>("/topics");
  return response.data;
}

export async function getQuestionsByTopicId(id: number) {
  const response = await api.get<QuestionDto[]>(`/topics/${id}/questions`);
  return response.data;
}

export async function getQuestionsBySubtopicId(id: number) {
  const response = await api.get<QuestionDto[]>(`/subtopics/${id}/questions`);
  return response.data;
}

export async function createTopic(data: TopicDto) {
  const response = await api.post<TopicDto>("/topics/create", data);
  return response.data;
}

export async function updateTopic(data: TopicDto) {
  const response = await api.put<TopicDto>("/topics/update", data);
  return response.data;
}

export async function deleteTopic(id: number) {
  const response = await api.delete(`/topics/delete`, {
    params: { id },
  });
  return response.data;
}
