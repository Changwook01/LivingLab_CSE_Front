import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { apiService } from '../services/api';
import { useAppStore } from "../stores/useAppStore";

export default function SaleStatus({ isOpen }) {
  const [isOperating, setIsOperating] = useState(isOpen ?? false);
  const [todaySales, setTodaySales] = useState({
    orderCount: 0,
    totalRevenue: 0,
    topMenu: '없음'
  });

  // ✅ zustand store에서 로그인한 사용자 정보 가져오기
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    // ✅ userData → user로 수정
    if (user && user.role === 'PARTNER') {
      fetchTodaySales();
    }
  }, [user]);

  const fetchTodaySales = async () => {
    try {
      const salesData = await apiService.getTodaySales();
      setTodaySales(salesData);
    } catch (error) {
      console.error('Failed to fetch today sales:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>푸드트럭 파트너</Text>
        {/* ✅ user.name 출력 */}
        <Text style={styles.headerSubtitle}>
          {user ? user.name : '사용자'}님
        </Text>
      </View>

      {/* 영업 상태 표시 */}
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

        {/* ✅ userData → user로 수정 */}
        {user && user.role === 'PARTNER' && (
          <View style={styles.salesInfo}>
            <Text style={styles.salesTitle}>오늘 매출</Text>
            <View style={styles.salesRow}>
              <Text style={styles.salesLabel}>주문 수:</Text>
              <Text style={styles.salesValue}>{todaySales.orderCount}건</Text>
            </View>
            <View style={styles.salesRow}>
              <Text style={styles.salesLabel}>총 매출:</Text>
              <Text style={styles.salesValue}>{todaySales.totalRevenue.toLocaleString()}원</Text>
            </View>
            <View style={styles.salesRow}>
              <Text style={styles.salesLabel}>인기 메뉴:</Text>
              <Text style={styles.salesValue}>{todaySales.topMenu}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
  
  salesInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  salesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  salesLabel: {
    fontSize: 14,
    color: '#666',
  },
  salesValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
