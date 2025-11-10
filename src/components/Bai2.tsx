import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Bai2.css';

// Interfaces TypeScript
interface ExchangeRates {
  rates: Record<string, number>;
  base: string;
  date: string;
}

interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount?: number;
  rate?: number;
}

interface CurrencyData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  date: string;
}

// API Service
class CurrencyApiService {
  static async getExchangeRates(baseCurrency: string): Promise<ExchangeRates> {
    try {
      const response = await axios.get<CurrencyData>(`https://open.er-api.com/v6/latest/${baseCurrency}`);
      
      if (response.data && response.data.rates) {
        return {
          rates: response.data.rates,
          base: response.data.base,
          date: response.data.date
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch exchange rates: ${error.message}`);
      }
      throw new Error('Failed to fetch exchange rates');
    }
  }

  static async convertCurrency(
    fromCurrency: string, 
    toCurrency: string, 
    amount: number
  ): Promise<{ convertedAmount: number; rate: number }> {
    const exchangeRates = await this.getExchangeRates(fromCurrency);
    
    const rate = exchangeRates.rates[toCurrency];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }
    
    const convertedAmount = amount * rate;
    
    return {
      convertedAmount: Number(convertedAmount.toFixed(4)),
      rate: Number(rate.toFixed(6))
    };
  }
}

// Currency Converter Component
const CurrencyConverter: React.FC = () => {
  const [conversion, setConversion] = useState<CurrencyConversion>({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: 1
  });
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch available currencies when component mounts
  useEffect(() => {
    fetchCurrencies('USD');
  }, []);

  const fetchCurrencies = async (baseCurrency: string) => {
    try {
      setLoading(true);
      setError('');
      const exchangeRates = await CurrencyApiService.getExchangeRates(baseCurrency);
      const currencyList = Object.keys(exchangeRates.rates);
      setCurrencies(currencyList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!conversion.amount || conversion.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await CurrencyApiService.convertCurrency(
        conversion.fromCurrency,
        conversion.toCurrency,
        conversion.amount
      );

      setConversion(prev => ({
        ...prev,
        convertedAmount: result.convertedAmount,
        rate: result.rate
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFromCurrency = e.target.value;
    setConversion(prev => ({ ...prev, fromCurrency: newFromCurrency }));
    fetchCurrencies(newFromCurrency);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConversion(prev => ({ ...prev, toCurrency: e.target.value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setConversion(prev => ({ ...prev, amount }));
  };

  const swapCurrencies = () => {
    setConversion(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
    fetchCurrencies(conversion.toCurrency);
  };

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="converter-form">
        <div className="input-group">
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            value={conversion.amount}
            onChange={handleAmountChange}
            min="0"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        <div className="currency-selection">
          <div className="input-group">
            <label htmlFor="fromCurrency">From:</label>
            <select
              id="fromCurrency"
              value={conversion.fromCurrency}
              onChange={handleFromCurrencyChange}
              disabled={loading}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="button" 
            onClick={swapCurrencies}
            className="swap-button"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              height: 'fit-content'
            }}
          >
            ⇄
          </button>

          <div className="input-group">
            <label htmlFor="toCurrency">To:</label>
            <select
              id="toCurrency"
              value={conversion.toCurrency}
              onChange={handleToCurrencyChange}
              disabled={loading}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleConvert} 
          disabled={loading}
          className="convert-button"
          style={{
            padding: '1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>

        {conversion.convertedAmount !== undefined && conversion.rate !== undefined && (
          <div className="conversion-result" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '4px',
            borderLeft: '4px solid #007bff',
            marginTop: '1rem'
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Conversion Result:</h2>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              {conversion.amount} {conversion.fromCurrency} = 
              <strong> {conversion.convertedAmount} {conversion.toCurrency}</strong>
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              Exchange Rate: 1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const App1: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <nav style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link 
          to="/" 
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            color: '#007bff' 
          }}
        >
          Currency Converter
        </Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<CurrencyConverter />} />
        </Routes>
      </main>
    </div>
  );
};

export default App1;