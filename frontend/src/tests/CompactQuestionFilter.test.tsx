import "@testing-library/jest-dom";
import CompactQuestionFilters from "@/components/CompactQuestionFilters";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockedUseNavigate = useNavigate as jest.Mock;

describe("CompactQuestionFilter", () => {
  it("should change filter dropdown by button click", async () => {
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);
    const filters = {};
    const onFiltersChange = jest.fn();
    const allTopics = [
      { id: 1, nome: "brasil", subtopicos: [{ id: 11, nome: "colonia" }] },
    ];

    render(
      <CompactQuestionFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        allTopics={allTopics}
      />
    );

    fireEvent.click(screen.getByText("Olimpíada"));
    fireEvent.click(await screen.findByText("3ª Olimpíada"));
    expect(onFiltersChange).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Fase"));
    fireEvent.click(await screen.findByText("1ª Fase"));
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it("should show subtema filter when filters.topicName has been set", () => {
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);
    const filters = { topicName: "brasil" };
    const onFiltersChange = jest.fn();
    const allTopics = [
      { id: 1, nome: "brasil", subtopicos: [{ id: 11, nome: "colonia" }] },
      { id: 2, nome: "sla", subtopicos: [] },
    ];

    render(
      <CompactQuestionFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        allTopics={allTopics}
      />
    );

    expect(screen.getByText("Subtema")).toBeInTheDocument();
  });

  it("should not show subtema filter when no topicName is set", () => {
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);
    const filters = {};
    const onFiltersChange = jest.fn();
    const allTopics = [
      { id: 1, nome: "brasil", subtopicos: [{ id: 11, nome: "colonia" }] },
    ];

    render(
      <CompactQuestionFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        allTopics={allTopics}
      />
    );

    expect(screen.queryByText("Subtema")).not.toBeInTheDocument();
  });

  it("should call onFiltersChange when topic is selected", async () => {
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);
    const filters = {};
    const onFiltersChange = jest.fn();
    const allTopics = [
      { id: 1, nome: "brasil", subtopicos: [] },
      { id: 2, nome: "argentina", subtopicos: [] },
    ];

    render(
      <CompactQuestionFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        allTopics={allTopics}
      />
    );

    fireEvent.click(screen.getByText("Tema"));
    fireEvent.click(await screen.findByText("brasil"));

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ topicName: "brasil" })
    );
  });
  it("should clear filters when clean button is clicked", () => {
    const onFiltersChange = jest.fn();

    render(
      <CompactQuestionFilters
        filters={{ topicName: "brasil" }}
        onFiltersChange={onFiltersChange}
        allTopics={[
          { id: 1, nome: "brasil", subtopicos: [{ id: 11, nome: "colonia" }] },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Limpar"));

    expect(onFiltersChange).toHaveBeenCalledWith({});
  });
});
