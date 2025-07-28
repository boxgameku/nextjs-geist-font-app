import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleDriveService from './GoogleDriveService';

class DataService {
  constructor() {
    this.transactions = [];
    this.categories = [];
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load data from Google Drive
      await GoogleDriveService.loadTokens();
      
      if (GoogleDriveService.accessToken) {
        const transactionsData = await GoogleDriveService.loadData('transactions.json');
        const categoriesData = await GoogleDriveService.loadData('categories.json');
        
        if (transactionsData) {
          this.transactions = transactionsData.transactions || [];
        }
        
        if (categoriesData) {
          this.categories = categoriesData.categories || [];
        } else {
          // Initialize with default categories
          this.categories = this.getDefaultCategories();
          await this.saveCategories();
        }
      } else {
        // Load from local storage as fallback
        const localTransactions = await AsyncStorage.getItem('transactions');
        const localCategories = await AsyncStorage.getItem('categories');
        
        if (localTransactions) {
          this.transactions = JSON.parse(localTransactions);
        }
        
        if (localCategories) {
          this.categories = JSON.parse(localCategories);
        } else {
          this.categories = this.getDefaultCategories();
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing data service:', error);
      // Fallback to local storage
      await this.loadFromLocalStorage();
    }
  }

  async loadFromLocalStorage() {
    try {
      const localTransactions = await AsyncStorage.getItem('transactions');
      const localCategories = await AsyncStorage.getItem('categories');
      
      if (localTransactions) {
        this.transactions = JSON.parse(localTransactions);
      }
      
      if (localCategories) {
        this.categories = JSON.parse(localCategories);
      } else {
        this.categories = this.getDefaultCategories();
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  }

  getDefaultCategories() {
    return [
      // Income categories
      { id: '1', name: 'Gaji', type: 'income', icon: 'cash', color: '#27AE60' },
      { id: '2', name: 'Bonus', type: 'income', icon: 'gift', color: '#2ECC71' },
      { id: '3', name: 'Investasi', type: 'income', icon: 'trending-up', color: '#16A085' },
      { id: '4', name: 'Lainnya', type: 'income', icon: 'dots-horizontal', color: '#1ABC9C' },
      
      // Expense categories
      { id: '5', name: 'Makanan', type: 'expense', icon: 'food', color: '#E74C3C' },
      { id: '6', name: 'Transportasi', type: 'expense', icon: 'car', color: '#C0392B' },
      { id: '7', name: 'Belanja', type: 'expense', icon: 'shopping', color: '#D35400' },
      { id: '8', name: 'Tagihan', type: 'expense', icon: 'receipt', color: '#E67E22' },
      { id: '9', name: 'Kesehatan', type: 'expense', icon: 'hospital', color: '#8E44AD' },
      { id: '10', name: 'Pendidikan', type: 'expense', icon: 'school', color: '#9B59B6' },
      { id: '11', name: 'Hiburan', type: 'expense', icon: 'gamepad-variant', color: '#3498DB' },
      { id: '12', name: 'Lainnya', type: 'expense', icon: 'dots-horizontal', color: '#2980B9' },
    ];
  }

  async saveToGoogleDrive() {
    try {
      if (GoogleDriveService.accessToken) {
        await GoogleDriveService.saveData('transactions.json', { transactions: this.transactions });
        await GoogleDriveService.saveData('categories.json', { categories: this.categories });
      }
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
    }
  }

  async saveToLocalStorage() {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(this.transactions));
      await AsyncStorage.setItem('categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  async saveData() {
    await this.saveToLocalStorage();
    await this.saveToGoogleDrive();
  }

  // Transaction methods
  async addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.transactions.unshift(newTransaction);
    await this.saveData();
    return newTransaction;
  }

  async updateTransaction(id, updates) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await this.saveData();
      return this.transactions[index];
    }
    return null;
  }

  async deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    await this.saveData();
  }

  getTransactions(filters = {}) {
    let filtered = [...this.transactions];
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.categoryId) {
      filtered = filtered.filter(t => t.categoryId === filters.categoryId);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTransactionById(id) {
    return this.transactions.find(t => t.id === id);
  }

  // Category methods
  async addCategory(category) {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.categories.push(newCategory);
    await this.saveCategories();
    return newCategory;
  }

  async updateCategory(id, updates) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await this.saveCategories();
      return this.categories[index];
    }
    return null;
  }

  async deleteCategory(id) {
    // Check if category is used in any transaction
    const isUsed = this.transactions.some(t => t.categoryId === id);
    if (isUsed) {
      throw new Error('Category is being used in transactions');
    }
    
    this.categories = this.categories.filter(c => c.id !== id);
    await this.saveCategories();
  }

  async saveCategories() {
    await AsyncStorage.setItem('categories', JSON.stringify(this.categories));
    if (GoogleDriveService.accessToken) {
      await GoogleDriveService.saveData('categories.json', { categories: this.categories });
    }
  }

  getCategories(type = null) {
    if (type) {
      return this.categories.filter(c => c.type === type);
    }
    return this.categories;
  }

  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  }

  // Statistics methods
  getBalance() {
    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return income - expense;
  }

  getMonthlyStatistics(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const monthTransactions = this.transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categorySummary = {};
    monthTransactions.forEach(t => {
      if (!categorySummary[t.categoryId]) {
        const category = this.getCategoryById(t.categoryId);
        categorySummary[t.categoryId] = {
          category,
          amount: 0,
          count: 0,
        };
      }
      categorySummary[t.categoryId].amount += t.amount;
      categorySummary[t.categoryId].count += 1;
    });
    
    return {
      income,
      expense,
      balance: income - expense,
      transactions: monthTransactions,
      categorySummary: Object.values(categorySummary),
    };
  }

  getYearlyStatistics(year) {
    const yearTransactions = this.transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year;
    });
    
    const monthlyData = [];
    for (let month = 0; month < 12; month++) {
      const monthTransactions = yearTransactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        month: month + 1,
        income,
        expense,
        balance: income - expense,
      });
    }
    
    const totalIncome = yearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = yearTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      year,
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      monthlyData,
    };
  }
}

export default new DataService();