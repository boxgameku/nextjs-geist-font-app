import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Surface, List, Avatar, Divider, Chip, FAB, Searchbar, Menu, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

moment.locale('id');

export default function TransactionScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(null); // null, 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [groupedTransactions, setGroupedTransactions] = useState({});

  const loadTransactions = async () => {
    try {
      await DataService.initialize();
      const allTransactions = DataService.getTransactions();
      setTransactions(allTransactions);
      applyFilters(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const applyFilters = (transactionList) => {
    let filtered = [...transactionList];

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(t => t.categoryId === filterCategory.id);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => {
        const category = DataService.getCategoryById(t.categoryId);
        return (
          category?.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
        );
      });
    }

    // Group by date
    const grouped = {};
    filtered.forEach(transaction => {
      const dateKey = moment(transaction.date).format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    setFilteredTransactions(filtered);
    setGroupedTransactions(grouped);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    applyFilters(transactions);
  };

  const clearFilters = () => {
    setFilterType(null);
    setFilterCategory(null);
    setSearchQuery('');
    applyFilters(transactions);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderTransaction = ({ item }) => {
    const category = DataService.getCategoryById(item.categoryId);
    
    return (
      <List.Item
        title={category?.name || 'Unknown'}
        description={item.description || 'Tidak ada keterangan'}
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
            { color: item.type === 'income' ? theme.colors.income : theme.colors.expense }
          ]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
        )}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
      />
    );
  };

  const renderDateSection = ({ section }) => {
    const date = moment(section.title);
    const isToday = date.isSame(moment(), 'day');
    const isYesterday = date.isSame(moment().subtract(1, 'day'), 'day');
    
    let dateText;
    if (isToday) {
      dateText = 'Hari ini';
    } else if (isYesterday) {
      dateText = 'Kemarin';
    } else {
      dateText = date.format('DD MMMM YYYY');
    }

    const dayTotal = section.data.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    return (
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{dateText}</Text>
        <Text style={[
          styles.dayTotal,
          { color: dayTotal >= 0 ? theme.colors.income : theme.colors.expense }
        ]}>
          {formatCurrency(Math.abs(dayTotal))}
        </Text>
      </View>
    );
  };

  const sections = Object.keys(groupedTransactions)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({
      title: date,
      data: groupedTransactions[date],
    }));

  return (
    <View style={styles.container}>
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari transaksi..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={showFilterMenu}
          onDismiss={() => setShowFilterMenu(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              size={24}
              onPress={() => setShowFilterMenu(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setFilterType('income');
              setShowFilterMenu(false);
              applyFilters(transactions);
            }}
            title="Pemasukan"
            leadingIcon="arrow-down-circle"
          />
          <Menu.Item
            onPress={() => {
              setFilterType('expense');
              setShowFilterMenu(false);
              applyFilters(transactions);
            }}
            title="Pengeluaran"
            leadingIcon="arrow-up-circle"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              clearFilters();
              setShowFilterMenu(false);
            }}
            title="Hapus Filter"
            leadingIcon="close"
          />
        </Menu>
      </Surface>

      {(filterType || filterCategory) && (
        <View style={styles.filterChips}>
          {filterType && (
            <Chip
              mode="flat"
              onClose={() => {
                setFilterType(null);
                applyFilters(transactions);
              }}
              style={styles.filterChip}
            >
              {filterType === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </Chip>
          )}
          {filterCategory && (
            <Chip
              mode="flat"
              onClose={() => {
                setFilterCategory(null);
                applyFilters(transactions);
              }}
              style={styles.filterChip}
            >
              {filterCategory.name}
            </Chip>
          )}
        </View>
      )}

      {filteredTransactions.length > 0 ? (
        <FlatList
          sections={sections}
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="receipt-text-outline" size={64} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>Tidak ada transaksi</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || filterType || filterCategory
              ? 'Coba ubah filter pencarian'
              : 'Tap tombol + untuk menambah transaksi'}
          </Text>
        </View>
      )}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  filterChips: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  filterChip: {
    marginRight: 10,
  },
  listContent: {
    paddingBottom: 80,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.background,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  dayTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 5,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
});