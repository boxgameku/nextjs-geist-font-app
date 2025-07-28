package com.zeinflow.cashflow.ui.transaction

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.zeinflow.cashflow.data.model.Transaction
import com.zeinflow.cashflow.data.model.TransactionType
import com.zeinflow.cashflow.databinding.ItemTransactionBinding
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class TransactionAdapter(
    private val onTransactionClick: (Transaction) -> Unit
) : ListAdapter<Transaction, TransactionAdapter.TransactionViewHolder>(TransactionDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TransactionViewHolder {
        val binding = ItemTransactionBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return TransactionViewHolder(binding, onTransactionClick)
    }

    override fun onBindViewHolder(holder: TransactionViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class TransactionViewHolder(
        private val binding: ItemTransactionBinding,
        private val onTransactionClick: (Transaction) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        private val currencyFormatter = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        private val dateFormatter = SimpleDateFormat("dd/MM/yyyy", Locale("id"))

        fun bind(transaction: Transaction) {
            binding.apply {
                tvDescription.text = transaction.description
                tvAmount.text = currencyFormatter.format(transaction.amount)
                tvDate.text = dateFormatter.format(transaction.date)
                
                // Set transaction type text and color
                when (transaction.type) {
                    TransactionType.INCOME -> {
                        tvTransactionType.text = "Pendapatan"
                        tvAmount.setTextColor(root.context.getColor(com.zeinflow.cashflow.R.color.income_green))
                    }
                    TransactionType.EXPENSE -> {
                        tvTransactionType.text = "Pengeluaran"
                        tvAmount.setTextColor(root.context.getColor(com.zeinflow.cashflow.R.color.expense_red))
                    }
                }

                // TODO: Load category information from database
                tvCategoryName.text = "Kategori" // Placeholder
                tvCategoryIcon.text = "💰" // Placeholder

                root.setOnClickListener {
                    onTransactionClick(transaction)
                }
            }
        }
    }

    private class TransactionDiffCallback : DiffUtil.ItemCallback<Transaction>() {
        override fun areItemsTheSame(oldItem: Transaction, newItem: Transaction): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Transaction, newItem: Transaction): Boolean {
            return oldItem == newItem
        }
    }
}