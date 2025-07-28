import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Button, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryPicker = ({ visible, onDismiss, onSelect, categories, selectedCategory }) => {
  const theme = useTheme();

  const renderCategory = (category) => {
    const isSelected = selectedCategory?.id === category.id;
    
    return (
      <TouchableOpacity
        key={category.id}
        onPress={() => {
          onSelect(category);
          onDismiss();
        }}
      >
        <Card style={[
          styles.categoryCard,
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 }
        ]}>
          <Card.Content style={styles.categoryContent}>
            <Icon
              name={category.icon || 'tag'}
              size={24}
              color={category.color || theme.colors.primary}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
            {isSelected && (
              <Icon
                name="check-circle"
                size={20}
                color={theme.colors.primary}
                style={styles.checkIcon}
              />
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.title}>Select Category</Text>
        <ScrollView style={styles.scrollView}>
          {categories.map(renderCategory)}
        </ScrollView>
        <Button
          mode="text"
          onPress={onDismiss}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  scrollView: {
    maxHeight: 400,
  },
  categoryCard: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryName: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  cancelButton: {
    margin: 16,
  },
});

export default CategoryPicker;