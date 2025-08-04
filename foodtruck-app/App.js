import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ZoneScreen from "./src/screens/ZoneScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import { StartScreen } from "./src/screens/StartScreen";

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");

  const renderScreen = () => {
    switch (selectedTab) {
      case "home":
        return <HomeScreen />;
      case "menu":
        return <MenuScreen />;
      case "zone":
        return <ZoneScreen />;
      case "mypage":
        return <MyPageScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const tabs = [
    { id: "home", icon: "🏠", label: "홈" },
    { id: "menu", icon: "🍔", label: "메뉴" },
    { id: "zone", icon: "📍", label: "영업지역" },
    { id: "mypage", icon: "👤", label: "마이페이지" },
  ];

  if (!isStarted) {
    return <StartScreen onStart={() => setIsStarted(true)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={{ fontSize: 24 }}>
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  tabItem: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#FF6B35",
    fontWeight: "bold",
  },
});
