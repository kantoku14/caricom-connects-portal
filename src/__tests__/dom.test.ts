import { screen } from '@testing-library/react';

test('renders content', () => {
  document.body.innerHTML = '<div>hello world</div>';

  const div = screen.getByText('hello world');
  expect(div).toBeInTheDocument(); // `toBeInTheDocument` is part of jest-dom
});
