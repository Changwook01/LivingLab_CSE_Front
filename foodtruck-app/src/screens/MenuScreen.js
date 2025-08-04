import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import StatusBarHeader from "../components/StatusBarHeader";
import { useAppStore } from "../stores/useAppStore";

const MenuScreen = () => {
  const menus = useAppStore((state) => state.menus);

  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <FlatList
        contentContainerStyle={styles.content}
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price}원</Text>
          </View>
        )}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuPrice: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
});
