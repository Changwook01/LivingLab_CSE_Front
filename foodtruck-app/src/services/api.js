import { Platform } from 'react-native';

const API_BASE_URL = 'http://174.129.50.202:8080';

export const apiService = {
  // 로그인 API
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // 오늘 매출 데이터 가져오기
  getTodaySales: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/today-sales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch today sales');
      }

      return await response.json();
    } catch (error) {
      console.error('Today sales API error:', error);
      throw error;
    }
  },
}; 