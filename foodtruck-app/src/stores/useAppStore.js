import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  foodTruck: null,
  menus: [],
  todaySales: null,

  setLoginData: (data) =>
    set({
      user: data.user,
      foodTruck: data.foodTruck,
      menus: data.menus,
      todaySales: data.todaySales,
    }),

  logout: () =>
    set({ user: null, foodTruck: null, menus: [], todaySales: null }),
}));
