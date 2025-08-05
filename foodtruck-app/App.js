import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ZoneScreen from "./src/screens/ZoneScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import { StartScreen, CustomerAppNavigator } from "./src/screens/StartScreen";
import { AuthProvider } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import BusinessSignupScreen from "./src/screens/BusinessSignupScreen";

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("start");
  
  const handleStart = (loginData, type) => {
    setUserData(loginData);
    setUserType(type);
    setIsStarted(true);
  };

  const renderScreen = () => {
    switch (selectedTab) {
      case "home":
        return <HomeScreen userData={userData} />;
      case "menu":
        return <MenuScreen />;
      case "zone":
        return <ZoneScreen />;
      case "mypage":
        return <MyPageScreen />;
      default:
        return <HomeScreen userData={userData} />;
    }
  };

  const tabs = [
    { id: "home", icon: "🏠", label: "홈" },
    { id: "menu", icon: "🍔", label: "메뉴" },
    { id: "zone", icon: "📍", label: "영업지역" },
    { id: "mypage", icon: "👤", label: "마이페이지" },
  ];

  return (
    <AuthProvider>
    {currentScreen === "start" && (
      <StartScreen onStart={handleStart} onSignup={() => setCurrentScreen("signup")} />
    )}
    {currentScreen === "signup" && (
      <SignupScreen
        onBusinessSignup={() => setCurrentScreen("businessSignup")}
        onBack={() => setCurrentScreen("start")}
      />
    )}
    {currentScreen === "businessSignup" && (
      <BusinessSignupScreen onBack={() => setCurrentScreen("signup")} />
    )}
    {isStarted && userType === "customer" && (
      <CustomerAppNavigator userData={userData} />
    )}
    {isStarted && userType !== "customer" && (
      <View style={styles.container}>
        <View style={styles.screen}>{renderScreen()}</View>
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text style={{ fontSize: 24 }}>{tab.icon}</Text>
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
    )}
  </AuthProvider>
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
