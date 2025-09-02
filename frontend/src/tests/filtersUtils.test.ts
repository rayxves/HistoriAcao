import {
  filterOlimpiadas,
  getSubtopics,
  toUTCISOString,
  formatDateDisplay,
} from "@/utils/filtersUtils";

describe("filtersUtils", () => {
  test("should filter olimpiadas", () => {
    expect(filterOlimpiadas("")).toHaveLength(17);
    expect(filterOlimpiadas("3")).toEqual([3, 13]);
    expect(filterOlimpiadas("18")).toEqual([]);
  });

  test("should get topics by topic name", () => {
    const filter = {
      topicName: "brasil",
    };

    const allTopics = [
      {
        id: 1,
        nome: "brasil",
        dataInicio: null,
        dataFim: null,
        subtopicos: [
          {
            id: 1,
            nome: "brasil",
            dataInicio: null,
            dataFim: null,
          },
        ],
      },
      {
        id: 1,
        nome: "colonia",
        dataInicio: null,
        dataFim: null,
        subtopicos: [],
      },
    ];

    expect(getSubtopics({ topicName: filter.topicName }, allTopics)).toEqual(
      allTopics[0].subtopicos
    );
    expect(getSubtopics({ topicName: "colonia" }, allTopics)).toEqual(
      allTopics[1].subtopicos
    );
    expect(getSubtopics({ topicName: "brasil colonial" }, allTopics)).toEqual(
      []
    );
  });

  test("should return utc iso string data", () => {
    expect(toUTCISOString("2025-08-29")).toMatch(/^2025-08-29T00:00:00\.000Z$/);
    expect(toUTCISOString("")).toBeUndefined();
    expect(toUTCISOString("data inválida")).toBeUndefined();
  });

  test("should format data display", () => {
    expect(formatDateDisplay()).toBe("Período");
    expect(formatDateDisplay("2025-08-01T00:00:00Z")).toContain("01/08/2025");
    expect(
      formatDateDisplay("2025-08-01T00:00:00Z", "2025-08-29T00:00:00Z")
    ).toBe("01/08/2025 - 29/08/2025");
  });
});
