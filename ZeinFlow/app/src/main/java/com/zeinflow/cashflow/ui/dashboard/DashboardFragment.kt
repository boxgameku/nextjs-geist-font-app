package com.zeinflow.cashflow.ui.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.zeinflow.cashflow.databinding.FragmentDashboardBinding
import com.zeinflow.cashflow.utils.CurrencyUtils
import com.zeinflow.cashflow.data.entities.TransactionType
import com.zeinflow.cashflow.ui.transactions.TransactionAdapter

class DashboardFragment : Fragment() {
    
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: DashboardViewModel
    private lateinit var recentTransactionsAdapter: TransactionAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupViewModel()
        setupRecyclerView()
        observeData()
        setupClickListeners()
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[DashboardViewModel::class.java]
    }
    
    private fun setupRecyclerView() {
        recentTransactionsAdapter = TransactionAdapter { transaction ->
            // Handle transaction click
        }
        
        binding.rvRecentTransactions.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = recentTransactionsAdapter
        }
    }
    
    private fun observeData() {
        // Observe total income
        viewModel.totalIncome.observe(viewLifecycleOwner) { total ->
            val amount = total ?: 0.0
            binding.tvIncomeAmount.text = CurrencyUtils.formatCurrency(amount)
        }
        
        // Observe total expense
        viewModel.totalExpense.observe(viewLifecycleOwner) { total ->
            val amount = total ?: 0.0
            binding.tvExpenseAmount.text = CurrencyUtils.formatCurrency(amount)
        }
        
        // Calculate net balance
        viewModel.totalIncome.observe(viewLifecycleOwner) { income ->
            viewModel.totalExpense.observe(viewLifecycleOwner) { expense ->
                val incomeAmount = income ?: 0.0
                val expenseAmount = expense ?: 0.0
                val netBalance = incomeAmount - expenseAmount
                
                binding.tvBalanceAmount.text = CurrencyUtils.formatCurrency(netBalance)
                
                // Set color based on balance
                val colorRes = if (netBalance >= 0) {
                    com.zeinflow.cashflow.R.color.income_color
                } else {
                    com.zeinflow.cashflow.R.color.expense_color
                }
                binding.tvBalanceAmount.setTextColor(
                    requireContext().getColor(colorRes)
                )
            }
        }
        
        // Observe recent transactions
        viewModel.recentTransactions.observe(viewLifecycleOwner) { transactions ->
            recentTransactionsAdapter.submitList(transactions)
            
            // Show/hide empty state
            if (transactions.isEmpty()) {
                binding.tvNoRecentTransactions.visibility = View.VISIBLE
                binding.rvRecentTransactions.visibility = View.GONE
            } else {
                binding.tvNoRecentTransactions.visibility = View.GONE
                binding.rvRecentTransactions.visibility = View.VISIBLE
            }
        }
    }
    
    private fun setupClickListeners() {
        binding.tvViewAllTransactions.setOnClickListener {
            // Navigate to transactions fragment
            // TODO: Implement navigation
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}