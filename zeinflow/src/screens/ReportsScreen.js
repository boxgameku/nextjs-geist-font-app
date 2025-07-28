import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, Card, SegmentedButtons, Button, List, Avatar, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';
import DataService from '../services/DataService';
import { theme } from '../constants/theme';

moment.locale('id');

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [period, setPeriod] = useState('month'); // 'month' or 'year'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statistics, setStatistics] = useState(null);
  const [yearStatistics, setYearStatistics] = useState(null);

  const loadStatistics = async () => {
    try {
      await DataService.initialize();
      
      if (period === 'month') {
        const stats = DataService.getMonthlyStatistics(selectedYear, selectedMonth);
        setStatistics(stats);
      } else {
        const stats = DataService.getYearlyStatistics(selectedYear);
        setYearStatistics(stats);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [period, selectedMonth, selectedYear])
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const changeYear = (direction) => {
    setSelectedYear(selectedYear + (direction === 'prev' ? -1 : 1));
  };

  const renderMonthlyReport = () => {
    if (!statistics) return null;

    const incomePercentage = statistics.income > 0 
      ? (statistics.income / (statistics.income + statistics.expense)) * 100
      : 0;
    const expensePercentage = statistics.expense > 0
      ? (statistics.expense / (statistics.income + statistics.expense)) * 100
      : 0;

    return (
      <>
        <Surface style={styles.periodSelector}>
          <Button icon="chevron-left" onPress={() => changeMonth('prev')} />
          <Text style={styles.periodText}>
            {moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM').format('MMMM YYYY')}
          </Text>
          <Button icon="chevron-right" onPress={() => changeMonth('next')} />
        </Surface>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Ringkasan Bulan Ini</Text>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Icon name="arrow-down-circle" size={24} color={theme.colors.income} />
                <Text style={styles.summaryLabel}>Pemasukan</Text>
                <Text style={[styles.summaryAmount, { color: theme.colors.income }]}>
                  {formatCurrency(statistics.income)}
                </Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryItem}>
                <Icon name="arrow-up-circle" size={24} color={theme.colors.expense} />
                <Text style={styles.summaryLabel}>Pengeluaran</Text>
                <Text style={[styles.summaryAmount, { color: theme.colors.expense }]}>
                  {formatCurrency(statistics.expense)}
                </Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Text style={[
                styles.balanceAmount,
                { color: statistics.balance >= 0 ? theme.colors.income : theme.colors.expense }
              ]}>
                {formatCurrency(statistics.balance)}
              </Text>
            </View>

            {(statistics.income > 0 || statistics.expense > 0) && (
              <>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressIncome, 
                      { width: `${incomePercentage}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.progressExpense, 
                      { width: `${expensePercentage}%` }
                    ]} 
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>
                    Pemasukan {incomePercentage.toFixed(0)}%
                  </Text>
                  <Text style={styles.progressLabel}>
                    Pengeluaran {expensePercentage.toFixed(0)}%
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        <Surface style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Rincian per Kategori</Text>
          {statistics.categorySummary.length > 0 ? (
            statistics.categorySummary
              .sort((a, b) => b.amount - a.amount)
              .map((item, index) => (
                <React.Fragment key={item.category.id}>
                  <List.Item
                    title={item.category.name}
                    description={`${item.count} transaksi`}
                    left={() => (
                      <Avatar.Icon
                        size={40}
                        icon={item.category.icon}
                        style={{ backgroundColor: item.category.color }}
                      />
                    )}
                    right={() => (
                      <View style={styles.categoryAmount}>
                        <Text style={[
                          styles.amount,
                          { color: item.category.type === 'income' ? theme.colors.income : theme.colors.expense }
                        ]}>
                          {formatCurrency(item.amount)}
                        </Text>
                        <Text style={styles.percentage}>
                          {((item.amount / (item.category.type === 'income' ? statistics.income : statistics.expense)) * 100).toFixed(0)}%
                        </Text>
                      </View>
                    )}
                  />
                  {index < statistics.categorySummary.length - 1 && <Divider />}
                </React.Fragment>
              ))
          ) : (
            <Text style={styles.emptyText}>Tidak ada transaksi bulan ini</Text>
          )}
        </Surface>
      </>
    );
  };

  const renderYearlyReport = () => {
    if (!yearStatistics) return null;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const maxValue = Math.max(...yearStatistics.monthlyData.map(m => Math.max(m.income, m.expense)));

    return (
      <>
        <Surface style={styles.periodSelector}>
          <Button icon="chevron-left" onPress={() => changeYear('prev')} />
          <Text style={styles.periodText}>{selectedYear}</Text>
          <Button icon="chevron-right" onPress={() => changeYear('next')} />
        </Surface>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Ringkasan Tahun {selectedYear}</Text>
            
            <View style={styles.yearSummary}>
              <View style={styles.yearSummaryItem}>
                <Text style={styles.yearSummaryLabel}>Total Pemasukan</Text>
                <Text style={[styles.yearSummaryAmount, { color: theme.colors.income }]}>
                  {formatCurrency(yearStatistics.totalIncome)}
                </Text>
              </View>
              
              <View style={styles.yearSummaryItem}>
                <Text style={styles.yearSummaryLabel}>Total Pengeluaran</Text>
                <Text style={[styles.yearSummaryAmount, { color: theme.colors.expense }]}>
                  {formatCurrency(yearStatistics.totalExpense)}
                </Text>
              </View>
              
              <View style={styles.yearSummaryItem}>
                <Text style={styles.yearSummaryLabel}>Saldo Tahun Ini</Text>
                <Text style={[
                  styles.yearSummaryAmount,
                  { color: yearStatistics.totalBalance >= 0 ? theme.colors.income : theme.colors.expense }
                ]}>
                  {formatCurrency(yearStatistics.totalBalance)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Surface style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Grafik Bulanan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chart}>
              {yearStatistics.monthlyData.map((month, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        styles.incomeBar,
                        { height: maxValue > 0 ? (month.income / maxValue) * 150 : 0 }
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        { height: maxValue > 0 ? (month.expense / maxValue) * 150 : 0 }
                      ]}
                    />
                  </View>
                  <Text style={styles.monthLabel}>{monthNames[index]}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.income }]} />
              <Text style={styles.legendText}>Pemasukan</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.expense }]} />
              <Text style={styles.legendText}>Pengeluaran</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.monthlyDetailSection}>
          <Text style={styles.sectionTitle}>Detail per Bulan</Text>
          {yearStatistics.monthlyData.map((month, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={moment().month(index).format('MMMM')}
                description={`Saldo: ${formatCurrency(month.balance)}`}
                left={() => (
                  <Avatar.Text
                    size={40}
                    label={(index + 1).toString()}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
                right={() => (
                  <View style={styles.monthDetail}>
                    <Text style={[styles.monthIncome, { color: theme.colors.income }]}>
                      +{formatCurrency(month.income)}
                    </Text>
                    <Text style={[styles.monthExpense, { color: theme.colors.expense }]}>
                      -{formatCurrency(month.expense)}
                    </Text>
                  </View>
                )}
              />
              {index < 11 && <Divider />}
            </React.Fragment>
          ))}
        </Surface>
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.periodToggle}>
        <SegmentedButtons
          value={period}
          onValueChange={setPeriod}
          buttons={[
            { value: 'month', label: 'Bulanan' },
            { value: 'year', label: 'Tahunan' },
          ]}
        />
      </Surface>

      {period === 'month' ? renderMonthlyReport() : renderYearlyReport()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  periodToggle: {
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  periodText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  summaryCard: {
    margin: 10,
    borderRadius: theme.roundness,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: theme.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.background,
  },
  divider: {
    marginVertical: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    backgroundColor: theme.colors.background,
  },
  progressIncome: {
    backgroundColor: theme.colors.income,
  },
  progressExpense: {
    backgroundColor: theme.colors.expense,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  categorySection: {
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: theme.colors.text,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    padding: 20,
  },
  yearSummary: {
    gap: 15,
  },
  yearSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearSummaryLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  yearSummaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartSection: {
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
  },
  chart: {
    flexDirection: 'row',
    height: 200,
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 40,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 15,
    borderRadius: 4,
  },
  incomeBar: {
    backgroundColor: theme.colors.income,
  },
  expenseBar: {
    backgroundColor: theme.colors.expense,
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 5,
    color: theme.colors.placeholder,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  monthlyDetailSection: {
    margin: 10,
    padding: 10,
    borderRadius: theme.roundness,
    elevation: 2,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  monthDetail: {
    alignItems: 'flex-end',
  },
  monthIncome: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthExpense: {
    fontSize: 14,
    fontWeight: '500',
  },
});