import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, vi } from 'vitest';
import App from './App';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function LoginHarness() {
  const { login } = useAuth();
  return <Login onLoginSuccess={login} />;
}

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('submits valid credentials and calls login callback', async () => {
  const user = userEvent.setup();
  const onLoginSuccess = vi.fn();

  render(
    <MemoryRouter>
      <Login onLoginSuccess={onLoginSuccess} />
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText(/email/i), 'test@pawborrow.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /^LOGIN$/i }));

  expect(onLoginSuccess).toHaveBeenCalledTimes(1);
});

test('stores the shared account profile after a successful login', async () => {
  const user = userEvent.setup();
  localStorage.clear();

  render(
    <AuthProvider>
      <MemoryRouter>
        <LoginHarness />
      </MemoryRouter>
    </AuthProvider>
  );

  await user.type(screen.getByLabelText(/email/i), 'test@pawborrow.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /^LOGIN$/i }));

  const savedUser = JSON.parse(localStorage.getItem('pawborrow-user') ?? '{}');

  expect(savedUser).toMatchObject({
    email: 'test@pawborrow.com',
    displayName: 'Sarah',
    fullName: 'Sarah',
    phoneNumber: '+62 812 3456 7890',
    accountCreated: 'August 2024'
  });
});
