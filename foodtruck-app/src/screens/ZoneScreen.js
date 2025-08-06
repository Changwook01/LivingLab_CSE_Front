import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.45.152:8080'; // ◀️ 본인 IP 주소로 수정!

const ZoneScreen = () => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('위치 정보를 불러오는 중...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isOperating, setIsOperating] = useState(false);
  const [isInOperatingZone, setIsInOperatingZone] = useState(false);
  const [truckId, setTruckId] = useState(7); // 임시 truckId, 나중에 실제 값으로 변경
  const [isZoneListVisible, setIsZoneListVisible] = useState(true); // 목록 보임/숨김 상태
  const [showNoZoneMessage, setShowNoZoneMessage] = useState(true); // 구역 없음 메시지 표시 상태

  useEffect(() => {
    (async () => {
      try {
        console.log('🔍 위치 권한 요청 시작...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📱 위치 권한 상태:', status);
        
        if (status !== 'granted') {
          console.log('❌ 위치 권한 거부됨');
          setErrorMsg('위치 정보 접근 권한이 거부되었습니다.');
          setLoading(false);
          return;
        }

        console.log('📍 현재 위치 가져오기 시작...');
        setStatusMessage('현재 위치를 확인하는 중...');
        
        // 위치 서비스 활성화 확인
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        console.log('📍 위치 서비스 활성화 상태:', isLocationEnabled);
        
        if (!isLocationEnabled) {
          console.log('❌ 위치 서비스 비활성화됨');
          setErrorMsg('위치 서비스가 비활성화되어 있습니다. 설정에서 위치 서비스를 활성화해주세요.');
          setLoading(false);
          return;
        }
        
        // 위치 가져오기 옵션 설정
        const locationOptions = {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 10,
          maximumAge: 60000, // 1분 이내의 캐시된 위치 허용
        };
        
        // 타임아웃 설정 (30초)
        const locationPromise = Location.getCurrentPositionAsync(locationOptions);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('위치 정보 가져오기 시간 초과')), 30000)
        );
        
        let location = await Promise.race([locationPromise, timeoutPromise]);
        console.log('✅ 위치 정보 획득:', location.coords);
        
        const { latitude, longitude } = location.coords;
        
        const currentUserLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };
        
        console.log('🗺️ 지도 영역 설정:', currentUserLocation);
        setRegion(currentUserLocation);
        setUserLocation({ latitude, longitude });
        setMapRegion(currentUserLocation);

        // 초기 로드 시 자동 구역 로드 비활성화
        console.log('📍 현재 위치 설정 완료 - 수동 새로고침으로 구역을 로드하세요');
        setIsInitialLoad(false);
        setLoading(false);

      } catch (error) {
        console.error('❌ 위치 정보 가져오기 실패:', error);
        
        // 기본 위치로 폴백 (서울 시청)
        console.log('🔄 기본 위치(서울 시청)로 설정');
        const defaultLocation = {
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };
        
        setRegion(defaultLocation);
        setUserLocation({ latitude: defaultLocation.latitude, longitude: defaultLocation.longitude });
        setMapRegion(defaultLocation);
        setIsInitialLoad(false);
        setLoading(false);
        
        setErrorMsg(`위치 정보를 가져오는 데 실패했습니다. 기본 위치(서울 시청)로 설정됩니다. ${error.message}`);
      }
    })();
  }, []);

  const fetchZonesInRegion = async (latitude, longitude, latitudeDelta, longitudeDelta) => {
    setStatusMessage('현재 지도 영역의 허가구역을 검색하는 중...');
    setLoading(true);
    setZones([]);

    try {
      // 지도 영역의 경계 계산
      const minLat = latitude - latitudeDelta;
      const maxLat = latitude + latitudeDelta;
      const minLon = longitude - longitudeDelta;
      const maxLon = longitude + longitudeDelta;
      
      const url = `${API_BASE_URL}/api/zones/region?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}`;
      
      // ✅✅ 더 자세한 로그 추가 ✅✅
      console.log('🔍 [지도 영역 검색 시작]');
      console.log(`📍 지도 중심: ${latitude}, ${longitude}`);
      console.log(`📐 영역 범위: ${latitudeDelta} x ${longitudeDelta}`);
      console.log(`🌐 요청 URL: ${url}`);
      console.log(`📱 플랫폼: ${Platform.OS}`);
      console.log(`🔗 API_BASE_URL: ${API_BASE_URL}`);
      
      const response = await fetch(url);
      
      console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // ✅✅ 백엔드로부터 받은 데이터를 터미널에 로그로 출력합니다. ✅✅
      console.log('====== 프론트엔드: 서버로부터 받은 데이터 ======');
      console.log(JSON.stringify(data, null, 2)); // JSON을 예쁘게 출력
      console.log(`==================== ${data.length}개 수신 ====================`);

      // 상태 업데이트를 확실히 하기 위해 새로운 배열로 설정
      const zonesData = [...data];
      setZones(zonesData);
      
      // 새로운 데이터가 로드되면 메시지 표시 상태 초기화
      setShowNoZoneMessage(true);
      
      // 마커 데이터 로그 출력
      if (data.length > 0) {
        console.log('🗺️ 구역 데이터 확인:');
        data.forEach((zone, index) => {
          console.log(`📍 구역 ${index + 1}: ${zone.name} (${zone.latitude}, ${zone.longitude})`);
        });
        
        // 현재 위치가 영업구역 내에 있는지 확인
        if (userLocation) {
          checkIfInOperatingZone(userLocation.latitude, userLocation.longitude, zonesData);
        }
        
        // 강제로 리렌더링을 위한 상태 업데이트
        setTimeout(() => {
          console.log('🔄 구역 데이터 강제 업데이트');
          setZones([...zonesData]);
        }, 200);
      } else {
        console.log('⚠️ 구역 데이터가 없습니다.');
        setIsInOperatingZone(false);
        setZones([]);
      }

    } catch (error) {
      console.error("❌ API fetch error:", error);
      console.error("❌ 에러 상세:", error.message);
      setErrorMsg('데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 마커 클릭 핸들러
  const handleMarkerPress = (zone) => {
    setSelectedZone(zone);
    console.log(`🎯 마커 클릭: ${zone.name}`);
  };

  // 마커 정보 표시 핸들러
  const handleMarkerCalloutPress = (zone) => {
    Alert.alert(
      zone.name,
      `주소: ${zone.address}\n상세 정보를 확인하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => console.log(`상세 정보: ${zone.name}`) }
      ]
    );
  };

  // 지도 영역 변경 핸들러
  const handleRegionChange = (newRegion) => {
    setMapRegion(newRegion);
    console.log('🗺️ 지도 영역 변경:', newRegion);
  };

  // 지도 영역 변경 완료 핸들러 (자동 새로고침 비활성화)
  const handleRegionChangeComplete = (newRegion) => {
    // 자동 새로고침 비활성화 - 수동 새로고침만 사용
    console.log('🗺️ 지도 영역 변경 완료 (자동 새로고침 비활성화)');
  };

  // 현재 위치가 영업구역 내에 있는지 확인하는 함수
  const checkIfInOperatingZone = (userLat, userLon, zones) => {
    if (!zones || zones.length === 0) {
      setIsInOperatingZone(false);
      return false;
    }

    // 각 구역의 반지름 (미터 단위)
    const zoneRadius = 100; // 100미터 반지름

    for (const zone of zones) {
      const distance = calculateDistance(
        userLat, userLon,
        zone.latitude, zone.longitude
      );

      if (distance <= zoneRadius) {
        console.log(`✅ 영업구역 내 위치 확인: ${zone.name} (거리: ${distance.toFixed(2)}m)`);
        setIsInOperatingZone(true);
        return true;
      }
    }

    console.log('❌ 영업구역 밖 위치');
    setIsInOperatingZone(false);
    return false;
  };

  // 두 지점 간의 거리 계산 (미터 단위)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 영업 시작 API 호출
  const startBusiness = async (latitude, longitude) => {
    try {
      console.log('🚀 영업 시작 API 호출');
      const url = `${API_BASE_URL}/api/food-trucks/${truckId}/start`;
      
      const requestBody = {
        latitude: latitude,
        longitude: longitude
      };
      
      console.log('📡 요청 URL:', url);
      console.log('📦 요청 데이터:', requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📡 응답 상태:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ 영업 시작 성공:', result);
        setIsOperating(true);
        return true;
      } else {
        console.error('❌ 영업 시작 실패:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ 영업 시작 API 오류:', error);
      return false;
    }
  };

  // 영업 종료 API 호출
  const stopBusiness = async () => {
    try {
      console.log('🛑 영업 종료 API 호출');
      const url = `${API_BASE_URL}/api/food-trucks/${truckId}/stop`;
      
      console.log('📡 요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📡 응답 상태:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ 영업 종료 성공:', result);
        setIsOperating(false);
        return true;
      } else {
        console.error('❌ 영업 종료 실패:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ 영업 종료 API 오류:', error);
      return false;
    }
  };
  
  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  }

  // region이 설정되지 않았으면 로딩 화면 표시
  if (!region) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>위치 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* 허가구역 원형 구역들 */}
        {zones && zones.length > 0 && zones.map((zone) => (
          <Circle
            key={`circle-${zone.id.toString()}`}
            center={{ latitude: zone.latitude, longitude: zone.longitude }}
            radius={selectedZone?.id === zone.id ? 150 : 100} // 선택된 구역은 더 크게
            fillColor={selectedZone?.id === zone.id ? "rgba(255, 107, 53, 0.3)" : "rgba(255, 165, 0, 0.2)"}
            strokeColor={selectedZone?.id === zone.id ? "#FF6B35" : "#FFA500"}
            strokeWidth={selectedZone?.id === zone.id ? 3 : 2}
            onPress={() => handleMarkerPress(zone)}
          />
        ))}
        
        {/* 허가구역 중심점 (투명한 클릭 영역) */}
        {zones && zones.length > 0 && zones.map((zone) => (
          <Marker
            key={`marker-${zone.id.toString()}`}
            coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
            title={zone.name}
            description={zone.address}
            onPress={() => handleMarkerPress(zone)}
            onCalloutPress={() => handleMarkerCalloutPress(zone)}
            opacity={0} // 투명하게 만들어서 보이지 않게
          >
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{zone.name}</Text>
                <Text style={styles.calloutAddress}>{zone.address}</Text>
                <TouchableOpacity 
                  style={styles.calloutButton}
                  onPress={() => handleMarkerCalloutPress(zone)}
                >
                  <Text style={styles.calloutButtonText}>상세보기</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
        
        {/* 현재 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="현재 위치"
            description="내 위치"
            pinColor="blue"
          />
        )}
      </MapView>
      
      {/* 구역 로드 버튼 */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={() => {
          if (mapRegion) {
            console.log('🔄 현재 지도 영역의 구역 로드 시작');
            setIsInitialLoad(false);
            fetchZonesInRegion(
              mapRegion.latitude,
              mapRegion.longitude,
              mapRegion.latitudeDelta,
              mapRegion.longitudeDelta
            );
          }
        }}
      >
        <Text style={styles.refreshButtonText}>🗺️ 구역 로드</Text>
      </TouchableOpacity>

      {/* 영업 시작/종료 버튼 */}
      <TouchableOpacity 
        style={[
          styles.operatingButton,
          isInOperatingZone ? styles.operatingButtonActive : styles.operatingButtonInactive,
          isOperating && styles.operatingButtonOperating
        ]}
        onPress={async () => {
          if (isInOperatingZone) {
            if (!isOperating) {
              // 영업 시작
              if (userLocation) {
                const success = await startBusiness(userLocation.latitude, userLocation.longitude);
                if (!success) {
                  console.log('❌ 영업 시작에 실패했습니다.');
                }
              } else {
                console.log('❌ 위치 정보가 없습니다.');
              }
            } else {
              // 영업 종료
              const success = await stopBusiness();
              if (!success) {
                console.log('❌ 영업 종료에 실패했습니다.');
              }
            }
          } else {
            console.log('❌ 영업구역 밖에서는 영업할 수 없습니다.');
          }
        }}
        disabled={!isInOperatingZone}
      >
        <Text style={styles.operatingButtonText}>
          {isOperating ? '🛑 영업 종료' : '🚀 영업 시작'}
        </Text>
      </TouchableOpacity>

      {/* 구역 목록 오버레이 */}
      {zones && zones.length > 0 && (
        <View style={[styles.zoneListOverlay, !isZoneListVisible && styles.zoneListOverlayHidden]}>
          <View style={styles.zoneListHeader}>
            <Text style={styles.zoneListTitle}>주변 허가구역 목록</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.zoneListCount}>{zones.length}개 구역</Text>
              <TouchableOpacity
                style={styles.zoneListToggleBtn}
                onPress={() => setIsZoneListVisible((v) => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.zoneListToggleBtnText}>
                  {isZoneListVisible ? '▼' : '▲'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isZoneListVisible && (
            <ScrollView style={styles.zoneListScroll} showsVerticalScrollIndicator={false}>
              {zones.map((zone, index) => (
                <TouchableOpacity
                  key={`list-${zone.id}`}
                  style={[
                    styles.zoneListItem,
                    selectedZone?.id === zone.id && styles.zoneListItemSelected
                  ]}
                  onPress={() => {
                    setSelectedZone(zone);
                    console.log(`📋 목록에서 구역 선택: ${zone.name}`);
                  }}
                >
                  <View style={styles.zoneListItemContent}>
                    <Text style={styles.zoneListItemName}>{zone.name}</Text>
                    <Text style={styles.zoneListItemAddress}>{zone.address}</Text>
                    <View style={styles.zoneListItemMeta}>
                      <Text style={styles.zoneListItemDistance}>
                        📍 {calculateDistance(
                          userLocation?.latitude || 0,
                          userLocation?.longitude || 0,
                          zone.latitude,
                          zone.longitude
                        ).toFixed(0)}m
                      </Text>
                      <Text style={styles.zoneListItemId}>ID: {zone.id}</Text>
                    </View>
                  </View>
                  <View style={styles.zoneListItemArrow}>
                    <Text style={styles.zoneListItemArrowText}>▶</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* 구역이 없을 때 메시지 오버레이 */}
      {zones && zones.length === 0 && !loading && !isInitialLoad && showNoZoneMessage && (
        <View style={styles.noZoneOverlay}>
          {/* X 버튼 */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              console.log('❌ 구역 없음 메시지 닫기');
              setShowNoZoneMessage(false);
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.noZoneContainer}>
            <Text style={styles.noZoneIcon}>🗺️</Text>
            <Text style={styles.noZoneTitle}>이 지역에 영업구역이 없습니다</Text>
            <Text style={styles.noZoneSubtitle}>다른 지역을 확인해보세요</Text>
          </View>
        </View>
      )}

      {/* 선택된 구역 정보 오버레이 */}
      {selectedZone && (
        <View style={styles.zoneInfoOverlay}>
          {/* X 버튼 */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              console.log('❌ 구역 정보 닫기');
              setSelectedZone(null);
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.zoneInfoContainer}>
            <Text style={styles.zoneInfoTitle}>{selectedZone.name}</Text>
            <Text style={styles.zoneInfoAddress}>{selectedZone.address}</Text>
            <TouchableOpacity 
              style={styles.zoneInfoButton}
              onPress={() => handleMarkerCalloutPress(selectedZone)}
            >
              <Text style={styles.zoneInfoButtonText}>상세보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>{statusMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#333' },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  zoneInfoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoneInfoContainer: {
    alignItems: 'center',
  },
  zoneInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  zoneInfoAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  zoneInfoButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  zoneInfoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  operatingButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  operatingButtonActive: {
    backgroundColor: '#4CAF50', // 초록색 (영업 가능)
  },
  operatingButtonInactive: {
    backgroundColor: '#9E9E9E', // 회색 (영업 불가)
  },
  operatingButtonOperating: {
    backgroundColor: '#F44336', // 빨간색 (영업 중)
  },
  operatingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  zoneListOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '50%',
    zIndex: 10,
  },
  zoneListOverlayHidden: {
    maxHeight: 40,
    overflow: 'hidden',
  },
  zoneListToggleBtn: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  zoneListToggleBtnText: {
    fontSize: 22,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  zoneListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  zoneListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  zoneListCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneListScroll: {
    maxHeight: 300,
  },
  zoneListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  zoneListItemSelected: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  zoneListItemContent: {
    flex: 1,
  },
  zoneListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  zoneListItemAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  zoneListItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneListItemDistance: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  zoneListItemId: {
    fontSize: 12,
    color: '#999',
  },
  zoneListItemArrow: {
    marginLeft: 10,
  },
  zoneListItemArrowText: {
    fontSize: 16,
    color: '#ccc',
  },
  noZoneOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noZoneContainer: {
    alignItems: 'center',
  },
  noZoneIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  noZoneSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ZoneScreen;