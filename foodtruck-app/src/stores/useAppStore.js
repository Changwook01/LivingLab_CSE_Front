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

    setTodaySales: (salesData) => set({ todaySales: salesData }),
    
  logout: () =>
    set({ user: null, foodTruck: null, menus: [], todaySales: null }),
}));
