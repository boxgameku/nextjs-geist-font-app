package com.zeinflow.cashflow.utils

import androidx.room.TypeConverter
import com.zeinflow.cashflow.data.entities.TransactionType
import com.zeinflow.cashflow.data.entities.SyncStatus
import java.util.Date

class Converters {
    
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }
    
    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }
    
    @TypeConverter
    fun fromTransactionType(type: TransactionType): String {
        return type.name
    }
    
    @TypeConverter
    fun toTransactionType(type: String): TransactionType {
        return TransactionType.valueOf(type)
    }
    
    @TypeConverter
    fun fromSyncStatus(status: SyncStatus): String {
        return status.name
    }
    
    @TypeConverter
    fun toSyncStatus(status: String): SyncStatus {
        return SyncStatus.valueOf(status)
    }
}