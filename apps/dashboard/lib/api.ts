import { LoginUserDto, RegisterUserDto } from '@marketing-automation/dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export async function register(userData: RegisterUserDto) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function login(credentials: LoginUserDto): Promise<{ access_token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}
