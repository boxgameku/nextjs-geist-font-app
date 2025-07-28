package com.zeinflow.cashflow.data.dao

import androidx.room.*
import com.zeinflow.cashflow.data.model.Category
import com.zeinflow.cashflow.data.model.TransactionType
import kotlinx.coroutines.flow.Flow

@Dao
interface CategoryDao {
    
    @Query("SELECT * FROM categories ORDER BY name ASC")
    fun getAllCategories(): Flow<List<Category>>
    
    @Query("SELECT * FROM categories WHERE type = :type ORDER BY name ASC")
    fun getCategoriesByType(type: TransactionType): Flow<List<Category>>
    
    @Query("SELECT * FROM categories WHERE isDefault = 1")
    fun getDefaultCategories(): Flow<List<Category>>
    
    @Query("SELECT * FROM categories WHERE id = :id")
    suspend fun getCategoryById(id: Long): Category?
    
    @Insert
    suspend fun insertCategory(category: Category): Long
    
    @Update
    suspend fun updateCategory(category: Category)
    
    @Delete
    suspend fun deleteCategory(category: Category)
    
    @Query("DELETE FROM categories WHERE id = :id")
    suspend fun deleteCategoryById(id: Long)
    
    @Query("SELECT COUNT(*) FROM categories WHERE name = :name")
    suspend fun getCategoryCountByName(name: String): Int
}