package com.zeinflow.cashflow.data.repository

import com.zeinflow.cashflow.data.dao.CategoryDao
import com.zeinflow.cashflow.data.model.Category
import com.zeinflow.cashflow.data.model.TransactionType
import kotlinx.coroutines.flow.Flow

class CategoryRepository(private val categoryDao: CategoryDao) {
    
    fun getAllCategories(): Flow<List<Category>> = categoryDao.getAllCategories()
    
    fun getCategoriesByType(type: TransactionType): Flow<List<Category>> = 
        categoryDao.getCategoriesByType(type)
    
    fun getDefaultCategories(): Flow<List<Category>> = categoryDao.getDefaultCategories()
    
    suspend fun getCategoryById(id: Long): Category? = categoryDao.getCategoryById(id)
    
    suspend fun insertCategory(category: Category): Long = categoryDao.insertCategory(category)
    
    suspend fun updateCategory(category: Category) = categoryDao.updateCategory(category)
    
    suspend fun deleteCategory(category: Category) = categoryDao.deleteCategory(category)
    
    suspend fun deleteCategoryById(id: Long) = categoryDao.deleteCategoryById(id)
    
    suspend fun getCategoryCountByName(name: String): Int = categoryDao.getCategoryCountByName(name)
    
    suspend fun createDefaultCategoriesIfNeeded() {
        val existingCategories = categoryDao.getAllCategories().first()
        if (existingCategories.isEmpty()) {
            createDefaultCategories()
        }
    }
    
    private suspend fun createDefaultCategories() {
        val defaultCategories = listOf(
            // Income Categories
            Category(name = "Gaji", color = "#4CAF50", icon = "💰", type = TransactionType.INCOME, isDefault = true),
            Category(name = "Bonus", color = "#8BC34A", icon = "🎁", type = TransactionType.INCOME, isDefault = true),
            Category(name = "Investasi", color = "#009688", icon = "📈", type = TransactionType.INCOME, isDefault = true),
            Category(name = "Lainnya", color = "#607D8B", icon = "📊", type = TransactionType.INCOME, isDefault = true),
            
            // Expense Categories
            Category(name = "Makanan", color = "#F44336", icon = "🍽️", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Transport", color = "#FF9800", icon = "🚗", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Belanja", color = "#E91E63", icon = "🛍️", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Hiburan", color = "#9C27B0", icon = "🎬", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Kesehatan", color = "#2196F3", icon = "💊", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Pendidikan", color = "#3F51B5", icon = "📚", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Tagihan", color = "#795548", icon = "📄", type = TransactionType.EXPENSE, isDefault = true),
            Category(name = "Lainnya", color = "#9E9E9E", icon = "📋", type = TransactionType.EXPENSE, isDefault = true)
        )
        
        defaultCategories.forEach { category ->
            categoryDao.insertCategory(category)
        }
    }
}