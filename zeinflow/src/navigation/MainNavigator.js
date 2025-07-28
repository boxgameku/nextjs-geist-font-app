import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import TransactionScreen from '../screens/TransactionScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import { theme } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'ZeinFlow' }} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Tambah Transaksi' }} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Detail Transaksi' }} />
    </Stack.Navigator>
  );
}

function TransactionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="TransactionMain" component={TransactionScreen} options={{ title: 'Transaksi' }} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Detail Transaksi' }} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} options={{ title: 'Kategori' }} />
    </Stack.Navigator>
  );
}

function ReportsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="ReportsMain" component={ReportsScreen} options={{ title: 'Laporan' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'shape' : 'shape-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Transactions" component={TransactionStack} options={{ title: 'Transaksi' }} />
      <Tab.Screen name="Categories" component={CategoriesStack} options={{ title: 'Kategori' }} />
      <Tab.Screen name="Reports" component={ReportsStack} options={{ title: 'Laporan' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}