import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, Text, Surface, ActivityIndicator } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../utils/AuthContext';
import GoogleDriveService from '../services/GoogleDriveService';
import { theme } from '../constants/theme';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleSignIn(response.authentication);
    }
  }, [response]);

  const handleSignIn = async (authentication) => {
    try {
      setLoading(true);
      
      // Save tokens to Google Drive Service
      await GoogleDriveService.saveTokens(authentication);
      
      // Get user info
      const userInfo = await GoogleDriveService.getUserInfo();
      
      // Sign in the user
      await signIn(authentication.accessToken, userInfo);
      
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>ZeinFlow</Text>
        <Text style={styles.subtitle}>Kelola keuangan Anda dengan mudah</Text>
        
        <View style={styles.features}>
          <Text style={styles.featureText}>✓ Catat pemasukan dan pengeluaran</Text>
          <Text style={styles.featureText}>✓ Kategori yang dapat disesuaikan</Text>
          <Text style={styles.featureText}>✓ Laporan keuangan terperinci</Text>
          <Text style={styles.featureText}>✓ Sinkronisasi dengan Google Drive</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          <Button
            mode="contained"
            onPress={() => promptAsync()}
            disabled={!request}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="google"
          >
            Masuk dengan Google
          </Button>
        )}
        
        <Text style={styles.disclaimer}>
          Data Anda akan disimpan dengan aman di Google Drive
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 30,
    borderRadius: theme.roundness,
    elevation: 4,
    backgroundColor: theme.colors.surface,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.placeholder,
    marginBottom: 30,
  },
  features: {
    marginBottom: 30,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loader: {
    marginTop: 20,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.colors.placeholder,
    marginTop: 20,
  },
});