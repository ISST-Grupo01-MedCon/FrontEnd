import { render, screen } from '@testing-library/react';
import {HomePreLogin} from "./components/HomePreLogin";

test('renders learn react link', () => {
  render(<HomePreLogin />);
  const linkElement = screen.getByText(/Inicie sesión para acceder a las funcionalidades/i);
  expect(linkElement).toBeInTheDocument();
});
