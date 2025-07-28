import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, Surface, List, Avatar, Portal, Modal } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

moment.locale('id');

export default function AddTransactionScreen({ navigation }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = DataService.getCategories(type);

  const handleSave = async () => {
    const cleanAmount = amount.replace(/\./g, '');
    if (!cleanAmount || parseFloat(cleanAmount) <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Pilih kategori');
      return;
    }

    try {
      setLoading(true);
      
      const transaction = {
        type,
        amount: parseFloat(cleanAmount),
        categoryId: selectedCategory.id,
        description: description.trim(),
        date: date.toISOString(),
      };

      await DataService.addTransaction(transaction);
      
      Alert.alert(
        'Berhasil',
        'Transaksi berhasil ditambahkan',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const renderCategoryItem = (category) => (
    <List.Item
      key={category.id}
      title={category.name}
      left={() => (
        <Avatar.Icon
          size={40}
          icon={category.icon}
          style={{ backgroundColor: category.color }}
        />
      )}
      right={() => 
        selectedCategory?.id === category.id && 
        <Icon name="check" size={24} color={theme.colors.primary} />
      }
      onPress={() => {
        setSelectedCategory(category);
        setShowCategoryModal(false);
      }}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <SegmentedButtons
          value={type}
          onValueChange={value => {
            setType(value);
            setSelectedCategory(null);
          }}
          buttons={[
            {
              value: 'expense',
              label: 'Pengeluaran',
              icon: 'arrow-up-circle',
            },
            {
              value: 'income',
              label: 'Pemasukan',
              icon: 'arrow-down-circle',
            },
          ]}
          style={styles.segmentedButton}
        />

        <TextInput
          label="Jumlah"
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Affix text="Rp" />}
          style={styles.input}
          theme={{ colors: { primary: type === 'income' ? theme.colors.income : theme.colors.expense }}}
        />

        <TouchableOpacity onPress={() => setShowCategoryModal(true)}>
          <TextInput
            label="Kategori"
            value={selectedCategory?.name || ''}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
            style={styles.input}
          />
        </TouchableOpacity>

        <TextInput
          label="Keterangan (opsional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label="Tanggal"
            value={moment(date).format('DD MMMM YYYY')}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="calendar" />}
            style={styles.input}
          />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.saveButton]}
          >
            Simpan
          </Button>
        </View>
      </Surface>

      <DatePicker
        modal
        open={showDatePicker}
        date={date}
        mode="date"
        maximumDate={new Date()}
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          setDate(selectedDate);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        title="Pilih Tanggal"
        confirmText="Pilih"
        cancelText="Batal"
      />

      <Portal>
        <Modal
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Pilih Kategori</Text>
          <ScrollView style={styles.categoryList}>
            {categories.map(renderCategoryItem)}
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    margin: 20,
    padding: 20,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  segmentedButton: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: theme.roundness,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 20,
    paddingBottom: 10,
  },
  categoryList: {
    maxHeight: 400,
  },
});