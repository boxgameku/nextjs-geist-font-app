package com.zeinflow.cashflow.utils

import java.text.NumberFormat
import java.util.*

object CurrencyUtils {
    
    private val currencyFormat = NumberFormat.getCurrencyInstance(Locale("id", "ID")).apply {
        maximumFractionDigits = 0
        minimumFractionDigits = 0
    }
    
    fun formatCurrency(amount: Double): String {
        return currencyFormat.format(amount)
    }
    
    fun formatCurrencyWithoutSymbol(amount: Double): String {
        val formatted = formatCurrency(amount)
        return formatted.replace("Rp", "").trim()
    }
    
    fun parseCurrency(currencyString: String): Double {
        return try {
            val cleanString = currencyString
                .replace("Rp", "")
                .replace(".", "")
                .replace(",", "")
                .trim()
            cleanString.toDouble()
        } catch (e: NumberFormatException) {
            0.0
        }
    }
    
    fun formatAmount(amount: Double): String {
        return NumberFormat.getNumberInstance(Locale("id", "ID")).format(amount)
    }
}