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
  Platform,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BusinessSignupScreen = ({onGoHome}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: 타입선택, 2: 기본정보, 3: 사업자정보, 4-10: 창업패키지 단계들
  const [signupType, setSignupType] = useState(''); // 'existing' or 'startup'
  const [startupStep, setStartupStep] = useState(1); // 창업 패키지 내부 단계
  const [completedSteps, setCompletedSteps] = useState(new Set()); // 완료된 단계들
  
  const [formData, setFormData] = useState({
    // 기본 정보
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // 사업자 정보
    businessNumber: '',
    businessName: '',
    truckName: '',
    truckSize: '',
    truckNumber: '',
    
    // 창업 패키지 정보
    selectedRegion: '',
    selectedFoodType: '',
    hasSpecialVehicle: false,
    businessLicense: null,
  });
  
  const [errors, setErrors] = useState({});

  // 창업 패키지 단계 정보
  const startupSteps = [
    {
      id: 1,
      title: '허용 지역 선택',
      description: '푸드트럭 운영이 가능한 지역을 선택해주세요',
      type: 'selection'
    },
    {
      id: 2,
      title: '음식 종류 선택',
      description: '판매할 음식의 종류를 선택해주세요',
      type: 'selection'
    },
    {
      id: 3,
      title: '자동차 구조변경 신청',
      description: '이동용 음식판매 특수용도 자동차로 구조변경 신청',
      type: 'external',
      url: 'https://main.kotsa.or.kr/portal/contents.do?menuCode=01020100'
    },
    {
      id: 4,
      title: '액화석유가스완성검사',
      description: '가스 시설 완성검사를 받아주세요',
      type: 'external',
      url: 'https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A03006&CappBizCD=14100000098&tp_seq=01'
    },
    {
      id: 5,
      title: '자동차등록증 발부',
      description: '구조변경된 차량의 등록증을 발부받아주세요',
      type: 'external',
      url: 'https://main.kotsa.or.kr/portal/contents.do?menuCode=04040200'
    },
    {
      id: 6,
      title: '위생교육 6시간 이수',
      description: '식품위생 관련 교육을 이수해주세요',
      type: 'external',
      url: 'https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1966&ccfNo=1&cciNo=4&cnpClsNo=1'
    },
    {
      id: 7,
      title: '사업자등록증 신청',
      description: '사업자등록증을 신청해주세요',
      type: 'external',
      url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2444&cntntsId=7777'
    }
  ];

  // 지역 옵션
  const regions = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
    '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  // 음식 종류 옵션
  const foodTypes = [
    '타코야끼', '붕어빵', '호떡', '떡볶이', '순대', '김밥',
    '햄버거', '핫도그', '치킨', '피자', '타코', '와플',
    '아이스크림', '커피', '음료', '기타'
  ];

  // 입력값 업데이트
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 외부 링크 열기
  const openExternalLink = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('오류', '링크를 열 수 없습니다.');
    });
  };

  // 단계 완료 처리
  const completeStep = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    if (stepId === 7) {
      // 사업자등록증 신청 완료 시
      Alert.alert(
        '창업 패키지 완료',
        '모든 창업 절차가 완료되었습니다!\n이제 사업자 정보를 입력해주세요.',
        [{ text: '확인', onPress: () => setCurrentStep(3) }]
      );
    } else if (stepId === 3) {
      // 구조변경 신청 완료 시
      Alert.alert(
        '신청 완료',
        '구조변경 신청이 완료되었습니다.\n구조변경 검사를 신청해주세요.',
        [{ text: '확인', onPress: () => setStartupStep(4) }]
      );
    } else {
      setStartupStep(stepId + 1);
    }
  };

  // 사업자 타입 선택 화면
  const renderBusinessTypeSelection = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>사업자 회원가입</Text>
        <Text style={styles.stepSubtitle}>사업자 유형을 선택해주세요</Text>
      </View>

      <View style={styles.businessTypeContainer}>
        <TouchableOpacity
          style={[
            styles.businessTypeCard,
            signupType === 'existing' && styles.businessTypeCardSelected
          ]}
          onPress={() => setSignupType('existing')}
        >
          <View style={styles.businessTypeIcon}>
            <Text style={styles.businessTypeEmoji}>🏢</Text>
          </View>
          <Text style={styles.businessTypeTitle}>기존 사업자</Text>
          <Text style={styles.businessTypeDescription}>
            이미 사업자등록증을 보유한 사업자
          </Text>
          <View style={styles.businessTypeFeatures}>
            <Text style={styles.featureText}>• 사업자등록증 제출</Text>
            <Text style={styles.featureText}>• 빠른 승인 처리</Text>
          </View>
          {signupType === 'existing' && (
            <View style={styles.selectedBadge}>
              <Icon name="check-circle" size={20} color="#FF6B35" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.startupPackageContainer}>
          <TouchableOpacity
            style={[
              styles.businessTypeCard,
              styles.startupPackageCard,
              signupType === 'startup' && styles.businessTypeCardSelected
            ]}
            onPress={() => setSignupType('startup')}
          >
            <View style={styles.startupBadge}>
              <Text style={styles.startupBadgeText}>🎉 창업 패키지</Text>
            </View>
            <View style={styles.businessTypeIcon}>
              <Text style={styles.businessTypeEmoji}>🚚</Text>
            </View>
            <Text style={styles.businessTypeTitle}>신규 창업자</Text>
            <Text style={styles.businessTypeDescription}>
              푸드트럭 창업을 준비하는 예비 사업자
            </Text>
            <View style={styles.businessTypeFeatures}>
              <Text style={styles.featureText}>• 단계별 창업 가이드</Text>
              <Text style={styles.featureText}>• 필요 서류 안내</Text>
              <Text style={styles.featureText}>• 정부 사이트 연동</Text>
            </View>
            {signupType === 'startup' && (
              <View style={styles.selectedBadge}>
                <Icon name="check-circle" size={20} color="#FF6B35" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.adBanner}>
            <Text style={styles.adText}>🎯 창업 성공률 95% 달성!</Text>
            <Text style={styles.adSubText}>체계적인 가이드로 안전한 창업</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // 기본 정보 입력 화면
  const renderBasicInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>기본 정보</Text>
        <Text style={styles.stepSubtitle}>기본 정보를 입력해주세요</Text>
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

  // 창업 패키지 단계 화면
  const renderStartupStep = () => {
    const currentStepInfo = startupSteps[startupStep - 1];
    
    if (currentStepInfo.type === 'selection') {
      if (startupStep === 1) {
        // 지역 선택
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{currentStepInfo.title}</Text>
              <Text style={styles.stepSubtitle}>{currentStepInfo.description}</Text>
            </View>

            <View style={styles.selectionContainer}>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.selectionItem,
                    formData.selectedRegion === region && styles.selectionItemSelected
                  ]}
                  onPress={() => updateFormData('selectedRegion', region)}
                >
                  <Text style={[
                    styles.selectionText,
                    formData.selectedRegion === region && styles.selectionTextSelected
                  ]}>
                    {region}
                  </Text>
                  {formData.selectedRegion === region && (
                    <Icon name="check" size={16} color="#FF6B35" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      } else if (startupStep === 2) {
        // 음식 종류 선택
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{currentStepInfo.title}</Text>
              <Text style={styles.stepSubtitle}>{currentStepInfo.description}</Text>
            </View>

            <View style={styles.foodTypeGrid}>
              {foodTypes.map((food) => (
                <TouchableOpacity
                  key={food}
                  style={[
                    styles.foodTypeItem,
                    formData.selectedFoodType === food && styles.foodTypeItemSelected
                  ]}
                  onPress={() => updateFormData('selectedFoodType', food)}
                >
                  <Text style={[
                    styles.foodTypeText,
                    formData.selectedFoodType === food && styles.foodTypeTextSelected
                  ]}>
                    {food}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }
    } else if (currentStepInfo.type === 'external') {
      // 외부 링크 단계
      return (
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{currentStepInfo.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepInfo.description}</Text>
          </View>

          <View style={styles.externalStepContainer}>
            <View style={styles.instructionCard}>
              <Icon name="information" size={24} color="#4A90E2" />
              <Text style={styles.instructionTitle}>신청 방법</Text>
              <Text style={styles.instructionText}>
                아래 버튼을 눌러 정부 사이트에서 신청을 진행해주세요.
                {startupStep === 3 && '\n\n이미 이동용 음식판매 특수용도 자동차를 보유하고 계시다면 건너뛰기를 눌러주세요.'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.externalLinkButton}
              onPress={() => openExternalLink(currentStepInfo.url)}
            >
              <Icon name="open-in-new" size={20} color="white" />
              <Text style={styles.externalLinkText}>정부 사이트에서 신청하기</Text>
            </TouchableOpacity>

            {startupStep === 3 && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  updateFormData('hasSpecialVehicle', true);
                  completeStep(3);
                }}
              >
                <Text style={styles.skipButtonText}>특수용도 자동차 보유 (건너뛰기)</Text>
              </TouchableOpacity>
            )}

            <View style={styles.completionContainer}>
              <Text style={styles.completionText}>신청이 완료되셨나요?</Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => completeStep(startupStep)}
              >
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  // 사업자 정보 입력 화면 (기존 사업자 또는 창업 패키지 완료 후)
  const renderBusinessInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>사업자 정보</Text>
        <Text style={styles.stepSubtitle}>
          {signupType === 'existing' 
            ? '사업자 정보를 입력해주세요' 
            : '창업 패키지가 완료되었습니다.\n사업자 정보를 입력해주세요'
          }
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>사업자등록번호</Text>
          <TextInput
            style={[styles.textInput, errors.businessNumber && styles.textInputError]}
            placeholder="123-45-67890"
            value={formData.businessNumber}
            onChangeText={(text) => updateFormData('businessNumber', text)}
            keyboardType="numeric"
          />
          {errors.businessNumber && <Text style={styles.errorText}>{errors.businessNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>사업체명</Text>
          <TextInput
            style={[styles.textInput, errors.businessName && styles.textInputError]}
            placeholder="사업체명을 입력해주세요"
            value={formData.businessName}
            onChangeText={(text) => updateFormData('businessName', text)}
          />
          {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>푸드트럭명</Text>
          <TextInput
            style={[styles.textInput, errors.truckName && styles.textInputError]}
            placeholder="푸드트럭명을 입력해주세요"
            value={formData.truckName}
            onChangeText={(text) => updateFormData('truckName', text)}
          />
          {errors.truckName && <Text style={styles.errorText}>{errors.truckName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>차량번호</Text>
          <TextInput
            style={[styles.textInput, errors.truckNumber && styles.textInputError]}
            placeholder="12가 3456"
            value={formData.truckNumber}
            onChangeText={(text) => updateFormData('truckNumber', text)}
          />
          {errors.truckNumber && <Text style={styles.errorText}>{errors.truckNumber}</Text>}
        </View>

        <View style={styles.documentUploadContainer}>
          <Text style={styles.inputLabel}>사업자등록증 제출</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Icon name="file-upload" size={20} color="#666" />
            <Text style={styles.uploadButtonText}>파일 선택</Text>
          </TouchableOpacity>
          <Text style={styles.uploadNote}>
            사업자등록증을 제출하시면 관리자 승인 후 서비스를 이용하실 수 있습니다.
          </Text>
        </View>
      </View>
    </View>
  );

  // 승인 대기 화면
  const renderApprovalWaiting = (onGoHome) => (
    <View style={styles.stepContainer}>
      <View style={styles.approvalContainer}>
        <View style={styles.approvalIcon}>
          <Icon name="clock-outline" size={64} color="#FF6B35" />
        </View>
        <Text style={styles.approvalTitle}>승인 대기 중</Text>
        <Text style={styles.approvalText}>
          회원가입 신청이 완료되었습니다.{'\n'}
          관리자 승인 후 서비스를 이용하실 수 있습니다.{'\n\n'}
          승인까지 1-2일 정도 소요될 예정입니다.
        </Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={onGoHome}
        >
          <Text style={styles.homeButtonText}>홈으로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 다음 단계 처리
  const handleNext = () => {
    if (currentStep === 1 && !signupType) {
      Alert.alert('알림', '사업자 유형을 선택해주세요');
      return;
    }

    if (currentStep === 1) {
      if (signupType === 'existing') {
        setCurrentStep(2); // 기본정보로
      } else {
        setCurrentStep(4); // 창업패키지 시작
      }
    } else if (currentStep === 2) {
      setCurrentStep(3); // 사업자정보로
    } else if (currentStep === 3) {
      setCurrentStep(11); // 승인대기로
    } else if (currentStep >= 4 && currentStep <= 10) {
      // 창업 패키지 단계 처리
      if (startupStep === 1 && !formData.selectedRegion) {
        Alert.alert('알림', '지역을 선택해주세요');
        return;
      }
      if (startupStep === 2 && !formData.selectedFoodType) {
        Alert.alert('알림', '음식 종류를 선택해주세요');
        return;
      }
      
      if (startupStep <= 2) {
        setStartupStep(startupStep + 1);
      }
    }
  };

  // 현재 화면 렌더링
  const renderCurrentScreen = () => {
    if (currentStep === 1) return renderBusinessTypeSelection();
    if (currentStep === 2) return renderBasicInfo();
    if (currentStep === 3) return renderBusinessInfo();
    if (currentStep >= 4 && currentStep <= 10) return renderStartupStep();
    if (currentStep === 11) return renderApprovalWaiting(onGoHome);
  };

  // 진행 상태 표시
  const renderProgressBar = () => {
    if (currentStep === 11) return null; // 승인 대기 화면에서는 숨김
    
    let totalSteps = 3;
    let currentProgress = currentStep;
    
    if (signupType === 'startup' && currentStep >= 4) {
      totalSteps = 10;
      currentProgress = 3 + startupStep;
    }

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${(currentProgress / totalSteps) * 100}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {currentProgress} / {totalSteps}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          {currentStep > 1 && currentStep !== 11 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (currentStep >= 4 && startupStep > 1) {
                  setStartupStep(startupStep - 1);
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {currentStep === 1 ? '사업자 회원가입' :
             currentStep === 2 ? '기본 정보' :
             currentStep === 3 ? '사업자 정보' :
             currentStep === 11 ? '가입 완료' :
             startupSteps[startupStep - 1]?.title || '창업 패키지'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* 진행 상태 */}
        {renderProgressBar()}

        {/* 메인 콘텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentScreen()}
        </ScrollView>

        {/* 하단 버튼 */}
        {currentStep !== 11 && (currentStep < 4 || startupStep <= 2) && (
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={[
                styles.nextButton,
                (currentStep === 1 && !signupType) && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={currentStep === 1 && !signupType}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? '회원가입 신청' : '다음'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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

  // 사업자 타입 선택 스타일
  businessTypeContainer: {
    gap: 16,
  },
  businessTypeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  businessTypeCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff9f5',
  },
  businessTypeIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  businessTypeEmoji: {
    fontSize: 48,
  },
  businessTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  businessTypeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  businessTypeFeatures: {
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

  // 창업 패키지 스타일
  startupPackageContainer: {
    position: 'relative',
  },
  startupPackageCard: {
    borderColor: '#FFD700',
    backgroundColor: '#fffbf0',
  },
  startupBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    right: 16,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 4,
    alignItems: 'center',
    zIndex: 1,
  },
  startupBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  adBanner: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  adText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  adSubText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },

  // 선택 스타일
  selectionContainer: {
    gap: 12,
  },
  selectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectionItemSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff9f5',
  },
  selectionText: {
    fontSize: 16,
    color: '#333',
  },
  selectionTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },

  // 음식 종류 그리드
  foodTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  foodTypeItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  foodTypeItemSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff9f5',
  },
  foodTypeText: {
    fontSize: 14,
    color: '#333',
  },
  foodTypeTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },

  // 외부 링크 단계 스타일
  externalStepContainer: {
    gap: 24,
  },
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  externalLinkButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  externalLinkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  completionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  completionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#00CC66',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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

  // 문서 업로드 스타일
  documentUploadContainer: {
    gap: 12,
  },
  uploadButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#666',
  },
  uploadNote: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },

  // 승인 대기 스타일
  approvalContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 24,
  },
  approvalIcon: {
    marginBottom: 16,
  },
  approvalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  approvalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default BusinessSignupScreen;
