import { React, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StatusBarHeader from '../components/StatusBarHeader';
import { menuService } from '../services/menuService';
import EditMenuModal from '../components/EditMenuModal';
import AddMenuModal from '../components/AddMenuModal'; 
// 메뉴 화면
const MenuScreen = () => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await menuService.getAllMenus();  // ← 여기 수정
        setMenuData(data);
      } catch (error) {
        console.error('메뉴 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMenus();
  }, []);
    
  const handleSave = async (updatedMenu) => {
    console.log('📦 업데이트할 메뉴:', updatedMenu); // 🔍 확인용
    try {
      await menuService.updateMenu(updatedMenu.id, updatedMenu);
      const newMenuData = menuData.map(menu =>
        menu.id === updatedMenu.id ? updatedMenu : menu
      );
      setMenuData(newMenuData);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('메뉴 수정 실패:', error);
    }
  };
  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setIsEditModalVisible(true);
  };

  const handleAddMenu = async () => {
    try {
      const added = await menuService.addMenu(newMenu);
      setMenuData([...menuData, added]);
      setIsAddModalVisible(false);
      setNewMenu({ name: '', price: '', category: '', imageUrl: '', available: true });
    } catch (error) {
      console.error('메뉴 추가 실패:', error);
      Alert.alert('에러', '메뉴 추가 중 문제가 발생했습니다.');
    }
  };

  // 카테고리 목록 생성
  const categories = ['전체', ...new Set(menuData.map(menu => menu.category))];
  
  // 선택된 카테고리에 따른 메뉴 필터링
  const filteredMenus = activeCategory === '전체' 
    ? menuData 
    : menuData.filter(menu => menu.category === activeCategory);

  // 카테고리별 메뉴 개수
  const getCategoryCount = (category) => {
    if (category === '전체') return menuData.length;
    return menuData.filter(menu => menu.category === category).length;
  };

  // 메뉴 가용성 토글
  const toggleMenuAvailability = (menuId) => {
    setMenuData(prevData => 
      prevData.map(menu => 
        menu.id === menuId 
          ? { ...menu, isAvailable: !menu.isAvailable }
          : menu
      )
    );
  };

  // 메뉴 삭제
  const deleteMenu = (menuId) => {
    Alert.alert(
      "메뉴 삭제",
      "정말로 이 메뉴를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: () => {
            setMenuData(prevData => prevData.filter(menu => menu.id !== menuId));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddMenuModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleAddMenu}
        newMenu={newMenu}
        setNewMenu={setNewMenu}
      />
      <StatusBarHeader />

      {/* 통계 카드 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{menuData.length}</Text>
          <Text style={styles.statLabel}>전체 메뉴</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#00CC66' }]}>
            {menuData.filter(m => m.isAvailable).length}
          </Text>
          <Text style={styles.statLabel}>판매중</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#FF4444' }]}>
            {menuData.filter(m => !m.isAvailable).length}
          </Text>
          <Text style={styles.statLabel}>품절</Text>
        </View>
      </View>

      {/* 카테고리 탭 */}
      <View style={{ height: 60, backgroundColor: 'white' }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabContainer}
        contentContainerStyle={styles.categoryTabContent}
      >
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.categoryTab, 
              activeCategory === category && styles.activeCategoryTab
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryTabText, 
              activeCategory === category && styles.activeCategoryTabText
            ]}>
              {category}
            </Text>
            <View style={[
              styles.categoryCount,
              activeCategory === category && styles.activeCategoryCount
            ]}>
              <Text style={[
                styles.categoryCountText,
                activeCategory === category && styles.activeCategoryCountText
              ]}>
                {getCategoryCount(category)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      {/* 메뉴 목록 */}
      <ScrollView 
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
      >
        {filteredMenus.length > 0 ? (
          filteredMenus.map((menu) => (
            <MenuItemCard 
              key={menu.id}
              menu={menu}
              onToggleAvailability={toggleMenuAvailability}
              onDelete={deleteMenu}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>메뉴가 없습니다</Text>
            <Text style={styles.emptyText}>
              {activeCategory === '전체' 
                ? '첫 번째 메뉴를 추가해보세요' 
                : `${activeCategory} 카테고리에 메뉴가 없습니다`
              }
            </Text>
            <View style={styles.menuHeader}>
              <TouchableOpacity style={styles.addMenuHeaderButton}>
                <Icon name="plus" size={16} color="#FF6B35" />
                <Text style={styles.addMenuHeaderText}>메뉴 추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

    <View style={styles.menuHeader}>
    <TouchableOpacity
  style={styles.addMenuHeaderButton}
  onPress={() => setIsAddModalVisible(true)}
>
  <Icon name="plus" size={16} color="#FF6B35" />
  <Text style={styles.addMenuHeaderText}>메뉴 추가</Text>
</TouchableOpacity>
          </View>
      </ScrollView>

      <EditMenuModal
  visible={isEditModalVisible}
  menu={editingMenu}
  onClose={() => setIsEditModalVisible(false)}
  onSave={handleSave}
/>

    </SafeAreaView>

    
  );
};

// 메뉴 아이템 카드 컴포넌트
const MenuItemCard = ({ menu, onToggleAvailability, onDelete, onEdit }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleMorePress = () => {
    Alert.alert(
      menu.name,
      "어떤 작업을 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "수정", onPress: () => onEdit(menu) },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: () => onDelete(menu.id)
        }
      ]
    );
  };

  return (
    <View style={[
      styles.menuItemCard,
      !menu.isAvailable && styles.menuItemCardDisabled
    ]}>
      <View style={styles.menuItemContent}>
        {/* 메뉴 이미지 */}
        <View style={[
          styles.menuImage,
          !menu.isAvailable && styles.menuImageDisabled
        ]}>
          <Text style={styles.menuEmoji}>{menu.imageUrl}</Text>
          {!menu.isAvailable && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>품절</Text>
            </View>
          )}
        </View>

        {/* 메뉴 정보 */}
        <View style={styles.menuDetails}>
          <View style={styles.menuHeader}>
            <Text style={[
              styles.menuName,
              !menu.isAvailable && styles.menuNameDisabled
            ]}>
              {menu.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{menu.category}</Text>
            </View>
          </View>
          
          <Text style={[
            styles.menuPrice,
            !menu.isAvailable && styles.menuPriceDisabled
          ]}>
            {menu.price.toLocaleString()}원
          </Text>
          
          {/* 메뉴 액션 버튼들 */}
          <View style={styles.menuActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => onEdit(menu)}
            >
              <Icon name="pencil" size={14} color="#666" />
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                menu.isAvailable ? styles.toggleButtonActive : styles.toggleButtonInactive
              ]}
              onPress={() => onToggleAvailability(menu.id)}
            >
              <Icon 
                name={menu.isAvailable ? "check-circle" : "close-circle"} 
                size={14} 
                color={menu.isAvailable ? "#00CC66" : "#FF4444"} 
              />
              <Text style={[
                styles.toggleButtonText,
                menu.isAvailable ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
              ]}>
                {menu.isAvailable ? '판매중' : '품절'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 더보기 버튼 */}
        <TouchableOpacity 
          style={styles.menuMoreButton}
          onPress={handleMorePress}
        >
          <Icon name="dots-vertical" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 헤더 스타일
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addMenuHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  addMenuHeaderText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // 통계 카드 스타일
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 카드 간 간격 균등
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12, // RN 0.71 이상에서만 적용됨. 아니라면 margin으로!
  },
  
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 4,
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },

  // 카테고리 탭 스타일
  categoryTabContainer: {
    backgroundColor: 'white',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTabContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    height: 32, // 명시적으로 고정
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', // 높이 작게 유지
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeCategoryTab: {
    backgroundColor: '#FF6B35',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  activeCategoryTabText: {
    color: 'white',
  },
  categoryCount: {
  paddingHorizontal: 4,
  paddingVertical: 1,
  borderRadius: 8,
  minWidth: 18,
  alignItems: 'center',
  backgroundColor: '#e0e0e0',
},
  activeCategoryCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  activeCategoryCountText: {
    color: 'white',
  },

  // 메뉴 리스트 스타일
  menuList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemCardDisabled: {
    opacity: 0.7,
  },
  menuItemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  
  // 메뉴 이미지 스타일
  menuImage: {
    width: 70,
    height: 70,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  menuImageDisabled: {
    backgroundColor: '#f0f0f0',
  },
  menuEmoji: {
    fontSize: 28,
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // 메뉴 상세 정보 스타일
  menuDetails: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  menuNameDisabled: {
    color: '#999',
  },
  categoryBadge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#4A6FFF',
    fontWeight: '500',
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  menuPriceDisabled: {
    color: '#999',
  },

  // 메뉴 액션 버튼 스타일
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#E6FFF0',
  },
  toggleButtonInactive: {
    backgroundColor: '#FFE6E6',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  toggleButtonTextActive: {
    color: '#00CC66',
  },
  toggleButtonTextInactive: {
    color: '#FF4444',
  },
  menuMoreButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  // 빈 상태 스타일
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addMenuButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addMenuButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MenuScreen;