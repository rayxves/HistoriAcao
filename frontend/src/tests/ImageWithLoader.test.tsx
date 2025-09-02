import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageWithLoader from "@/components/ImageWithLoader";

describe("ImageWithLoader", () => {
  it("mostra o loader inicialmente e depois a imagem", () => {
    render(<ImageWithLoader src="test.jpg" alt="teste" />);
    expect(screen.getByRole("img", { name: /teste/i })).toHaveClass("opacity-0");
    fireEvent.load(screen.getByRole("img", { name: /teste/i }));
    expect(screen.getByRole("img", { name: /teste/i })).toHaveClass("opacity-100");
  });
});
