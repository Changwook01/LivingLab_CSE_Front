import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; // TouchableOpacity도 import 필요

export default function SaleStatus({ isOpen }) {
  const [isOperating, setIsOperating] = useState(isOpen ?? false); // isOpen이 undefined일 경우 false

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>푸드트럭 파트너</Text>
        <Text style={styles.headerSubtitle}>김창업님</Text>
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
  })