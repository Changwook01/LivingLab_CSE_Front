import React, { createContext, useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAppStore } from '../stores/useAppStore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  // ❗ 수정: 새로 만든 스토어 함수 가져오기
  const { setUserData, setPartnerData, logout: clearStore } = useAppStore();

  const API_BASE_URL = Platform.OS === 'ios' 
    ? 'http://localhost:8080' 
    : 'http://10.0.2.2:8080';

  // ❗ 수정된 login 함수
  const login = async (email, password) => {
    try {
      console.log('🔐 로그인 시도:', { email });
      
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || '로그인에 실패했습니다.');
      }

      const loginResponse = await response.json();
      console.log('✅ 로그인 성공:', loginResponse);

      const { user, partnerDetails } = loginResponse;

      // 1. 기본 사용자 정보는 항상 저장
      setUserData(user);
      setUserType(user.role); // 사용자 타입 설정

      // 2. 파트너 상세 정보가 있는 경우에만 추가로 저장
      if (partnerDetails) {
        setPartnerData(partnerDetails);
      }

      setIsLoggedIn(true);
      return true;

    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      Alert.alert('로그인 실패', '이메일과 비밀번호를 확인해주세요.');
      return false;
    }
  };

  const signUp = async (userData) => {
    try {
      console.log('📝 회원가입 시도:', userData);
      
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userType === 'partner' ? 'FOOD_TRUCK_OWNER' : 'CUSTOMER'
        })
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      const result = await response.text();
      console.log('✅ 회원가입 성공:', result);

      // 회원가입 후 자동 로그인
      const loginSuccess = await login(userData.email, userData.password);
      return loginSuccess;
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      Alert.alert('회원가입 실패', '다시 시도해주세요.');
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    clearStore();
  };

  const setUserTypeAndNavigate = (type) => {
    setUserType(type);
  };

  const fetchTodaySales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/today-sales`);
      
      if (response.ok) {
        const salesData = await response.json();
        console.log('💰 오늘 매출 정보:', salesData);
        setTodaySales(salesData);
      }
    } catch (error) {
      console.error('❌ 매출 정보 가져오기 오류:', error);
    }
  };

  const value = {
    isLoggedIn,
    userType,
    login,
    logout,
    signUp,
    setUserTypeAndNavigate,
    // fetchTodaySales, // 제거
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 