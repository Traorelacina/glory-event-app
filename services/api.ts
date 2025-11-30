const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || 'Une erreur est survenue',
      errors: data.errors,
    } as ApiError;
  }

  return data;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  },

  logout: async (token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};

export const adminApi = {
  getDashboard: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getRecentOrders: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/recent-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getRecentContacts: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/recent-contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};
