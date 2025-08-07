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
  const { setLoginData, logout: clearStore } = useAppStore();

  const API_BASE_URL = Platform.OS === 'ios' 
    ? 'http://localhost:8080' 
    : 'http://10.0.2.2:8080';

  const login = async (email, password, expectedRole) => {
    try {
      console.log('🔐 로그인 시도:', { email, expectedRole });
      
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: expectedRole // 백엔드에서 role 검증을 위해 전달
        })
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const loginData = await response.json();
      console.log('✅ 로그인 성공:', loginData);

      // 응답에서 받은 사용자 역할이 expectedRole과 일치하는지 확인
      if (loginData.user?.role !== expectedRole) {
        throw new Error('선택하신 사용자 유형과 계정 정보가 일치하지 않습니다.');
      }

      // 사업자인 경우 partnerDetails의 데이터를 적절히 매핑
      if (loginData.user.role === 'OPERATOR' && loginData.partnerDetails) {
        const mappedData = {
          user: loginData.user,
          foodTruck: loginData.partnerDetails.foodTruck,
          menus: loginData.partnerDetails.menus,
          todaySales: loginData.partnerDetails.todaySales
        };
        setLoginData(mappedData);
      } else {
        // 일반 사용자인 경우
        setLoginData({ user: loginData.user });
      }
      
      setIsLoggedIn(true);
      return loginData;
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
          role: userData.role
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
    clearStore();
  };

  const fetchTodaySales = async () => {
    try {
      // Zustand 스토어에서 현재 로그인된 사용자 정보를 가져옵니다
      const { user } = useAppStore.getState();
      
      if (!user?.id) {
        console.warn('❌ 사용자 ID가 없어 매출 정보를 가져올 수 없습니다.');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/today-sales`); // 사용자 ID를 URL에 포함

      if (response.ok) {
        const salesData = await response.json();
        console.log('💰 오늘 매출 정보:', salesData);
        // setTodaySales는 useAppStore에서 가져온 것이 아니므로,
        // useAppStore에 setTodaySales 액션이 있다면 그것을 사용해야 합니다.
        // 현재 useAppStore에는 setLoginData만 있으므로, setTodaySales 액션을 추가해야 합니다.
        // 임시로 console.log로 대체하거나, useAppStore에 추가 후 사용하세요.
        // setTodaySales(salesData); 
        useAppStore.getState().setTodaySales(salesData); // ✅ 이렇게 호출해야 합니다.
      } else {
        const errorData = await response.json();
        console.error('❌ 매출 정보 가져오기 오류:', errorData.message);
      }
    } catch (error) {
      console.error('❌ 매출 정보 가져오기 오류:', error);
      Alert.alert('오류', '매출 정보를 가져오지 못했습니다.');
    }
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    signUp,
    fetchTodaySales,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 