import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ZoneScreen from "./src/screens/ZoneScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import { StartScreen } from "./src/screens/StartScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import BusinessSignupScreen from "./src/screens/BusinessSignupScreen";
import MainScreen from "./src/screens/SearchTruck";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import { useAppStore } from "./src/stores/useAppStore"; 
import { AuthProvider } from "./src/context/AuthContext";
import UserMyPage from "./src/screens/UserMyPage";

export default function App() {
  const [authScreen, setAuthScreen] = useState("start");   // 로그인 전 스택
  const [selectedTab, setSelectedTab] = useState("home");

  const { user } = useAppStore();

  const handleAuthSuccess = () => {
    setAuthScreen(null); // 로그인 화면 닫기
  };
  
  const renderAuth = () => {
    switch (authScreen) {
      case "login":
        return (
          <LoginScreen
            onSuccess={() => setSelectedTab("home")}
            onBack={() => setAuthScreen("start")}
          />
        );
      case "signup":
        return (
          <SignupScreen
            onSuccess={() => setAuthScreen("login")}
            onBack={() => setAuthScreen("start")}
          />
        );
      case "bizSignup":
        return (
          <BusinessSignupScreen
            onSuccess={() => setAuthScreen("login")}
            onBack={() => setAuthScreen("start")}
          />
        );
      case "start":
      default:
        return (
          <StartScreen
            onLogin={() => setAuthScreen("login")}
            onSignup={() => setAuthScreen("signup")}
          />
        );
    }
  };
  const renderMainContent = () => {
    const role = user?.role ?? "CITIZEN";

    if (role === "CITIZEN") {
      switch (selectedTab) {
        case "home":
          return <MainScreen user={user} />;
        case "subscription":
          return <SubscriptionScreen user={user} />;
        case "mypage":
          return <UserMyPage user={user} />;
        default:
          return <MainScreen user={user} />;
      }
    } else {
      // OPERATOR
      switch (selectedTab) {
        case "home":
          return <HomeScreen user={user} />;
        case "menu":
          return <MenuScreen user={user} />;
        case "zone":
          return <ZoneScreen user={user} />;
        case "mypage":
          return <MyPageScreen user={user} />;
        default:
          return <HomeScreen user={user} />;
      }
    }
  };

  const renderTabs = () => {
    const isCitizen = user?.role === "CITIZEN";
    const tabs = isCitizen
      ? [
          { id: "home", icon: "🏠", label: "홈" },
          { id: "subscription", icon: "📥", label: "구독" }, // ✅ key 문자열 통일
          { id: "mypage", icon: "👤", label: "마이페이지" },
        ]
      : [
          { id: "home", icon: "🏠", label: "홈" },
          { id: "menu", icon: "🍔", label: "메뉴" },
          { id: "zone", icon: "📍", label: "영업지역" },
          { id: "mypage", icon: "👤", label: "마이페이지" },
        ];

    return (
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
                selectedTab === (tab.id) && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <AuthProvider>
      {!user ? (
        renderAuth() // 로그인 전
      ) : (
        // 로그인 후: 컨텐츠 + 탭바
        <View style={styles.container}>
          <View style={styles.screen}>{renderMainContent()}</View>
          {renderTabs()}
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