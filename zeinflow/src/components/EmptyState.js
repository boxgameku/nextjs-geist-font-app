import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../constants/theme';

const EmptyState = ({ 
  icon = 'folder-open-outline', 
  title = 'No Data', 
  message = 'No items to display',
  actionLabel,
  onAction 
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={80} color={theme.colors.disabled} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.text,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.placeholder,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});

export default EmptyState;