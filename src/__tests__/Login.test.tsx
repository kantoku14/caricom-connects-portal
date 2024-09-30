import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import userEvent from '@testing-library/user-event';

// Mock useAuth to simulate login and session management
jest.mock('../context/AuthContext');

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      user: null, // Simulate no active session initially
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('renders the login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be 8\+ characters/i)
    ).toBeInTheDocument();
  });

  it('calls login with correct credentials', async () => {
    render(<Login />);

    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
    });
  });

  it('displays a success toast on successful login', async () => {
    mockLogin.mockResolvedValue({ name: 'John Doe' });

    render(<Login />);

    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
      expect(screen.getByText(/welcome back, john doe!/i)).toBeInTheDocument();
    });
  });

  it('displays an error toast on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Login Failed'));

    render(<Login />);

    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please check your credentials/i)
      ).toBeInTheDocument();
    });
  });

  it('displays a modal if a session is already active', async () => {
    mockUseAuth.mockReturnValueOnce({
      login: mockLogin,
      user: { name: 'John Doe' }, // Simulate an active session
    });

    render(<Login />);

    await waitFor(() => {
      expect(screen.getByText(/active session detected/i)).toBeInTheDocument();
      expect(
        screen.getByText(/you are already logged in/i)
      ).toBeInTheDocument();
    });
  });
});
