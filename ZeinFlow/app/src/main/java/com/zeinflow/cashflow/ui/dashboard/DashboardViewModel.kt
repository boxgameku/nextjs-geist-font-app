package com.zeinflow.cashflow.ui.dashboard

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.zeinflow.cashflow.data.database.CashFlowDatabase
import com.zeinflow.cashflow.data.repository.CashFlowRepository
import com.zeinflow.cashflow.data.entities.TransactionType
import com.zeinflow.cashflow.data.entities.TransactionWithCategory
import kotlinx.coroutines.launch

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    
    private val repository: CashFlowRepository
    
    val totalIncome: LiveData<Double?>
    val totalExpense: LiveData<Double?>
    val recentTransactions: LiveData<List<TransactionWithCategory>>
    
    init {
        val database = CashFlowDatabase.getDatabase(application, viewModelScope)
        repository = CashFlowRepository(database.transactionDao(), database.categoryDao())
        
        totalIncome = repository.getTotalByType(TransactionType.INCOME)
        totalExpense = repository.getTotalByType(TransactionType.EXPENSE)
        recentTransactions = repository.getAllTransactionsWithCategory()
    }
}