import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dlt.aurigraph.io/api/v12';

export interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  gasUsed: number;
}

interface QueryParams {
  sender?: string;
  receiver?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  offset?: number;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const transactionApi = {
  // Get transactions with filters
  async getTransactions(params?: QueryParams): Promise<Transaction[]> {
    try {
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch transactions'
      );
    }
  },

  // Get single transaction
  async getTransaction(txId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get(`/transactions/${txId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch transaction'
      );
    }
  },

  // Submit transaction
  async submitTransaction(txData: any): Promise<Transaction> {
    try {
      const response = await apiClient.post('/transactions/submit', txData);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to submit transaction'
      );
    }
  },

  // Get transaction history for user
  async getUserTransactions(userId: string, params?: QueryParams): Promise<Transaction[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/transactions`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch user transactions'
      );
    }
  },

  // Search transactions
  async searchTransactions(query: string, params?: any): Promise<Transaction[]> {
    try {
      const response = await apiClient.get('/transactions/search', {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Search failed'
      );
    }
  },

  // Get transaction details including logs
  async getTransactionDetails(txId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/transactions/${txId}/details`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch transaction details'
      );
    }
  },

  // Get transaction receipt
  async getTransactionReceipt(txId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/transactions/${txId}/receipt`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch transaction receipt'
      );
    }
  },

  // Export transactions
  async exportTransactions(format: 'csv' | 'json' = 'csv', params?: QueryParams): Promise<Blob> {
    try {
      const response = await apiClient.get('/transactions/export', {
        params: { format, ...params },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to export transactions'
      );
    }
  },
};

export default transactionApi;
