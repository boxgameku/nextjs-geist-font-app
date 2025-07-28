import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Surface, List, Avatar, FAB, Portal, Modal, TextInput, Button, IconButton, SegmentedButtons, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

const ICON_OPTIONS = [
  'cash', 'gift', 'trending-up', 'bank', 'wallet', 'piggy-bank',
  'food', 'car', 'shopping', 'receipt', 'hospital', 'school',
  'gamepad-variant', 'home', 'airplane', 'coffee', 'heart',
  'book', 'music', 'movie', 'dumbbell', 'basketball',
];

const COLOR_OPTIONS = [
  '#27AE60', '#2ECC71', '#16A085', '#1ABC9C',
  '#E74C3C', '#C0392B', '#D35400', '#E67E22',
  '#8E44AD', '#9B59B6', '#3498DB', '#2980B9',
  '#34495E', '#2C3E50', '#F39C12', '#F1C40F',
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('expense');
  const [selectedIcon, setSelectedIcon] = useState('dots-horizontal');
  const [selectedColor, setSelectedColor] = useState('#3498DB');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const loadCategories = async () => {
    try {
      await DataService.initialize();
      setCategories(DataService.getCategories());
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryType('expense');
    setSelectedIcon('dots-horizontal');
    setSelectedColor('#3498DB');
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryType(category.type);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Nama kategori tidak boleh kosong');
      return;
    }

    try {
      if (editingCategory) {
        await DataService.updateCategory(editingCategory.id, {
          name: categoryName.trim(),
          type: categoryType,
          icon: selectedIcon,
          color: selectedColor,
        });
      } else {
        await DataService.addCategory({
          name: categoryName.trim(),
          type: categoryType,
          icon: selectedIcon,
          color: selectedColor,
        });
      }
      
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Gagal menyimpan kategori');
    }
  };

  const handleDeleteCategory = (category) => {
    Alert.alert(
      'Hapus Kategori',
      `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.deleteCategory(category.id);
              loadCategories();
            } catch (error) {
              if (error.message === 'Category is being used in transactions') {
                Alert.alert('Error', 'Kategori ini sedang digunakan dalam transaksi dan tidak dapat dihapus');
              } else {
                Alert.alert('Error', 'Gagal menghapus kategori');
              }
            }
          },
        },
      ]
    );
  };

  const renderCategory = (category) => {
    const isDefault = parseInt(category.id) <= 12; // Default categories have IDs 1-12
    
    return (
      <List.Item
        key={category.id}
        title={category.name}
        description={category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
        left={() => (
          <Avatar.Icon
            size={40}
            icon={category.icon}
            style={{ backgroundColor: category.color }}
          />
        )}
        right={() => !isDefault && (
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEditCategory(category)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteCategory(category)}
            />
          </View>
        )}
        disabled={isDefault}
      />
    );
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Pemasukan</Text>
          {incomeCategories.map(renderCategory)}
        </Surface>

        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Pengeluaran</Text>
          {expenseCategories.map(renderCategory)}
        </Surface>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddCategory}
        color="white"
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>
            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
          </Text>

          <TextInput
            label="Nama Kategori"
            value={categoryName}
            onChangeText={setCategoryName}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={categoryType}
            onValueChange={setCategoryType}
            buttons={[
              { value: 'expense', label: 'Pengeluaran' },
              { value: 'income', label: 'Pemasukan' },
            ]}
            style={styles.segmentedButton}
          />

          <View style={styles.iconColorRow}>
            <Button
              mode="outlined"
              onPress={() => setShowIconPicker(true)}
              icon={selectedIcon}
              style={styles.iconButton}
            >
              Pilih Ikon
            </Button>

            <Button
              mode="outlined"
              onPress={() => setShowColorPicker(true)}
              style={[styles.colorButton, { borderColor: selectedColor }]}
            >
              <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
            </Button>
          </View>

          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setShowModal(false)}>
              Batal
            </Button>
            <Button mode="contained" onPress={handleSaveCategory}>
              Simpan
            </Button>
          </View>
        </Modal>

        <Modal
          visible={showIconPicker}
          onDismiss={() => setShowIconPicker(false)}
          contentContainerStyle={styles.pickerModal}
        >
          <Text style={styles.pickerTitle}>Pilih Ikon</Text>
          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map(icon => (
              <IconButton
                key={icon}
                icon={icon}
                size={30}
                selected={selectedIcon === icon}
                onPress={() => {
                  setSelectedIcon(icon);
                  setShowIconPicker(false);
                }}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.selectedIcon,
                ]}
              />
            ))}
          </View>
        </Modal>

        <Modal
          visible={showColorPicker}
          onDismiss={() => setShowColorPicker(false)}
          contentContainerStyle={styles.pickerModal}
        >
          <Text style={styles.pickerTitle}>Pilih Warna</Text>
          <View style={styles.colorGrid}>
            {COLOR_OPTIONS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
              />
            ))}
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: theme.roundness,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  segmentedButton: {
    marginBottom: 20,
  },
  iconColorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    flex: 1,
    marginRight: 10,
  },
  colorButton: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  colorPreview: {
    width: 40,
    height: 20,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerModal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: theme.roundness,
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconOption: {
    margin: 5,
  },
  selectedIcon: {
    backgroundColor: theme.colors.accent,
    borderRadius: 25,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorOption: {
    width: 50,
    height: 50,
    margin: 10,
    borderRadius: 25,
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
});