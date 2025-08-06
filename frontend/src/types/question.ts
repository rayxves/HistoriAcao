import { AlternativeDto } from "./alternative";
import { DocumentDto } from "./document";

export interface QuestionDto {
  id: number;
  fase: number;
  olimpiada: string;
  nivelDificuldade: string;
  topico: string;
  subtopico: string;
  dataInicio?: string;
  dataFim?: string;
  enunciado: string;
  documentos?: DocumentDto[];
  alternativas?: AlternativeDto[];
}

export interface QuestionApiFilters {
  nivelDificuldade?: string;
  topicName?: string;
  subtopicName?: string;
  fase?: number;
  olimpiada?: string;
  inicialDate?: string;
  finishDate?: string;
  search?: string;
}

export type CreateQuestionDto = Omit<QuestionDto, "id">;