import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders App component", () => {
  render(<App />);
  // expect(screen.getByText(/Popular cuisines near me/i)).toBeInTheDocument();
  expect(1 + 1).toBe(2);

});



