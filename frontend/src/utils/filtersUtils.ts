import { TopicDto } from "@/types/topic";

export function filterOlimpiadas(input: string): number[] {
  const allOlimpiadas = Array.from({ length: 17 }, (_, i) => i + 1);
  if (!input) return allOlimpiadas;
  return allOlimpiadas.filter((num) => num.toString().includes(input));
}

export function getSubtopics(filters: { topicName?: string }, allTopics: TopicDto[]) {
  if (!filters.topicName) return [];
  const selectedTopic = allTopics.find((t) => t.nome === filters.topicName);
  return selectedTopic ? selectedTopic.subtopicos : [];
}

export function toUTCISOString(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    const localDate = new Date(dateStr + "T00:00:00");
    return new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      )
    ).toISOString();
  } catch {
    return undefined;
  }
}

export function formatDateDisplay(
  inicialDate?: string | null,
  finishDate?: string | null
): string {
  if (!inicialDate && !finishDate) return "Período";

  const start = inicialDate
    ? new Date(inicialDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "";
  const end = finishDate
    ? new Date(finishDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "";

  return `${start} ${start && end ? "-" : ""} ${end}`.trim();
}
