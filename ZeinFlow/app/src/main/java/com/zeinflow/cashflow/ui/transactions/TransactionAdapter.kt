package com.zeinflow.cashflow.ui.transactions

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.zeinflow.cashflow.databinding.ItemTransactionBinding
import com.zeinflow.cashflow.data.entities.TransactionWithCategory
import com.zeinflow.cashflow.data.entities.TransactionType
import com.zeinflow.cashflow.utils.CurrencyUtils
import com.zeinflow.cashflow.utils.DateUtils
import com.zeinflow.cashflow.R

class TransactionAdapter(
    private val onItemClick: (TransactionWithCategory) -> Unit
) : ListAdapter<TransactionWithCategory, TransactionAdapter.TransactionViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TransactionViewHolder {
        val binding = ItemTransactionBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return TransactionViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TransactionViewHolder, position: Int) {
        val transaction = getItem(position)
        holder.bind(transaction)
    }

    inner class TransactionViewHolder(
        private val binding: ItemTransactionBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.root.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }
        }

        fun bind(transactionWithCategory: TransactionWithCategory) {
            val transaction = transactionWithCategory.transaction
            val category = transactionWithCategory.category

            binding.apply {
                // Set category icon and color
                tvCategoryIcon.text = category.icon
                try {
                    val backgroundColor = Color.parseColor(category.color)
                    tvCategoryIcon.background.setTint(backgroundColor)
                } catch (e: IllegalArgumentException) {
                    // Use default color if parsing fails
                    tvCategoryIcon.background.setTint(
                        root.context.getColor(R.color.surface_variant)
                    )
                }

                // Set transaction details
                tvDescription.text = transaction.description
                tvCategoryName.text = category.name
                tvDate.text = DateUtils.formatDisplayDate(transaction.date)

                // Set amount with color based on type
                val amount = transaction.amount
                val formattedAmount = if (transaction.type == TransactionType.INCOME) {
                    "+${CurrencyUtils.formatCurrency(amount)}"
                } else {
                    "-${CurrencyUtils.formatCurrency(amount)}"
                }
                
                tvAmount.text = formattedAmount
                
                val colorRes = if (transaction.type == TransactionType.INCOME) {
                    R.color.income_color
                } else {
                    R.color.expense_color
                }
                tvAmount.setTextColor(root.context.getColor(colorRes))
            }
        }
    }

    companion object DiffCallback : DiffUtil.ItemCallback<TransactionWithCategory>() {
        override fun areItemsTheSame(
            oldItem: TransactionWithCategory,
            newItem: TransactionWithCategory
        ): Boolean {
            return oldItem.transaction.id == newItem.transaction.id
        }

        override fun areContentsTheSame(
            oldItem: TransactionWithCategory,
            newItem: TransactionWithCategory
        ): Boolean {
            return oldItem == newItem
        }
    }
}