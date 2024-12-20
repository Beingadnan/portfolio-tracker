import React, { useState, useEffect } from 'react';
import { Stock, PortfolioMetrics } from './types';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { StockForm } from './components/StockForm';
import { mockStocks } from './data/mockStocks';
import { BarChart2 } from 'lucide-react';

function App() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalGainLoss: 0,
    topPerformer: null,
    worstPerformer: null,
  });

  useEffect(() => {
    calculateMetrics();
  }, [stocks]);

  const calculateMetrics = () => {
    const totalValue = stocks.reduce(
      (sum, stock) => sum + stock.currentPrice * stock.quantity,
      0
    );

    const totalGainLoss = stocks.reduce(
      (sum, stock) =>
        sum + (stock.currentPrice - stock.buyPrice) * stock.quantity,
      0
    );

    const sortedByPerformance = [...stocks].sort(
      (a, b) =>
        (b.currentPrice - b.buyPrice) / b.buyPrice -
        (a.currentPrice - a.buyPrice) / a.buyPrice
    );

    setMetrics({
      totalValue,
      totalGainLoss,
      topPerformer: sortedByPerformance[0] || null,
      worstPerformer: sortedByPerformance[sortedByPerformance.length - 1] || null,
    });
  };

  const handleAddStock = (
    stockData: Omit<Stock, 'id' | 'currentPrice'>
  ) => {
    const newStock: Stock = {
      ...stockData,
      id: Date.now().toString(),
      currentPrice: stockData.buyPrice * 1.1, // Mock current price
    };
    setStocks([...stocks, newStock]);
    setShowForm(false);
  };

  const handleUpdateStock = (
    stockData: Omit<Stock, 'id' | 'currentPrice'>
  ) => {
    if (!editingStock) return;
    const updatedStock: Stock = {
      ...stockData,
      id: editingStock.id,
      currentPrice: editingStock.currentPrice,
    };
    setStocks(
      stocks.map((stock) =>
        stock.id === editingStock.id ? updatedStock : stock
      )
    );
    setEditingStock(null);
    setShowForm(false);
  };

  const handleDeleteStock = (id: string) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
  };

  const handleEditClick = (stock: Stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              Portfolio Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Stock
          </button>
        </div>

        <Dashboard stocks={stocks} metrics={metrics} />

        {showForm && (
          <div className="mb-8">
            <StockForm
              stock={editingStock || undefined}
              onSubmit={editingStock ? handleUpdateStock : handleAddStock}
              onCancel={() => {
                setShowForm(false);
                setEditingStock(null);
              }}
            />
          </div>
        )}

        <StockList
          stocks={stocks}
          onEdit={handleEditClick}
          onDelete={handleDeleteStock}
        />
      </div>
    </div>
  );
}

export default App;