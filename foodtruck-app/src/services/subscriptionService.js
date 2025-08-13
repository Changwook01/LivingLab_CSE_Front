const API_BASE_URL = 'http://174.129.50.202:8080';

const subscriptionService = {
  subscribe: async (userId, foodTruckId) => {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/${foodTruckId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('구독 요청 실패');
    return await res.json();
  },

  unsubscribe: async (userId, foodTruckId) => {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/${foodTruckId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('구독 취소 실패');
    return true;
  },

  checkSubscription: async (userId, foodTruckId) => {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/check/${userId}/${foodTruckId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('구독 여부 확인 실패');
    return await res.json();
  },

  getSubscribedFoodTrucks: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('구독 목록 불러오기 실패');
    return await res.json();
  },
};

export default subscriptionService;