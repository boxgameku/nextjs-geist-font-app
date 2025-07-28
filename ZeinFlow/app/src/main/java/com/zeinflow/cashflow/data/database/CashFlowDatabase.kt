package com.zeinflow.cashflow.data.database

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import android.content.Context
import com.zeinflow.cashflow.data.entities.Transaction
import com.zeinflow.cashflow.data.entities.Category
import com.zeinflow.cashflow.data.entities.TransactionType
import com.zeinflow.cashflow.data.dao.TransactionDao
import com.zeinflow.cashflow.data.dao.CategoryDao
import com.zeinflow.cashflow.utils.Converters
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import java.util.Date

@Database(
    entities = [Transaction::class, Category::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class CashFlowDatabase : RoomDatabase() {
    
    abstract fun transactionDao(): TransactionDao
    abstract fun categoryDao(): CategoryDao
    
    companion object {
        @Volatile
        private var INSTANCE: CashFlowDatabase? = null
        
        fun getDatabase(
            context: Context,
            scope: CoroutineScope
        ): CashFlowDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    CashFlowDatabase::class.java,
                    "cashflow_database"
                )
                .addCallback(CashFlowDatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }
        
        private class CashFlowDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch {
                        populateDatabase(database.categoryDao())
                    }
                }
            }
            
            suspend fun populateDatabase(categoryDao: CategoryDao) {
                // Hapus semua data
                // categoryDao.deleteAll() // Uncomment if needed
                
                // Tambahkan kategori default
                val defaultCategories = listOf(
                    // Kategori Pemasukan
                    Category(
                        name = "Gaji",
                        color = "#4CAF50",
                        icon = "💰",
                        type = TransactionType.INCOME,
                        isDefault = true
                    ),
                    Category(
                        name = "Bonus",
                        color = "#8BC34A",
                        icon = "🎁",
                        type = TransactionType.INCOME,
                        isDefault = true
                    ),
                    Category(
                        name = "Investasi",
                        color = "#CDDC39",
                        icon = "📈",
                        type = TransactionType.INCOME,
                        isDefault = true
                    ),
                    Category(
                        name = "Lainnya",
                        color = "#FFC107",
                        icon = "💵",
                        type = TransactionType.INCOME,
                        isDefault = true
                    ),
                    
                    // Kategori Pengeluaran
                    Category(
                        name = "Makanan",
                        color = "#FF9800",
                        icon = "🍽️",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Transportasi",
                        color = "#FF5722",
                        icon = "🚗",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Belanja",
                        color = "#E91E63",
                        icon = "🛒",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Hiburan",
                        color = "#9C27B0",
                        icon = "🎬",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Kesehatan",
                        color = "#3F51B5",
                        icon = "🏥",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Pendidikan",
                        color = "#2196F3",
                        icon = "📚",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Tagihan",
                        color = "#00BCD4",
                        icon = "💳",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    ),
                    Category(
                        name = "Lainnya",
                        color = "#607D8B",
                        icon = "💸",
                        type = TransactionType.EXPENSE,
                        isDefault = true
                    )
                )
                
                categoryDao.insertCategories(defaultCategories)
            }
        }
    }
}