import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppStore } from "../stores/useAppStore";

export default function TruckOperation() {
  const todaySales = useAppStore((state) => state.todaySales);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>오늘의 판매 현황</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.textGray}>주문 수</Text>
        <Text style={styles.textBold}>{todaySales?.orderCount ?? 0}건</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.textGray}>판매 금액</Text>
        <Text style={styles.textBold}>
          {todaySales?.totalRevenue != null
            ? todaySales.totalRevenue.toLocaleString() + "원"
            : "0원"}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.textGray}>인기 메뉴</Text>
        <Text style={styles.textBold}>{todaySales?.topMenu ?? "없음"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  cardTitle: { fontSize: 18, fontWeight: "700" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  textGray: { color: "#6b7280" },
  textBold: { fontWeight: "700" },
});
