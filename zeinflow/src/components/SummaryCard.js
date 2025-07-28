import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SummaryCard = ({ title, amount, icon, color, subtitle }) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;

  return (
    <Card style={[styles.card, { backgroundColor: cardColor }]}>
      <Card.Content>
        <View style={styles.header}>
          <Icon name={icon} size={32} color="#FFF" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.amount}>${Math.abs(amount).toFixed(2)}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  amount: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
});

export default SummaryCard;