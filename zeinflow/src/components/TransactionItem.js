import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const TransactionItem = ({ transaction, onPress, categoryIcon }) => {
  const theme = useTheme();
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.success : theme.colors.error;

  return (
    <TouchableOpacity onPress={() => onPress(transaction)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.container}>
            <View style={styles.leftContent}>
              <View style={styles.iconContainer}>
                <Icon 
                  name={categoryIcon || (isIncome ? 'cash-plus' : 'cash-minus')} 
                  size={24} 
                  color={amountColor} 
                />
              </View>
              <View style={styles.details}>
                <Text style={styles.category}>{transaction.category}</Text>
                <Text style={styles.description} numberOfLines={1}>
                  {transaction.description}
                </Text>
                <Text style={styles.date}>
                  {moment(transaction.date).format('MMM DD, YYYY')}
                </Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <Text style={[styles.amount, { color: amountColor }]}>
                {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightContent: {
    marginLeft: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionItem;