package com.zeinflow.cashflow.data.repository

import com.zeinflow.cashflow.data.dao.TransactionDao
import com.zeinflow.cashflow.data.model.Transaction
import com.zeinflow.cashflow.data.model.TransactionType
import com.zeinflow.cashflow.service.GoogleDriveService
import kotlinx.coroutines.flow.Flow
import java.util.Date

class TransactionRepository(
    private val transactionDao: TransactionDao,
    private val googleDriveService: GoogleDriveService
) {
    
    fun getAllTransactions(): Flow<List<Transaction>> = transactionDao.getAllTransactions()
    
    fun getTransactionsByType(type: TransactionType): Flow<List<Transaction>> = 
        transactionDao.getTransactionsByType(type)
    
    fun getTransactionsByDateRange(startDate: Date, endDate: Date): Flow<List<Transaction>> =
        transactionDao.getTransactionsByDateRange(startDate, endDate)
    
    fun getTransactionsByCategory(categoryId: Long): Flow<List<Transaction>> =
        transactionDao.getTransactionsByCategory(categoryId)
    
    fun getTotalByType(type: TransactionType): Flow<Double?> = transactionDao.getTotalByType(type)
    
    fun getTotalByTypeAndDateRange(type: TransactionType, startDate: Date, endDate: Date): Flow<Double?> =
        transactionDao.getTotalByTypeAndDateRange(type, startDate, endDate)
    
    fun getTotalBalance(): Flow<Double?> = transactionDao.getTotalBalance()
    
    fun getBalanceByDateRange(startDate: Date, endDate: Date): Flow<Double?> =
        transactionDao.getBalanceByDateRange(startDate, endDate)
    
    fun getRecentTransactions(limit: Int): Flow<List<Transaction>> =
        transactionDao.getRecentTransactions(limit)
    
    suspend fun insertTransaction(transaction: Transaction): Long {
        val id = transactionDao.insertTransaction(transaction)
        // Sync to Google Drive
        googleDriveService.syncTransactionToDrive(transaction)
        return id
    }
    
    suspend fun updateTransaction(transaction: Transaction) {
        transactionDao.updateTransaction(transaction)
        // Sync to Google Drive
        googleDriveService.syncTransactionToDrive(transaction)
    }
    
    suspend fun deleteTransaction(transaction: Transaction) {
        transactionDao.deleteTransaction(transaction)
        // Remove from Google Drive
        googleDriveService.deleteTransactionFromDrive(transaction.id)
    }
    
    suspend fun deleteTransactionById(id: Long) {
        transactionDao.deleteTransactionById(id)
        // Remove from Google Drive
        googleDriveService.deleteTransactionFromDrive(id)
    }
    
    suspend fun syncFromGoogleDrive() {
        val driveTransactions = googleDriveService.getTransactionsFromDrive()
        driveTransactions.forEach { transaction ->
            transactionDao.insertTransaction(transaction)
        }
    }
    
    suspend fun backupToGoogleDrive() {
        val transactions = transactionDao.getAllTransactions().first()
        googleDriveService.backupTransactionsToDrive(transactions)
    }
}