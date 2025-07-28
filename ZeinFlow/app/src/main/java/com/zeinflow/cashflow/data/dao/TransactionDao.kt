package com.zeinflow.cashflow.data.dao

import androidx.room.*
import com.zeinflow.cashflow.data.model.Transaction
import com.zeinflow.cashflow.data.model.TransactionType
import kotlinx.coroutines.flow.Flow
import java.util.Date

@Dao
interface TransactionDao {
    
    @Query("SELECT * FROM transactions ORDER BY date DESC")
    fun getAllTransactions(): Flow<List<Transaction>>
    
    @Query("SELECT * FROM transactions WHERE type = :type ORDER BY date DESC")
    fun getTransactionsByType(type: TransactionType): Flow<List<Transaction>>
    
    @Query("SELECT * FROM transactions WHERE date BETWEEN :startDate AND :endDate ORDER BY date DESC")
    fun getTransactionsByDateRange(startDate: Date, endDate: Date): Flow<List<Transaction>>
    
    @Query("SELECT * FROM transactions WHERE categoryId = :categoryId ORDER BY date DESC")
    fun getTransactionsByCategory(categoryId: Long): Flow<List<Transaction>>
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = :type")
    fun getTotalByType(type: TransactionType): Flow<Double?>
    
    @Query("SELECT SUM(amount) FROM transactions WHERE type = :type AND date BETWEEN :startDate AND :endDate")
    fun getTotalByTypeAndDateRange(type: TransactionType, startDate: Date, endDate: Date): Flow<Double?>
    
    @Query("SELECT SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) FROM transactions")
    fun getTotalBalance(): Flow<Double?>
    
    @Query("SELECT SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) FROM transactions WHERE date BETWEEN :startDate AND :endDate")
    fun getBalanceByDateRange(startDate: Date, endDate: Date): Flow<Double?>
    
    @Query("SELECT * FROM transactions ORDER BY date DESC LIMIT :limit")
    fun getRecentTransactions(limit: Int): Flow<List<Transaction>>
    
    @Insert
    suspend fun insertTransaction(transaction: Transaction): Long
    
    @Update
    suspend fun updateTransaction(transaction: Transaction)
    
    @Delete
    suspend fun deleteTransaction(transaction: Transaction)
    
    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteTransactionById(id: Long)
}