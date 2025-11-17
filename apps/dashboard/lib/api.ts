import { LoginUserDto, RegisterUserDto } from '@marketing-automation/dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// This will be used for public endpoints
async function publicRequest(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// This will be used for authenticated endpoints
async function privateRequest(url: string, options: RequestInit, token: string) {
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Handle token expiration, e.g., by logging out the user
    // For now, we'll just throw an error
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}


// --- Public API functions ---

export async function register(userData: RegisterUserDto) {
  return publicRequest(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
}

export async function login(credentials: LoginUserDto): Promise<{ access_token: string }> {
  return publicRequest(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}


// --- Authenticated API Client ---

export const api = (token: string) => ({
  getFlows: async () => {
    return privateRequest(`${API_BASE_URL}/flows`, { method: 'GET' }, token);
  },
  createFlow: async (flowData: { name: string; steps: object }) => {
    return privateRequest(`${API_BASE_URL}/flows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flowData),
    }, token);
  },
  getCampaigns: async () => {
    return privateRequest(`${API_BASE_URL}/campaigns`, { method: 'GET' }, token);
  },
  createCampaign: async (campaignData: { name: string; flowId: string }) => {
    return privateRequest(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    }, token);
  },
  startCampaign: async (campaignId: string) => {
    return privateRequest(`${API_BASE_URL}/campaigns/${campaignId}/start`, {
      method: 'POST',
    }, token);
  },
});
