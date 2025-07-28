package com.zeinflow.cashflow.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.zeinflow.cashflow.data.model.TransactionType
import com.zeinflow.cashflow.data.repository.TransactionRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.*
import com.zeinflow.cashflow.ZeinFlowApplication

class DashboardViewModel : ViewModel() {
    
    private val transactionRepository = ZeinFlowApplication.instance.transactionRepository

    val totalBalance: StateFlow<Double?> = transactionRepository.getTotalBalance()
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    val totalIncome: StateFlow<Double?> = transactionRepository.getTotalByType(TransactionType.INCOME)
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    val totalExpense: StateFlow<Double?> = transactionRepository.getTotalByType(TransactionType.EXPENSE)
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    val recentTransactions: StateFlow<List<TransactionWithCategory>> = transactionRepository.getAllTransactions()
        .map { transactions ->
            transactions.map { transaction ->
                TransactionWithCategory(
                    transaction = transaction,
                    categoryName = "Loading...", // Will be populated by adapter
                    categoryIcon = "💰",
                    categoryColor = "#2196F3"
                )
            }
        }
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    private val currentMonth = Calendar.getInstance().apply {
        set(Calendar.DAY_OF_MONTH, 1)
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
    }.time

    private val nextMonth = Calendar.getInstance().apply {
        add(Calendar.MONTH, 1)
        set(Calendar.DAY_OF_MONTH, 1)
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
    }.time

    val monthlyIncome: StateFlow<Double?> = transactionRepository
        .getTotalByTypeAndDateRange(TransactionType.INCOME, currentMonth, nextMonth)
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    val monthlyExpense: StateFlow<Double?> = transactionRepository
        .getTotalByTypeAndDateRange(TransactionType.EXPENSE, currentMonth, nextMonth)
        .stateIn(viewModelScope, SharingStarted.Lazily, null)

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            // Data will be loaded automatically through Flow
        }
    }
}

data class TransactionWithCategory(
    val transaction: com.zeinflow.cashflow.data.model.Transaction,
    val categoryName: String,
    val categoryIcon: String,
    val categoryColor: String
)