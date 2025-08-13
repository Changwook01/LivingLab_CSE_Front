import { Platform } from 'react-native';
import axios from 'axios';

// src/services/menuService.js
const API_BASE_URL = 'http://174.129.50.202:8080';

async function handleJson(res, fallbackMsg) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || fallbackMsg);
  }
  // 204 같은 경우 대비
  try { return await res.json(); } catch { return null; }
}

export const menuService = {
  // 메뉴 목록 (백엔드가 ?foodTruckId= 로 받는다고 가정)
  getMenusByFoodTruckId: async (foodTruckId) => {
    const res = await fetch(`${API_BASE_URL}/api/menus?foodTruckId=${foodTruckId}`);
    return handleJson(res, '메뉴 불러오기 실패');
  },

  // 전체 메뉴
  getAllMenus: async () => {
    const res = await fetch(`${API_BASE_URL}/api/menus`);
    return handleJson(res, '전체 메뉴 불러오기 실패');
  },

  // 메뉴 추가
  // menuData 예: { foodTruckId, name, price, description, available: true }
  addMenu: async (menuData) => {
    const res = await fetch(`${API_BASE_URL}/api/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuData),
    });
    return handleJson(res, '메뉴 추가 실패');
  },

  // 메뉴 수정
  updateMenu: async (menuId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/menus/${menuId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleJson(res, '메뉴 수정 실패');
  },

  // 메뉴 삭제
  deleteMenu: async (menuId) => {
    const res = await fetch(`${API_BASE_URL}/api/menus/${menuId}`, { method: 'DELETE' });
    return handleJson(res, '메뉴 삭제 실패');
  },

  // 판매 가능 토글 (백엔드가 /toggle 받는다고 가정)
  toggleAvailability: async (menuId) => {
    const res = await fetch(`${API_BASE_URL}/api/menus/${menuId}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleJson(res, '판매 상태 변경 실패');
  },
};
