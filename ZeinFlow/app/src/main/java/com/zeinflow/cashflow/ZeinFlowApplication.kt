package com.zeinflow.cashflow

import android.app.Application
import com.zeinflow.cashflow.data.database.AppDatabase
import com.zeinflow.cashflow.data.repository.CategoryRepository
import com.zeinflow.cashflow.data.repository.TransactionRepository
import com.zeinflow.cashflow.service.GoogleDriveService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ZeinFlowApplication : Application() {
    
    companion object {
        lateinit var instance: ZeinFlowApplication
            private set
    }
    
    // Database instance
    lateinit var database: AppDatabase
        private set
    
    // Repositories
    lateinit var transactionRepository: TransactionRepository
        private set
    
    lateinit var categoryRepository: CategoryRepository
        private set
    
    // Services
    lateinit var googleDriveService: GoogleDriveService
        private set
    
    override fun onCreate() {
        super.onCreate()
        instance = this
        
        // Initialize database
        database = AppDatabase.getDatabase(this)
        
        // Initialize services
        googleDriveService = GoogleDriveService(this)
        
        // Initialize repositories
        transactionRepository = TransactionRepository(
            database.transactionDao(),
            googleDriveService
        )
        
        categoryRepository = CategoryRepository(database.categoryDao())
        
        // Initialize default data
        initializeDefaultData()
    }
    
    private fun initializeDefaultData() {
        CoroutineScope(Dispatchers.IO).launch {
            categoryRepository.createDefaultCategoriesIfNeeded()
        }
    }
}