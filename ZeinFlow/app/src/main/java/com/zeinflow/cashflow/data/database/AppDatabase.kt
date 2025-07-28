package com.zeinflow.cashflow.data.database

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import android.content.Context
import com.zeinflow.cashflow.data.dao.CategoryDao
import com.zeinflow.cashflow.data.dao.TransactionDao
import com.zeinflow.cashflow.data.model.Category
import com.zeinflow.cashflow.data.model.Transaction

@Database(
    entities = [Transaction::class, Category::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun transactionDao(): TransactionDao
    abstract fun categoryDao(): CategoryDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "zeinflow_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}