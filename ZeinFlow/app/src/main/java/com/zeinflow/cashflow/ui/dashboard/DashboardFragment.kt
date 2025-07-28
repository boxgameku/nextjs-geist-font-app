package com.zeinflow.cashflow.ui.dashboard

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.zeinflow.cashflow.databinding.FragmentDashboardBinding
import com.zeinflow.cashflow.ui.transaction.AddTransactionActivity
import com.zeinflow.cashflow.ui.transaction.TransactionAdapter
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.*

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: DashboardViewModel by viewModels()
    private lateinit var transactionAdapter: TransactionAdapter

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
        
        setupRecyclerView()
        setupClickListeners()
        observeData()
    }

    private fun setupRecyclerView() {
        transactionAdapter = TransactionAdapter { transaction ->
            // Handle transaction click
        }
        
        binding.rvRecentTransactions.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = transactionAdapter
        }
    }

    private fun setupClickListeners() {
        binding.btnAddTransaction.setOnClickListener {
            startActivity(Intent(requireContext(), AddTransactionActivity::class.java))
        }
    }

    private fun observeData() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.totalBalance.collectLatest { balance ->
                binding.tvTotalBalance.text = formatCurrency(balance ?: 0.0)
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.totalIncome.collectLatest { income ->
                binding.tvTotalIncome.text = formatCurrency(income ?: 0.0)
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.totalExpense.collectLatest { expense ->
                binding.tvTotalExpense.text = formatCurrency(expense ?: 0.0)
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.monthlyIncome.collectLatest { income ->
                binding.tvMonthlyIncome.text = formatCurrency(income ?: 0.0)
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.monthlyExpense.collectLatest { expense ->
                binding.tvMonthlyExpense.text = formatCurrency(expense ?: 0.0)
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.recentTransactions.collectLatest { transactions ->
                if (transactions.isEmpty()) {
                    binding.tvNoTransactions.visibility = View.VISIBLE
                    binding.rvRecentTransactions.visibility = View.GONE
                } else {
                    binding.tvNoTransactions.visibility = View.GONE
                    binding.rvRecentTransactions.visibility = View.VISIBLE
                    transactionAdapter.submitList(transactions.take(5))
                }
            }
        }
    }

    private fun formatCurrency(amount: Double): String {
        val formatter = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        return formatter.format(amount)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}