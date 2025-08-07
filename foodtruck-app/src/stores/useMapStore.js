import { create } from 'zustand';

const useMapStore = create((set, get) => ({
  // 지도 이동할 위치 정보
  targetLocation: null,
  
  // 지도 이동 함수
  moveToLocation: (latitude, longitude, latitudeDelta = 0.02, longitudeDelta = 0.01) => {
    console.log('🗺️ 지도 이동 요청:', { latitude, longitude, latitudeDelta, longitudeDelta });
    set({
      targetLocation: {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      }
    });
  },
  
  // 지도 이동 완료 후 초기화
  clearTargetLocation: () => {
    console.log('🗺️ 지도 이동 완료 - 타겟 위치 초기화');
    set({ targetLocation: null });
  },
}));

export default useMapStore; 