import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("home");
  const [isOperating, setIsOperating] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return (
          <ScrollView style={styles.screen}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>푸드트럭 파트너</Text>
              <Text style={styles.headerSubtitle}>김창업님</Text>
            </View>

            {/* 영업 상태 박스 */}
            <View style={styles.operationStatus}>
              <View
                style={[
                  styles.statusCircle,
                  isOperating ? styles.statusOnline : styles.statusOffline,
                ]}
              >
                <Text style={styles.statusCircleText}>
                  {isOperating ? "영업 중" : "영업 종료"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => setIsOperating(!isOperating)}
              >
                <Text style={styles.btnPrimaryText}>
                  {isOperating ? "영업 종료하기" : "영업 시작하기"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.statusNotice}>
                영업 시작 시 실시간 위치가 공유됩니다
              </Text>
            </View>

            {/* 푸드트럭 정보 카드 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>내 푸드트럭 정보</Text>
                <Text style={styles.cardEdit}>수정</Text>
              </View>

              <View style={styles.truckInfoRow}>
                <View style={styles.truckImage}>
                  <Text>🚚</Text>
                </View>
                <View>
                  <Text style={styles.truckName}>맛있는 버거트럭</Text>
                  <Text style={styles.truckDetail}>차량번호: 12가 3456</Text>
                  <Text style={styles.truckDetail}>크기: 중형</Text>
                </View>
              </View>

              <View style={styles.truckTags}>
                <Text style={styles.badge}>위생 인증 완료</Text>
                <Text style={[styles.badge, styles.badgeSuccess]}>
                  영업 허가 완료
                </Text>
              </View>
            </View>

            {/* 판매 현황 카드 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>오늘의 판매 현황</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.textGray}>주문 수</Text>
                <Text style={styles.textBold}>12건</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.textGray}>판매 금액</Text>
                <Text style={styles.textBold}>256,000원</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.textGray}>인기 메뉴</Text>
                <Text style={styles.textBold}>더블 치즈버거</Text>
              </View>
            </View>
          </ScrollView>
        );

      case "menu":
        return (
          <View style={styles.screen}>
            <Text style={styles.headerTitle}>메뉴 관리 화면</Text>
          </View>
        );

      case "zone":
        return (
          <View style={styles.screen}>
            <Text style={styles.headerTitle}>영업 구역 화면</Text>
          </View>
        );

      case "register":
        return (
          <View style={styles.screen}>
            <Text style={styles.headerTitle}>푸드트럭 등록 화면</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상태바 */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>📶 📶 🔋</Text>
      </View>

      {/* 화면 */}
      {renderScreen()}

      {/* 네비게이션 바 */}
      <View style={styles.navBar}>
        {[
          { id: "home", icon: "🏠", label: "홈" },
          { id: "menu", icon: "🍽️", label: "메뉴" },
          { id: "zone", icon: "🗺️", label: "영업구역" },
          { id: "register", icon: "📝", label: "등록" },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              activeScreen === item.id && styles.navItemActive,
            ]}
            onPress={() => setActiveScreen(item.id)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navText,
                activeScreen === item.id && styles.navTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  statusBar: {
    height: 44,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  statusText: { color: "white", fontSize: 12 },
  screen: {
    flex: 1,
    paddingBottom: 56,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },

  operationStatus: {
    alignItems: "center",
    backgroundColor: "#fff9f5",
    borderRadius: 12,
    margin: 16,
    padding: 24,
  },
  statusCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statusOnline: { backgroundColor: "#00cc66" },
  statusOffline: { backgroundColor: "#ddd" },
  statusCircleText: { fontSize: 18, fontWeight: "700", color: "white" },
  statusNotice: { fontSize: 12, color: "#6b7280", marginTop: 8 },

  btnPrimary: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  btnPrimaryText: { color: "white", fontWeight: "500" },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardEdit: { fontSize: 14, color: "#3b82f6" },

  truckInfoRow: { flexDirection: "row", marginBottom: 12 },
  truckImage: {
    width: 80,
    height: 80,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  truckName: { fontWeight: "700" },
  truckDetail: { fontSize: 12, color: "#6b7280" },

  truckTags: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  badge: {
    backgroundColor: "#e6f7ff",
    color: "#0088ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  badgeSuccess: {
    backgroundColor: "#e6fff0",
    color: "#00cc66",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  textGray: { color: "#6b7280" },
  textBold: { fontWeight: "700" },

  navBar: {
    height: 56,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: { alignItems: "center" },
  navItemActive: {},
  navIcon: { fontSize: 20, marginBottom: 2 },
  navText: { fontSize: 10, color: "#888" },
  navTextActive: { color: "#FF6B35" },
});
