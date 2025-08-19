import Index from "@/pages/Index";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

test("should navigate to the question page", () => {
  render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>
  );

  const questionLink = screen.getByText("Explorar Questões", { selector: "a" });
  const questionLink2 = screen.getByText("Começar Exploração", {
    selector: "a",
  });

  fireEvent.click(questionLink);
  fireEvent.click(questionLink2);
  expect(questionLink).toHaveAttribute("href", "/questoes");
  expect(questionLink2).toHaveAttribute("href", "/questoes");
});

test("should navigate to the quiz page", () => {
  render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>
  );

  const quizLink = screen.getByText("Criar Quiz", { selector: "a" });
  fireEvent.click(quizLink);
  expect(quizLink).toHaveAttribute("href", "/quiz");
});
