const API_BASE_URL = 'http://174.129.50.202:8080';

const subscriptionService = {
  // 구독 요청
  subscribe: async (userId, foodTruckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/${foodTruckId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('구독 요청에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('구독 요청 오류:', error);
      throw error;
    }
  },

  // 구독 취소
  unsubscribe: async (userId, foodTruckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/${foodTruckId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('구독 취소에 실패했습니다.');
      }

      return true;
    } catch (error) {
      console.error('구독 취소 오류:', error);
      throw error;
    }
  },

  // 구독 여부 확인
  checkSubscription: async (userId, foodTruckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/check/${userId}/${foodTruckId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('구독 상태 확인에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('구독 상태 확인 오류:', error);
      throw error;
    }
  },

  // 사용자의 구독한 푸드트럭 목록
  getSubscribedFoodTrucks: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('구독 목록 조회에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('구독 목록 조회 오류:', error);
      throw error;
    }
  },
};

export default subscriptionService; 