export interface TopicDto {
  id: number;
  nome: string;
  dataInicio?: string;
  dataFim?: string;
  subtopicos: SubtopicDto[];
}

export interface SubtopicDto {
  id: number;
  nome: string;
  dataInicio?: string;
  dataFim?: string;
}