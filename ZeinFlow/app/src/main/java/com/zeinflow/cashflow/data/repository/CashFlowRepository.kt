package com.zeinflow.cashflow.data.repository

import androidx.lifecycle.LiveData
import com.zeinflow.cashflow.data.dao.TransactionDao
import com.zeinflow.cashflow.data.dao.CategoryDao
import com.zeinflow.cashflow.data.entities.*
import java.util.Date

class CashFlowRepository(
    private val transactionDao: TransactionDao,
    private val categoryDao: CategoryDao
) {
    
    // Transaction operations
    fun getAllTransactions(): LiveData<List<Transaction>> = transactionDao.getAllTransactions()
    
    fun getAllTransactionsWithCategory(): LiveData<List<TransactionWithCategory>> = 
        transactionDao.getAllTransactionsWithCategory()
    
    fun getTransactionsByDateRange(startDate: Date, endDate: Date): LiveData<List<TransactionWithCategory>> =
        transactionDao.getTransactionsByDateRange(startDate, endDate)
    
    fun getTransactionsByType(type: TransactionType): LiveData<List<TransactionWithCategory>> =
        transactionDao.getTransactionsByType(type)
    
    fun getTransactionsByCategory(categoryId: Long): LiveData<List<TransactionWithCategory>> =
        transactionDao.getTransactionsByCategory(categoryId)
    
    fun getTotalByType(type: TransactionType): LiveData<Double?> =
        transactionDao.getTotalByType(type)
    
    fun getTotalByTypeAndDateRange(type: TransactionType, startDate: Date, endDate: Date): LiveData<Double?> =
        transactionDao.getTotalByTypeAndDateRange(type, startDate, endDate)
    
    suspend fun getTransactionById(id: Long): Transaction? =
        transactionDao.getTransactionById(id)
    
    suspend fun insertTransaction(transaction: Transaction): Long =
        transactionDao.insertTransaction(transaction)
    
    suspend fun updateTransaction(transaction: Transaction) =
        transactionDao.updateTransaction(transaction)
    
    suspend fun deleteTransaction(transaction: Transaction) =
        transactionDao.deleteTransaction(transaction)
    
    suspend fun deleteTransactionById(id: Long) =
        transactionDao.deleteTransactionById(id)
    
    // Category operations
    fun getAllCategories(): LiveData<List<Category>> = categoryDao.getAllCategories()
    
    fun getCategoriesByType(type: TransactionType): LiveData<List<Category>> =
        categoryDao.getCategoriesByType(type)
    
    suspend fun getCategoryById(id: Long): Category? =
        categoryDao.getCategoryById(id)
    
    suspend fun getDefaultCategories(): List<Category> =
        categoryDao.getDefaultCategories()
    
    suspend fun insertCategory(category: Category): Long =
        categoryDao.insertCategory(category)
    
    suspend fun insertCategories(categories: List<Category>) =
        categoryDao.insertCategories(categories)
    
    suspend fun updateCategory(category: Category) =
        categoryDao.updateCategory(category)
    
    suspend fun deleteCategory(category: Category) =
        categoryDao.deleteCategory(category)
    
    suspend fun deleteCategoryById(id: Long) =
        categoryDao.deleteCategoryById(id)
    
    // Sync operations
    suspend fun getUnsyncedTransactions(): List<Transaction> =
        transactionDao.getUnsyncedTransactions()
    
    suspend fun getUnsyncedCategories(): List<Category> =
        categoryDao.getUnsyncedCategories()
    
    suspend fun updateTransactionSyncStatus(id: Long, status: SyncStatus) =
        transactionDao.updateSyncStatus(id, status.name)
    
    suspend fun updateCategorySyncStatus(id: Long, status: SyncStatus) =
        categoryDao.updateSyncStatus(id, status.name)
    
    suspend fun getDefaultCategoriesCount(): Int =
        categoryDao.getDefaultCategoriesCount()
}