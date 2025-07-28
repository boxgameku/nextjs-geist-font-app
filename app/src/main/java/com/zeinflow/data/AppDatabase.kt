package com.zeinflow.data

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.zeinflow.data.dao.CategoryDao
import com.zeinflow.data.dao.TransactionDao
import com.zeinflow.data.entity.Category
import com.zeinflow.data.entity.Transaction
import kotlinx.datetime.Instant

class Converters {
    @androidx.room.TypeConverter
    fun fromInstant(value: Instant): Long = value.toEpochMilliseconds()

    @androidx.room.TypeConverter
    fun toInstant(value: Long): Instant = Instant.fromEpochMilliseconds(value)
}

@Database(
    entities = [Category::class, Transaction::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun categoryDao(): CategoryDao
    abstract fun transactionDao(): TransactionDao
}