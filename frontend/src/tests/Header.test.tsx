import Header from "@/components/Header";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

describe("Header", () => {
  it("should render header without analytics when user is not authenticated", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.queryByText("Ver análises")).not.toBeInTheDocument();
    expect(screen.queryByText("Explorar Questões")).toBeInTheDocument();
  });

  it("should render header analytics when user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Rayssa" },
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByText("Explorar Questões")).toBeInTheDocument();

    waitFor(() => {
      expect(screen.queryByText("Ver análises")).toBeInTheDocument();
    });
  });
});
