import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  foodTruck: null,
  menus: [],
  todaySales: null,

  // ❗ 수정: 기본 사용자 정보만 설정하는 함수
  setUserData: (user) => set({ user }),

  // ❗ 수정: 파트너 관련 데이터만 설정하는 함수
  setPartnerData: (partnerDetails) =>
    set({
      foodTruck: partnerDetails.foodTruck,
      menus: partnerDetails.menus,
      todaySales: partnerDetails.todaySales,
    }),

  // 로그아웃 시 모든 상태 초기화
  logout: () =>
    set({ user: null, foodTruck: null, menus: [], todaySales: null }),
}));