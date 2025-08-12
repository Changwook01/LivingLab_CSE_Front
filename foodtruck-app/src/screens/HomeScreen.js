import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import StatusBarHeader from "../components/StatusBarHeader";
import TruckOperation from "../components/TruckOperation";
import TruckInfoScreen from "../components/TruckInfoScreen";
import SaleStatus from "../components/SaleStatus";
import { useAppStore } from "../stores/useAppStore";

const HotLocationRecommendation = ({ recommendation }) => {
  if (!recommendation) {
    return null;
  }
  const { recommended_location, reason } = recommendation;

  return (
    <View style={styles.hotLocationContainer}>
      <Text style={styles.sectionTitle}>🔥 핫한 장소 추천</Text>
      <Text style={styles.locationName}>{recommended_location.name}</Text>
      <Text>거리: {recommended_location.distance_km.toFixed(2)} km</Text>
      <Text>추천 이유: {reason}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [tab, setTab] = useState("home");
  const [refreshing, setRefreshing] = useState(false);

  // 판매현황, 사용자, 푸드트럭 상태 (기존 코드)
  const user = useAppStore((state) => state.user);
  const foodTruck = useAppStore((state) => state.foodTruck);
  const todaySales = useAppStore((state) => state.todaySales);

  // 핫한 장소 추천 상태
  const [hotRecommendation, setHotRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  const fetchRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      // 예시: 사용자 위치를 하드코딩하거나, 앱 내 위치 상태에서 받아옴
      const userLocation = {
        latitude: 37.5665, // 서울 위도 예시
        longitude: 126.9780, // 서울 경도 예시
      };

      const response = await fetch("http://174.129.50.202:8000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLocation),
      });

      if (!response.ok) {
        throw new Error("추천 장소 API 호출 실패");
      }

      const data = await response.json();
      setHotRecommendation(data);
    } catch (error) {
      console.error("추천 장소 불러오기 실패:", error);
      setHotRecommendation(null);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchNewData(), fetchRecommendation()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchNewData = async () => {
    // 기존 데이터 새로고침 시뮬레이션 (예: 상태 업데이트 등)
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

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
            {loadingRecommendation ? (
              <ActivityIndicator size="small" color="#FF6B35" />
            ) : (
              <HotLocationRecommendation recommendation={hotRecommendation} />
            )}
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
  hotLocationContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff5f0",
    borderRadius: 10,
    borderColor: "#FF6B35",
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
    color: "#FF6B35",
  },
  locationName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
});

export default HomeScreen;