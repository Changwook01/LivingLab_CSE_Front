import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Text, RefreshControl } from "react-native";
import StatusBarHeader from "../components/StatusBarHeader";
import TruckOperation from "../components/TruckOperation";
import TruckInfoScreen from "../components/TruckInfoScreen";
import SaleStatus from "../components/SaleStatus";
import { useAppStore } from "../stores/useAppStore";

const HomeScreen = () => {
  const [tab, setTab] = useState("home");
  const [refreshing, setRefreshing] = useState(false);

  const user = useAppStore((state) => state.user);
  const foodTruck = useAppStore((state) => state.foodTruck);
  const todaySales = useAppStore((state) => state.todaySales);

  // 새로고침 함수
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // 여기서 데이터 다시 불러오는 작업 수행
    // 예: API 호출해서 Zustand 상태 업데이트
    fetchNewData().finally(() => {
      setRefreshing(false);
    });
  }, []);

  // 실제 API 호출 및 Zustand 상태 업데이트 함수 (예시)
  const fetchNewData = async () => {
    // 예: apiService.getUserData() 같은 함수를 호출해서 상태 업데이트
    // await apiService.fetchUserDataAndUpdateStore();
    // 여기서는 1.5초 딜레이 후 끝내는 예시
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const renderContent = () => {
    switch (tab) {
      case "home":
        return (
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <SaleStatus todaySales={todaySales} />
            <TruckInfoScreen foodTruck={foodTruck} />
            <TruckOperation />
          </ScrollView>
        );
      case "menu":
        return (
          <View style={styles.centered}>
            <Text>메뉴 관리 화면</Text>
          </View>
        );
      case "zone":
        return (
          <View style={styles.centered}>
            <Text>영업 구역 화면</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarHeader />
      <Text style={styles.welcomeText}>{user?.name}님, 환영합니다!</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
});

export default HomeScreen;
