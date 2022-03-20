import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
const Wrapper = ({ children }: {children: React.ReactNode}) => (
   <QueryClientProvider client={queryClient}>
     {children}
   </QueryClientProvider>
);

test('renders app', () => {
  render(<Wrapper><App /></Wrapper>);
  const titleElement = screen.getByText(/Stori/i);
  expect(titleElement).toBeInTheDocument();
});
