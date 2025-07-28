package com.zeinflow.cashflow.ui.transaction

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.zeinflow.cashflow.databinding.FragmentTransactionListBinding
import com.zeinflow.cashflow.ui.AddTransactionActivity
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class TransactionListFragment : Fragment() {

    private var _binding: FragmentTransactionListBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var transactionAdapter: TransactionAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTransactionListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        setupClickListeners()
        observeTransactions()
    }

    private fun setupRecyclerView() {
        transactionAdapter = TransactionAdapter { transaction ->
            // Handle transaction click - could open edit dialog
        }
        
        binding.rvTransactions.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = transactionAdapter
        }
    }

    private fun setupClickListeners() {
        binding.fabAddTransaction.setOnClickListener {
            startActivity(Intent(requireContext(), AddTransactionActivity::class.java))
        }
    }

    private fun observeTransactions() {
        viewLifecycleOwner.lifecycleScope.launch {
            // For now, we'll use a simple approach
            // In a real app, you'd use ViewModel
            binding.tvNoTransactions.visibility = View.VISIBLE
            binding.rvTransactions.visibility = View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}