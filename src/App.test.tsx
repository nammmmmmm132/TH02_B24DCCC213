import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './components/Bai1';
import App1 from './components/Bai2';
import App2 from './components/Bai3';
import HomePage from './HomePage';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
