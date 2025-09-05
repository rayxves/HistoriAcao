import { useState, useEffect, useMemo } from "react";
import { QuestionApiFilters } from "@/types/question";
import { TopicDto } from "@/types/topic";
import { ChevronDown, X, Calendar, Loader2 } from "lucide-react";
import * as filterUtils from "@/utils/filtersUtils";

interface CompactQuestionFiltersProps {
  filters: QuestionApiFilters;
  onFiltersChange: (newFilters: QuestionApiFilters) => void;
  allTopics: TopicDto[];
  isDataLoaded: boolean;
  onDisabledClick: () => void;
}

const CompactQuestionFilters = ({
  filters,
  onFiltersChange,
  allTopics,
  isDataLoaded,
  onDisabledClick,
}: CompactQuestionFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [olimpiadaInput, setOlimpiadaInput] = useState("");
  const [tempDates, setTempDates] = useState({
    start: filters.inicialDate
      ? new Date(filters.inicialDate).toISOString().split("T")[0]
      : "",
    end: filters.finishDate
      ? new Date(filters.finishDate).toISOString().split("T")[0]
      : "",
  });

  const fases = [1, 2, 3, 4, 5];
  const niveis = ["Fácil", "Média", "Difícil"];
  const isLoadingTopics = !isDataLoaded && allTopics.length === 0;

  const filteredOlimpiadas = useMemo(
    () => filterUtils.filterOlimpiadas(olimpiadaInput),
    [olimpiadaInput]
  );

  const subtopics = useMemo(
    () => filterUtils.getSubtopics({ topicName: filters.topicName }, allTopics),
    [filters, allTopics]
  );

  const toUTCISOString = (dateStr: string): string | undefined => {
    return filterUtils.toUTCISOString(dateStr);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setTempDates({
      start: filters.inicialDate
        ? new Date(filters.inicialDate).toISOString().split("T")[0]
        : "",
      end: filters.finishDate
        ? new Date(filters.finishDate).toISOString().split("T")[0]
        : "",
    });
  }, [filters.inicialDate, filters.finishDate]);

  const handleFilterChange = (key: keyof QuestionApiFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };

    if (key === "topicName") {
      newFilters.subtopicName = undefined;
      newFilters.inicialDate = undefined;
      newFilters.finishDate = undefined;
    }
    onFiltersChange(newFilters);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setTempDates({ start: "", end: "" });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value != null && value !== ""
  );

  const applyDateFilters = () => {
    onFiltersChange({
      ...filters,
      inicialDate: tempDates.start ? toUTCISOString(tempDates.start) : undefined,
      finishDate: tempDates.end ? toUTCISOString(tempDates.end) : undefined,
    });
    setOpenDropdown(null);
  };

  const formatDateDisplay = () => {
    return filterUtils.formatDateDisplay(
      filters.inicialDate,
      filters.finishDate
    );
  };

  const buttonClasses =
    "flex items-center space-x-2 ring-1 ring-gray-300/[.55] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-sm w-full sm:w-auto justify-between disabled:cursor-not-allowed disabled:hover:border-gray-200";

  return (
    <div
      className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm rounded-xl"
      onClick={onDisabledClick}
    >
      <div
        className={`max-w-7xl mx-auto px-4 py-4 sm:py-6 ${
          !isDataLoaded ? "opacity-50" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative dropdown-container w-full sm:w-auto">
            <button
              onClick={() => toggleDropdown("olimpiada")}
              className={buttonClasses}
              disabled={!isDataLoaded}
            >
              <span className="text-gray-700 truncate">
                {filters.olimpiada
                  ? `${filters.olimpiada.replace("ONHB", "")}ª Olimpíada`
                  : "Olimpíada"}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {openDropdown === "olimpiada" && (
              <div className="absolute top-full mt-1 left-0 right-0 sm:left-auto sm:right-auto sm:w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Buscar olimpíada..."
                    className="w-full px-3 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    value={olimpiadaInput}
                    onChange={(e) => setOlimpiadaInput(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      handleFilterChange("olimpiada", undefined);
                      setOpenDropdown(null);
                      setOlimpiadaInput("");
                    }}
                    className={`w-full text-left px-3 py-2 mb-1 text-sm rounded-lg font-medium ${
                      !filters.olimpiada
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Todas as Olimpíadas
                  </button>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredOlimpiadas.map((number) => (
                      <button
                        key={number}
                        onClick={() => {
                          handleFilterChange("olimpiada", `${number}ONHB`);
                          setOpenDropdown(null);
                          setOlimpiadaInput("");
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium ${
                          filters.olimpiada === `${number}ONHB`
                            ? "bg-emerald-100 text-emerald-800"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {number}ª Olimpíada
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative dropdown-container w-full sm:w-auto">
            <button
              onClick={() => toggleDropdown("fase")}
              className={buttonClasses}
              disabled={!isDataLoaded}
            >
              <span className="text-gray-700">
                {filters.fase ? `${filters.fase}ª Fase` : "Fase"}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {openDropdown === "fase" && (
              <div className="absolute top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleFilterChange("fase", undefined);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Todas as Fases
                  </button>
                  {fases.map((fase) => (
                    <button
                      key={fase}
                      onClick={() => {
                        handleFilterChange("fase", fase);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      {fase}ª Fase
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative dropdown-container w-full sm:w-auto">
            <button
              onClick={() => toggleDropdown("tema")}
              className={buttonClasses}
              disabled={!isDataLoaded}
            >
              <span className="text-gray-700 max-w-36 truncate">
                {filters.topicName || "Tema"}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {openDropdown === "tema" && (
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {isLoadingTopics ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Carregando temas...</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleFilterChange("topicName", undefined);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Todos os Temas
                    </button>
                    {allTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          handleFilterChange("topicName", topic.nome);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        {topic.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {filters.topicName && subtopics.length > 0 && (
            <div className="relative dropdown-container w-full sm:w-auto">
              <button
                onClick={() => toggleDropdown("subtema")}
                className={buttonClasses}
                disabled={!isDataLoaded}
              >
                <span className="text-gray-700 max-w-36 truncate">
                  {filters.subtopicName || "Subtema"}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {openDropdown === "subtema" && (
                <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleFilterChange("subtopicName", undefined);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Todos os Subtemas
                    </button>
                    {subtopics.map((subtopic) => (
                      <button
                        key={subtopic.id}
                        onClick={() => {
                          handleFilterChange("subtopicName", subtopic.nome);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        {subtopic.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {!filters.topicName && !filters.subtopicName && (
            <div className="relative dropdown-container w-full sm:w-auto">
              <button
                onClick={() => toggleDropdown("data")}
                className={buttonClasses}
                disabled={!isDataLoaded}
              >
                <div className="flex gap-1 sm:gap-2 h-full items-center">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-end">
                    {formatDateDisplay()}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {openDropdown === "data" && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Inicial
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                        value={tempDates.start}
                        onChange={(e) =>
                          setTempDates({ ...tempDates, start: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Final
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                        value={tempDates.end}
                        onChange={(e) =>
                          setTempDates({ ...tempDates, end: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={applyDateFilters}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                        disabled={!tempDates.start && !tempDates.end}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 w-full mt-2 sm:mt-0 lg:ml-4 sm:w-auto order-last sm:order-none">
            {niveis.map((nivel) => {
              const isActive = filters.nivelDificuldade === nivel;
              let nivelClass =
                "bg-slate-50 text-gray-700 ring-1 ring-gray-300/[.50] hover:bg-gray-100";
              if (isActive) {
                if (nivel === "Fácil")
                  nivelClass = "bg-green-100 text-green-800 border-green-200";
                else if (nivel === "Média")
                  nivelClass =
                    "bg-yellow-100 text-yellow-800 border-yellow-200";
                else
                  nivelClass = "bg-red-100 text-red-800 border-red-200";
              }
              return (
                <button
                  key={nivel}
                  onClick={() =>
                    handleFilterChange(
                      "nivelDificuldade",
                      isActive ? undefined : nivel
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${nivelClass} disabled:cursor-not-allowed`}
                  disabled={!isDataLoaded}
                >
                  {nivel}
                </button>
              );
            })}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium ml-auto sm:ml-0 disabled:text-gray-400 disabled:hover:bg-transparent"
              disabled={!isDataLoaded}
            >
              <X size={14} />
              <span>Limpar</span>
            </button>
          )}
        </div>
        {(filters.inicialDate || filters.finishDate) && (
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-600" />
              <strong>Período:</strong>
              <span>
                {filters.inicialDate
                  ? new Date(filters.inicialDate).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })
                  : "N/A"}
              </span>
              <span>-</span>
              <span>
                {filters.finishDate
                  ? new Date(filters.finishDate).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactQuestionFilters;