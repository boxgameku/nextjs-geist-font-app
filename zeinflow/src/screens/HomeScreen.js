import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, FAB, Card, List, Avatar, IconButton, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';
import { useAuth } from '../utils/AuthContext';

moment.locale('id');

export default function HomeScreen({ navigation }) {
  const { userData } = useAuth();
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      await DataService.initialize();
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthStats = DataService.getMonthlyStatistics(currentYear, currentMonth);
      
      setBalance(DataService.getBalance());
      setIncome(monthStats.income);
      setExpense(monthStats.expense);
      setRecentTransactions(DataService.getTransactions().slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const renderTransaction = (transaction) => {
    const category = DataService.getCategoryById(transaction.categoryId);
    
    return (
      <List.Item
        key={transaction.id}
        title={category?.name || 'Unknown'}
        description={`${moment(transaction.date).format('DD MMM YYYY')} • ${transaction.description || 'No description'}`}
        left={() => (
          <Avatar.Icon
            size={40}
            icon={category?.icon || 'help'}
            style={{ backgroundColor: category?.color || theme.colors.primary }}
          />
        )}
        right={() => (
          <Text style={[
            styles.amount,
            { color: transaction.type === 'income' ? theme.colors.income : theme.colors.expense }
          ]}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        )}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          </View>
          
          <Card style={styles.balanceCard}>
            <Card.Content>
              <Text style={styles.balanceLabel}>Saldo Total</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
              
              <View style={styles.monthlyStats}>
                <View style={styles.statItem}>
                  <Icon name="arrow-down-circle" size={24} color={theme.colors.income} />
                  <View style={styles.statText}>
                    <Text style={styles.statLabel}>Pemasukan</Text>
                    <Text style={[styles.statAmount, { color: theme.colors.income }]}>
                      {formatCurrency(income)}
                    </Text>
                  </View>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.statItem}>
                  <Icon name="arrow-up-circle" size={24} color={theme.colors.expense} />
                  <View style={styles.statText}>
                    <Text style={styles.statLabel}>Pengeluaran</Text>
                    <Text style={[styles.statAmount, { color: theme.colors.expense }]}>
                      {formatCurrency(expense)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Surface>
        
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
            <IconButton
              icon="arrow-right"
              size={20}
              onPress={() => navigation.navigate('Transactions')}
            />
          </View>
          
          {recentTransactions.length > 0 ? (
            <Surface style={styles.transactionList}>
              {recentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  {renderTransaction(transaction)}
                  {index < recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Surface>
          ) : (
            <Surface style={styles.emptyState}>
              <Icon name="receipt-text-outline" size={48} color={theme.colors.placeholder} />
              <Text style={styles.emptyText}>Belum ada transaksi</Text>
              <Text style={styles.emptySubtext}>Tap tombol + untuk menambah transaksi</Text>
            </Surface>
          )}
        </View>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTransaction')}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: theme.roundness,
  },
  balanceLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  transactionList: {
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
});