import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, Surface, List, Button, Avatar, Divider, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../utils/AuthContext';
import GoogleDriveService from '../services/GoogleDriveService';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

export default function ProfileScreen() {
  const { userData, signOut } = useAuth();
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleSyncData = async () => {
    try {
      setLoading(true);
      await DataService.saveToGoogleDrive();
      Alert.alert('Berhasil', 'Data berhasil disinkronkan ke Google Drive');
    } catch (error) {
      console.error('Error syncing data:', error);
      Alert.alert('Error', 'Gagal menyinkronkan data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      'Export Data',
      'Fitur export data akan segera tersedia',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Tentang ZeinFlow',
      'ZeinFlow v1.0.0\n\nAplikasi manajemen keuangan yang terintegrasi dengan Google Drive untuk menyimpan data Anda dengan aman.\n\nDikembangkan dengan ❤️',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.profileSection}>
        <Avatar.Image
          size={80}
          source={{ uri: userData?.picture || 'https://via.placeholder.com/150' }}
        />
        <Text style={styles.userName}>{userData?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{userData?.email || 'email@example.com'}</Text>
      </Surface>

      <Surface style={styles.section}>
        <List.Item
          title="Sinkronisasi Otomatis"
          description="Sinkronkan data ke Google Drive"
          left={() => <List.Icon icon="cloud-sync" />}
          right={() => (
            <Switch
              value={syncEnabled}
              onValueChange={setSyncEnabled}
              color={theme.colors.primary}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Sinkronkan Sekarang"
          description="Backup data manual ke Google Drive"
          left={() => <List.Icon icon="cloud-upload" />}
          onPress={handleSyncData}
          disabled={loading}
        />
        <Divider />
        <List.Item
          title="Export Data"
          description="Export data ke format CSV"
          left={() => <List.Icon icon="file-export" />}
          onPress={handleExportData}
        />
      </Surface>

      <Surface style={styles.section}>
        <List.Item
          title="Tentang"
          description="Informasi aplikasi"
          left={() => <List.Icon icon="information" />}
          onPress={handleAbout}
        />
        <Divider />
        <List.Item
          title="Bantuan"
          description="Panduan penggunaan"
          left={() => <List.Icon icon="help-circle" />}
          onPress={() => Alert.alert('Bantuan', 'Panduan penggunaan akan segera tersedia')}
        />
        <Divider />
        <List.Item
          title="Kebijakan Privasi"
          description="Baca kebijakan privasi kami"
          left={() => <List.Icon icon="shield-check" />}
          onPress={() => Alert.alert('Kebijakan Privasi', 'Data Anda disimpan dengan aman di Google Drive dan tidak dibagikan ke pihak ketiga')}
        />
      </Surface>

      <View style={styles.signOutContainer}>
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.signOutButton}
          contentStyle={styles.signOutButtonContent}
          icon="logout"
        >
          Keluar
        </Button>
      </View>

      <Text style={styles.version}>Versi 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    margin: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 5,
  },
  section: {
    margin: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  signOutContainer: {
    margin: 20,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
  },
  signOutButtonContent: {
    paddingVertical: 8,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    fontSize: 12,
    marginBottom: 20,
  },
});