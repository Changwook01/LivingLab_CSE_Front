import { Platform } from 'react-native';
import axios from 'axios';

const API_BASE_URL = Platform.OS === 'ios'
  ? 'http://localhost:8080/api'
  : 'http://10.0.2.2:8080/api';

export const menuService = {
  getMenusByFoodTruckId: async (foodTruckId) => {
    const response = await fetch(`${API_BASE_URL}/menus/${foodTruckId}`);
    if (!response.ok) throw new Error('메뉴 불러오기 실패');
    return await response.json();
  },

  getAllMenus: async () => {
    const response = await axios.get(`${API_BASE_URL}/menus`);
    return response.data;
  },

  addMenu: async (menuData) => {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuData),
    });
    if (!response.ok) throw new Error('메뉴 추가 실패');
    return await response.json();
  },

  updateMenu: async (menuId, data) => {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('메뉴 수정 실패');
    return await response.json();
  },

  deleteMenu: async (menuId) => {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('메뉴 삭제 실패');
  },

  toggleAvailability: async (menuId) => {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to toggle availability');
    }
    
    if (foodTruckId !== undefined && foodTruckId !== null) {
      axios.get(`/api/menus?foodTruckId=${foodTruckId}`);
    }

    axios.post("/api/login", credentials)
  .then(res => {
    const { user, foodTruck, menus, todaySales } = res.data;

    console.log("✅ 로그인 성공 - user:", user);

    // 여기서 user만 넘겨도 되고, 필요한 거 더 넘길 수도 있음
    handleLoginSuccess(user, "customer");
  })
  .catch(err => {
    console.error("Login error:", err);
  });
    
    return await response.json();
  },
};
