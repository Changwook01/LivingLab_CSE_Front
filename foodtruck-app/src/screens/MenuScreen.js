import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StatusBarHeader from '../components/StatusBarHeader';
import { menuService } from '../services/menuService';
import EditMenuModal from '../components/EditMenuModal';
import AddMenuModal from '../components/AddMenuModal'; 
import { useAppStore } from '../stores/useAppStore'; // ✅ Zustand 스토어 import

const MenuScreen = () => {
  // ✅ 1. 로그인 시 스토어에 저장된 메뉴 데이터를 가져옵니다.
  const menusFromStore = useAppStore((state) => state.menus);

  const [activeCategory, setActiveCategory] = useState('전체');
  // ✅ 2. 가져온 스토어 데이터로 화면의 상태를 초기화합니다.
  const [menuData, setMenuData] = useState(menusFromStore || []);
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

  // ❗ 3. 불필요한 useEffect API 호출을 완전히 삭제했습니다.

  const handleSave = async (updatedMenu) => {
    console.log('📦 업데이트할 메뉴:', updatedMenu);
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

  const categories = ['전체', ...new Set(menuData.map(menu => menu.category))];
  
  const filteredMenus = activeCategory === '전체' 
    ? menuData 
    : menuData.filter(menu => menu.category === activeCategory);

  const getCategoryCount = (category) => {
    if (category === '전체') return menuData.length;
    return menuData.filter(menu => menu.category === category).length;
  };

  const toggleMenuAvailability = (menuId) => {
    // 참고: 이 로직은 화면상에서만 바꾸므로, 실제 서버 데이터 변경을 위해서는 menuService 호출이 필요합니다.
    setMenuData(prevData => 
      prevData.map(menu => 
        menu.id === menuId 
          ? { ...menu, available: !menu.available } // 'isAvailable' -> 'available'로 수정
          : menu
      )
    );
  };

  const deleteMenu = (menuId) => {
    Alert.alert(
      "메뉴 삭제",
      "정말로 이 메뉴를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: async () => {
            // 참고: 실제 서버 데이터 삭제를 위해서는 menuService 호출이 필요합니다.
            // await menuService.deleteMenu(menuId); 
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

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{menuData.length}</Text>
          <Text style={styles.statLabel}>전체 메뉴</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#00CC66' }]}>
            {menuData.filter(m => m.available).length}
          </Text>
          <Text style={styles.statLabel}>판매중</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#FF4444' }]}>
            {menuData.filter(m => !m.available).length}
          </Text>
          <Text style={styles.statLabel}>품절</Text>
        </View>
      </View>

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
            style={[styles.categoryTab, activeCategory === category && styles.activeCategoryTab]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[styles.categoryTabText, activeCategory === category && styles.activeCategoryTabText]}>
              {category}
            </Text>
            <View style={[styles.categoryCount, activeCategory === category && styles.activeCategoryCount]}>
              <Text style={[styles.categoryCountText, activeCategory === category && styles.activeCategoryCountText]}>
                {getCategoryCount(category)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <View style={styles.menuHeader}>
        <Text style={styles.menuHeaderTitle}>메뉴 목록</Text>
        <TouchableOpacity style={styles.addMenuHeaderButton} onPress={() => setIsAddModalVisible(true)}>
          <Icon name="plus" size={16} color="#FF6B35" />
          <Text style={styles.addMenuHeaderText}>메뉴 추가</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.emptyText}>표시할 메뉴가 없습니다.</Text>
          </View>
        )}
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

const MenuItemCard = ({ menu, onToggleAvailability, onDelete, onEdit }) => {
  return (
    <View style={[styles.menuItemCard, !menu.available && styles.menuItemCardDisabled]}>
      <View style={styles.menuItemContent}>
        <View style={[styles.menuImage, !menu.available && styles.menuImageDisabled]}>
          <Text style={styles.menuEmoji}>🍔</Text>
          {!menu.available && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>품절</Text>
            </View>
          )}
        </View>
        <View style={styles.menuDetails}>
          <View style={styles.menuHeaderRow}>
            <Text style={[styles.menuName, !menu.available && styles.menuNameDisabled]}>
              {menu.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{menu.category}</Text>
            </View>
          </View>
          <Text style={[styles.menuPrice, !menu.available && styles.menuPriceDisabled]}>
            {menu.price.toLocaleString()}원
          </Text>
          <View style={styles.menuActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(menu)}>
              <Icon name="pencil" size={14} color="#666" />
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, menu.available ? styles.toggleButtonActive : styles.toggleButtonInactive]}
              onPress={() => onToggleAvailability(menu.id)}
            >
              <Icon 
                name={menu.available ? "check-circle" : "close-circle"} 
                size={14} 
                color={menu.available ? "#00CC66" : "#FF4444"} 
              />
              <Text style={[styles.toggleButtonText, menu.available ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive]}>
                {menu.available ? '판매중' : '품절'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.menuMoreButton} onPress={() => onDelete(menu.id)}>
          <Icon name="trash-can-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  menuHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 10, paddingTop: 16, backgroundColor: 'white'
  },
  menuHeaderTitle: { fontSize: 20, fontWeight: 'bold' },
  addMenuHeaderButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: '#FF6B35',
  },
  addMenuHeaderText: { color: '#FF6B35', fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16,
    paddingHorizontal: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  statCard: { flex: 1, alignItems: 'center', backgroundColor: '#FAFAFA', paddingVertical: 12, borderRadius: 12, marginHorizontal: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#888' },
  categoryTabContainer: { backgroundColor: 'white', height: 60, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  categoryTabContent: { paddingHorizontal: 16, alignItems: 'center' },
  categoryTab: {
    paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderRadius: 18,
    backgroundColor: '#f5f5f5', flexDirection: 'row', alignItems: 'center'
  },
  activeCategoryTab: { backgroundColor: '#FF6B35' },
  categoryTabText: { fontSize: 14, fontWeight: '500', color: '#666', marginRight: 6 },
  activeCategoryTabText: { color: 'white' },
  categoryCount: {
    backgroundColor: '#e0e0e0', borderRadius: 8, minWidth: 18,
    paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center'
  },
  activeCategoryCount: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  categoryCountText: { fontSize: 11, fontWeight: 'bold', color: '#666' },
  activeCategoryCountText: { color: 'white' },
  menuList: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#888' },
  menuItemCard: {
    backgroundColor: 'white', borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  menuItemCardDisabled: { opacity: 0.6 },
  menuItemContent: { flexDirection: 'row', padding: 12 },
  menuImage: {
    width: 70, height: 70, backgroundColor: '#f8f9fa', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 16, position: 'relative'
  },
  menuImageDisabled: { backgroundColor: '#f0f0f0' },
  menuEmoji: { fontSize: 28 },
  soldOutOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center'
  },
  soldOutText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  menuDetails: { flex: 1, justifyContent: 'center' },
  menuHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  menuName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  menuNameDisabled: { color: '#999', textDecorationLine: 'line-through' },
  categoryBadge: { backgroundColor: '#E6F0FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  categoryBadgeText: { fontSize: 10, color: '#4A6FFF', fontWeight: '500' },
  menuPrice: { fontSize: 15, fontWeight: '600', color: '#FF6B35', marginBottom: 8 },
  menuPriceDisabled: { color: '#999' },
  menuActions: { flexDirection: 'row', gap: 8 },
  editButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16
  },
  editButtonText: { fontSize: 12, color: '#666', fontWeight: '500', marginLeft: 4 },
  toggleButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
    paddingVertical: 6, borderRadius: 16
  },
  toggleButtonActive: { backgroundColor: '#dcfce7' },
  toggleButtonInactive: { backgroundColor: '#fee2e2' },
  toggleButtonText: { fontSize: 12, fontWeight: '500', marginLeft: 4 },
  toggleButtonTextActive: { color: '#16a34a' },
  toggleButtonTextInactive: { color: '#ef4444' },
  menuMoreButton: { justifyContent: 'flex-start', padding: 4 },
});