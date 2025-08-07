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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#777',
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
