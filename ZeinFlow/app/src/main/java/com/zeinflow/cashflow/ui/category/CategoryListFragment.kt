package com.zeinflow.cashflow.ui.category

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.zeinflow.cashflow.databinding.FragmentCategoryListBinding
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class CategoryListFragment : Fragment() {

    private var _binding: FragmentCategoryListBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCategoryListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupClickListeners()
        observeCategories()
    }

    private fun setupClickListeners() {
        binding.fabAddCategory.setOnClickListener {
            // TODO: Open add category dialog
        }
    }

    private fun observeCategories() {
        viewLifecycleOwner.lifecycleScope.launch {
            // For now, we'll use a simple approach
            // In a real app, you'd use ViewModel
            binding.tvNoCategories.visibility = View.VISIBLE
            binding.rvCategories.visibility = View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}