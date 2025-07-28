import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, Card, Button, Avatar, Divider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

moment.locale('id');

export default function TransactionDetailScreen({ route, navigation }) {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      await DataService.initialize();
      const trans = DataService.getTransactionById(transactionId);
      if (trans) {
        setTransaction(trans);
        const cat = DataService.getCategoryById(trans.categoryId);
        setCategory(cat);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.deleteTransaction(transactionId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Gagal menghapus transaksi');
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!transaction || !category) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Avatar.Icon
          size={80}
          icon={category.icon}
          style={{ backgroundColor: category.color }}
        />
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={[
          styles.amount,
          { color: transaction.type === 'income' ? theme.colors.income : theme.colors.expense }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </Surface>

      <Card style={styles.detailCard}>
        <Card.Content>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={theme.colors.placeholder} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tanggal</Text>
              <Text style={styles.detailValue}>
                {moment(transaction.date).format('dddd, DD MMMM YYYY')}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Icon name="tag" size={20} color={theme.colors.placeholder} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Jenis</Text>
              <Text style={styles.detailValue}>
                {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </Text>
            </View>
          </View>

          {transaction.description && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Icon name="text" size={20} color={theme.colors.placeholder} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Keterangan</Text>
                  <Text style={styles.detailValue}>{transaction.description}</Text>
                </View>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={20} color={theme.colors.placeholder} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Dibuat pada</Text>
              <Text style={styles.detailValue}>
                {moment(transaction.createdAt).format('DD MMM YYYY, HH:mm')}
              </Text>
            </View>
          </View>

          {transaction.updatedAt !== transaction.createdAt && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Icon name="update" size={20} color={theme.colors.placeholder} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Terakhir diubah</Text>
                  <Text style={styles.detailValue}>
                    {moment(transaction.updatedAt).format('DD MMM YYYY, HH:mm')}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.deleteButton}
          textColor={theme.colors.error}
          icon="delete"
        >
          Hapus
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailCard: {
    margin: 20,
    borderRadius: theme.roundness,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  divider: {
    marginVertical: 10,
  },
  actions: {
    margin: 20,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});