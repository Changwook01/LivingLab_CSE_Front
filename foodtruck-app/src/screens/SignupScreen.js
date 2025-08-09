
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignupScreen = ({onBusinessSignup, onBack}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: 타입선택, 2: 기본정보, 3: 추가정보
  const [userType, setUserType] = useState(''); // 'customer' or 'business'
  const [formData, setFormData] = useState({
    // 공통 필드
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // 사업자 전용 필드
    businessNumber: '',
    businessName: '',
    truckName: '',
    truckSize: '',
    truckNumber: '',
    
    // 일반사용자 전용 필드
    nickname: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({});

  // 입력값 업데이트
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 유효성 검사
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 2) {
      // 기본 정보 검증
      if (!formData.email) {
        newErrors.email = '이메일을 입력해주세요';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다';
      }

      if (!formData.password) {
        newErrors.password = '비밀번호를 입력해주세요';
      } else if (formData.password.length < 6) {
        newErrors.password = '비밀번호는 6자 이상이어야 합니다';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }

      if (!formData.name) {
        newErrors.name = '이름을 입력해주세요';
      }

      if (!formData.phone) {
        newErrors.phone = '전화번호를 입력해주세요';
      } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone)) {
        newErrors.phone = '올바른 전화번호 형식이 아닙니다';
      }
    }

    if (step === 3) {
      if (userType === 'business') {
        if (!formData.businessNumber) {
          newErrors.businessNumber = '사업자 등록번호를 입력해주세요';
        }
        if (!formData.businessName) {
          newErrors.businessName = '사업체명을 입력해주세요';
        }
        if (!formData.truckName) {
          newErrors.truckName = '푸드트럭명을 입력해주세요';
        }
        if (!formData.truckNumber) {
          newErrors.truckNumber = '차량번호를 입력해주세요';
        }
      } else {
        if (!formData.nickname) {
          newErrors.nickname = '닉네임을 입력해주세요';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로
  const handleNext = () => {
    if (currentStep === 1 && !userType) {
      Alert.alert('알림', '사용자 타입을 선택해주세요');
      return;
    }

     // ✅ 1단계에서 사업자 선택 시: 여기서 사업자 회원가입 화면으로 이동
  if (currentStep === 1 && userType === 'business') {
    onBusinessSignup?.();
    return;
  }

    if (currentStep > 1 && !validateStep(currentStep)) {
      return;
    }

    if (currentStep === 3) {
      handleSignup();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // 회원가입 처리
  const handleSignup = () => {
    Alert.alert(
      '회원가입 완료',
      `${userType === 'business' ? '사업자' : '일반사용자'} 회원가입이 완료되었습니다!`,
      [{ text: '확인', onPress: () => console.log('회원가입 완료') }]
    );
  };

  // 사용자 타입 선택 화면
 // 사용자 타입 선택 화면
const renderUserTypeSelection = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>회원가입</Text>
        <Text style={styles.stepSubtitle}>사용자 타입을 선택해주세요</Text>
      </View>
  
      <View style={styles.userTypeContainer}>
        {/* 일반 사용자 선택 */}
        <TouchableOpacity
          style={[
            styles.userTypeCard,
            userType === 'customer' && styles.userTypeCardSelected
          ]}
          onPress={() => setUserType('customer')}
        >
          <View style={styles.userTypeIcon}>
            <Text style={styles.userTypeEmoji}>👤</Text>
          </View>
          <Text style={styles.userTypeTitle}>일반사용자</Text>
          <Text style={styles.userTypeDescription}>
            푸드트럭을 찾고 주문하는 고객
          </Text>
          <View style={styles.userTypeFeatures}>
            <Text style={styles.featureText}>• 푸드트럭 검색 및 주문</Text>
            <Text style={styles.featureText}>• 리뷰 작성</Text>
            <Text style={styles.featureText}>• 즐겨찾기 관리</Text>
          </View>
          {userType === 'customer' && (
            <View style={styles.selectedBadge}>
              <Icon name="check-circle" size={20} color="#FF6B35" />
            </View>
          )}
        </TouchableOpacity>
  
        {/* 사업자 선택 → BusinessSignupScreen으로 이동 */}
        <TouchableOpacity
          style={[
            styles.userTypeCard,
            userType === 'business' && styles.userTypeCardSelected
          ]}
          onPress={() => setUserType('business')} 
        >
          <View style={styles.userTypeIcon}>
            <Text style={styles.userTypeEmoji}>🚚</Text>
          </View>
          <Text style={styles.userTypeTitle}>사업자</Text>
          <Text style={styles.userTypeDescription}>
            푸드트럭을 운영하는 사업자
          </Text>
          <View style={styles.userTypeFeatures}>
            <Text style={styles.featureText}>• 푸드트럭 등록 및 관리</Text>
            <Text style={styles.featureText}>• 메뉴 관리</Text>
            <Text style={styles.featureText}>• 주문 관리 및 매출 분석</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 기본 정보 입력 화면
  const renderBasicInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>기본 정보</Text>
        <Text style={styles.stepSubtitle}>
          {userType === 'business' ? '사업자' : '일반사용자'} 기본 정보를 입력해주세요
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>이메일</Text>
          <TextInput
            style={[styles.textInput, errors.email && styles.textInputError]}
            placeholder="example@email.com"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <TextInput
            style={[styles.textInput, errors.password && styles.textInputError]}
            placeholder="6자 이상 입력해주세요"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>비밀번호 확인</Text>
          <TextInput
            style={[styles.textInput, errors.confirmPassword && styles.textInputError]}
            placeholder="비밀번호를 다시 입력해주세요"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={[styles.textInput, errors.name && styles.textInputError]}
            placeholder="실명을 입력해주세요"
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>전화번호</Text>
          <TextInput
            style={[styles.textInput, errors.phone && styles.textInputError]}
            placeholder="010-1234-5678"
            value={formData.phone}
            onChangeText={(text) => updateFormData('phone', text)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
      </View>
    </View>
  );

  // 진행 상태 표시
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.progressStep}>
          <View style={[
            styles.progressCircle,
            currentStep >= step && styles.progressCircleActive
          ]}>
            <Text style={[
              styles.progressText,
              currentStep >= step && styles.progressTextActive
            ]}>
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View style={[
              styles.progressLine,
              currentStep > step && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 헤더 */}
        <View style={styles.header}>
        {currentStep === 1 ? (
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-left" size={24} color="#333" />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => setCurrentStep(currentStep - 1)}
    >
      <Icon name="arrow-left" size={24} color="#333" />
    </TouchableOpacity>
  )}

          <Text style={styles.headerTitle}>
            {currentStep === 1 ? '회원가입' : 
             currentStep === 2 ? '기본 정보' : '추가 정보'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* 진행 상태 */}
        {renderProgressBar()}

        {/* 메인 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderUserTypeSelection()}
          {currentStep === 2 && renderBasicInfo()}
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              (currentStep === 1 && !userType) && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={currentStep === 1 && !userType}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 3 ? '회원가입 완료' : '다음'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },

  // 진행 상태 스타일
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#FF6B35',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  progressTextActive: {
    color: 'white',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#FF6B35',
  },

  // 콘텐츠 스타일
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  // 사용자 타입 선택 스타일
  userTypeContainer: {
    gap: 16,
  },
  userTypeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  userTypeCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff9f5',
  },
  userTypeIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userTypeEmoji: {
    fontSize: 48,
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  userTypeFeatures: {
    gap: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  // 폼 스타일
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  textInputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },

  // 라디오 버튼 스타일
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  radioOptionSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff9f5',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#FF6B35',
  },

  // 하단 버튼 스타일
  bottomContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
