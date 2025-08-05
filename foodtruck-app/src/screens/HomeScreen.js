import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNewData().finally(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchNewData = async () => {
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
      {/* 상단 상태바와 헤더 */}
      {/* <StatusBarHeader /> */}

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>길맛</Text>
      </View>

      <Text style={styles.welcomeText}>
        {user?.name?.trim() || "사용자"}님, 환영합니다!
      </Text>

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
  pageHeader: {
    backgroundColor: "#FF6B35",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
  },
});

export default HomeScreen;
