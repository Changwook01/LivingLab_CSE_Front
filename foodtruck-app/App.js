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
import MainScreen from "./src/screens/MainScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import { useAppStore } from "./src/stores/useAppStore"; 
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("start");
  const [selectedTab, setSelectedTab] = useState("home");

  const { user } = useAppStore();

  const handleAuthSuccess = () => {
    setCurrentScreen("main");
  };
  
  const renderScreen = () => {
    switch (selectedTab) {
      case "home":
        return <HomeScreen user={user} />;
      case "menu":
        return <MenuScreen />;
      case "zone":
        return <ZoneScreen />;
      case "mypage":
        return <MyPageScreen />;
      case "SubscriptionScreen":
        return <SubscriptionScreen />;
      default:
        return <HomeScreen user={user} />;
    }
  };

  const renderTabs = () => {
    const isCitizen = user?.role === "CITIZEN";

    const tabs = isCitizen
      ? [
          { id: "home", icon: "🏠", label: "홈" },
          { id: "SubscriptionScreen", icon: "📥", label: "구독" },
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
                selectedTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMainContent = () => {
    // 사용자 역할 확인
    const isCitizen = user?.role === "CITIZEN";
    const isOperator = user?.role === "OPERATOR";

    if (isCitizen) {
      // 일반 사용자 화면
      return (
        <View style={styles.container}>
          <View style={styles.screen}>
            <MainScreen user={user} />
          </View>
          {renderTabs()}
        </View>
      );
    } else if (isOperator) {
      // 사업자 화면
      return (
        <View style={styles.container}>
          <View style={styles.screen}>{renderScreen()}</View>
          {renderTabs()}
        </View>
      );
    } else {
      // 역할이 없는 경우 시작 화면으로 리다이렉트
      setCurrentScreen("start");
      return null;
    }
  };

  return (
    <AuthProvider> 
      {currentScreen === "start" && (
        <StartScreen
          // onStart는 로그인 버튼이 아닌, 앱 시작 시 호출되는 함수이므로 수정이 필요합니다.
          // onLogin 함수를 추가하여 LoginScreen으로 이동하도록 변경합니다.
          onLogin={() => setCurrentScreen("login")} 
          onSignup={() => setCurrentScreen("signup")}
          onAuthSuccess={handleAuthSuccess}
        />
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
      {/* 🔑 LoginScreen 추가 및 onLoginSuccess 핸들러 정의 */}
      {currentScreen === "login" && (
       <LoginScreen onLoginSuccess={handleAuthSuccess} onBack={() => setCurrentScreen("start")} />
      )}
      {currentScreen === "main" && renderMainContent()}
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