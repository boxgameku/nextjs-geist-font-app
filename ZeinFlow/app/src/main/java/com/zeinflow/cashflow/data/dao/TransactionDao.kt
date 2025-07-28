package com.zeinflow.cashflow.data.dao

import androidx.room.*
import androidx.lifecycle.LiveData
import com.zeinflow.cashflow.data.entities.Transaction
import com.zeinflow.cashflow.data.entities.TransactionWithCategory
import com.zeinflow.cashflow.data.entities.TransactionType
import java.util.Date

@Dao
interface TransactionDao {
    
    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    fun getAllTransactions(): LiveData<List<Transaction>>
    
    @Transaction
    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    fun getAllTransactionsWithCategory(): LiveData<List<TransactionWithCategory>>
    
    @Transaction
    @Query("SELECT * FROM transactions WHERE date BETWEEN :startDate AND :endDate ORDER BY date DESC")
    fun getTransactionsByDateRange(startDate: Date, endDate: Date): LiveData<List<TransactionWithCategory>>
    
    @Transaction
    @Query("SELECT * FROM transactions WHERE type = :type ORDER BY date DESC")
    fun getTransactionsByType(type: TransactionType): LiveData<List<TransactionWithCategory>>
    
    @Transaction
    @Query("SELECT * FROM transactions WHERE categoryId = :categoryId ORDER BY date DESC")
    fun getTransactionsByCategory(categoryId: Long): LiveData<List<TransactionWithCategory>>
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = :type")
    fun getTotalByType(type: TransactionType): LiveData<Double?>
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = :type AND date BETWEEN :startDate AND :endDate")
    fun getTotalByTypeAndDateRange(type: TransactionType, startDate: Date, endDate: Date): LiveData<Double?>
    
    @Query("SELECT * FROM transactions WHERE id = :id")
    suspend fun getTransactionById(id: Long): Transaction?
    
    @Insert
    suspend fun insertTransaction(transaction: Transaction): Long
    
    @Update
    suspend fun updateTransaction(transaction: Transaction)
    
    @Delete
    suspend fun deleteTransaction(transaction: Transaction)
    
    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteTransactionById(id: Long)
    
    @Query("SELECT * FROM transactions WHERE syncStatus != 'SYNCED'")
    suspend fun getUnsyncedTransactions(): List<Transaction>
    
    @Query("UPDATE transactions SET syncStatus = :status WHERE id = :id")
    suspend fun updateSyncStatus(id: Long, status: String)
}