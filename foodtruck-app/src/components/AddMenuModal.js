import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const AddMenuModal = ({
  visible,
  onClose,
  onSave,
  newMenu,
  setNewMenu,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>메뉴 추가</Text>

          <TextInput
            placeholder="이름"
            style={styles.input}
            value={newMenu.name}
            onChangeText={(text) => setNewMenu({ ...newMenu, name: text })}
          />
          <TextInput
            placeholder="가격"
            keyboardType="numeric"
            style={styles.input}
            value={newMenu.price.toString()}
            onChangeText={(text) => setNewMenu({ ...newMenu, price: parseInt(text) || 0 })}
          />
          <TextInput
            placeholder="카테고리"
            style={styles.input}
            value={newMenu.category}
            onChangeText={(text) => setNewMenu({ ...newMenu, category: text })}
          />
          <TextInput
            placeholder="이미지 URL"
            style={styles.input}
            value={newMenu.imageUrl}
            onChangeText={(text) => setNewMenu({ ...newMenu, imageUrl: text })}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMenuModal;

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      width: '100%',
      maxWidth: 400,
      padding: 28,
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 24,
      textAlign: 'center',
      color: '#1F2937',
      letterSpacing: -0.5,
    },
    input: {
      backgroundColor: '#F9FAFB',
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      marginBottom: 16,
      color: '#374151',
      fontWeight: '500',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 28,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    cancelButtonText: {
      color: '#6B7280',
      fontSize: 16,
      fontWeight: '600',
    },
    saveButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: '#FF6B35',
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#FF6B35',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });