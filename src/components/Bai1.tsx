import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Bai1.css';

interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  area?: number;
  timezones?: string[];
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  borders?: string[];
  cca3: string;
}

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Country[]>(
          'https://restcountries.com/v3.1/all?fields=name,flags,population,region,cca3'
        );
        const sortedCountries = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Không thể tải dữ liệu quốc gia. Vui lòng thử lại!');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const formatPopulation = (pop: number): string => {
    return pop.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="country-list-container">
      <div className="country-list-wrapper">
        <div className="page-header">
          <h1 className="page-title">🌍 Tra cứu Quốc gia</h1>
          <p className="page-subtitle">
            Khám phá thông tin về {countries.length} quốc gia trên thế giới
          </p>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm quốc gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <p className="search-result-count">
            Tìm thấy {filteredCountries.length} quốc gia
          </p>
        </div>
        {filteredCountries.length > 0 ? (
          <div className="country-grid">
            {filteredCountries.map((country) => (
              <Link
                key={country.cca3}
                to={`/country/${country.cca3}`}
                className="country-card"
              >
                <div className="country-flag-container">
                  <img
                    src={country.flags.png}
                    alt={country.flags.alt || `Quốc kỳ ${country.name.common}`}
                    className="country-flag"
                  />
                </div>
                <div className="country-info">
                  <h3 className="country-name">{country.name.common}</h3>
                  <div className="country-details">
                    <p className="country-detail-item">
                      <span className="country-detail-label">👥 Dân số:</span>{' '}
                      {formatPopulation(country.population)}
                    </p>
                    <p className="country-detail-item">
                      <span className="country-detail-label">🌏 Khu vực:</span>{' '}
                      {country.region}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">
              Không tìm thấy quốc gia nào phù hợp với "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CountryDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountryDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Country[]>(
          `https://restcountries.com/v3.1/alpha/${code}`
        );
        if (response.data && response.data.length > 0) {
          setCountry(response.data[0]);
        } else {
          setError('Không tìm thấy thông tin quốc gia');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching country detail:', err);
        setError('Không thể tải thông tin chi tiết. Vui lòng thử lại!');
        setLoading(false);
      }
    };

    if (code) {
      fetchCountryDetail();
    }
  }, [code]);

  const formatPopulation = (pop: number): string => {
    return pop.toLocaleString('vi-VN');
  };

  const formatArea = (area: number): string => {
    return `${area.toLocaleString('vi-VN')} km²`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="error-container">
        <div className="error-box">
          <p className="error-text">{error}</p>
          <button onClick={() => navigate('/')} className="error-button">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="country-detail-container">
      <div className="country-detail-wrapper">
        <button onClick={() => navigate('/')} className="back-button">
          ← Quay lại danh sách
        </button>
        <div className="detail-card">
          <div className="detail-flag-container">
            <img
              src={country.flags.svg}
              alt={country.flags.alt || `Quốc kỳ ${country.name.common}`}
              className="detail-flag"
            />
          </div>
          <div className="detail-content">
            <h1 className="detail-country-name">{country.name.common}</h1>
            <p className="detail-official-name">{country.name.official}</p>
            <div className="detail-info-grid">
              <div className="info-column">
                <InfoCard
                  icon="👥"
                  label="Dân số"
                  value={formatPopulation(country.population)}
                />
                <InfoCard
                  icon="🌏"
                  label="Khu vực"
                  value={country.region}
                />
                <InfoCard
                  icon="📍"
                  label="Tiểu vùng"
                  value={country.subregion || 'N/A'}
                />
                <InfoCard
                  icon="🏛️"
                  label="Thủ đô"
                  value={country.capital?.[0] || 'N/A'}
                />
              </div>
              <div className="info-column">
                <InfoCard
                  icon="📏"
                  label="Diện tích"
                  value={country.area ? formatArea(country.area) : 'N/A'}
                />
                <InfoCard
                  icon="🕐"
                  label="Múi giờ"
                  value={country.timezones?.[0] || 'N/A'}
                />
                <InfoCard
                  icon="💬"
                  label="Ngôn ngữ"
                  value={
                    country.languages
                      ? Object.values(country.languages).join(', ')
                      : 'N/A'
                  }
                />
                <InfoCard
                  icon="💰"
                  label="Tiền tệ"
                  value={
                    country.currencies
                      ? Object.values(country.currencies)
                          .map((c) => `${c.name} (${c.symbol})`)
                          .join(', ')
                      : 'N/A'
                  }
                />
              </div>
            </div>
            {country.borders && country.borders.length > 0 && (
              <div className="borders-section">
                <h3 className="borders-title">
                  🗺️ Quốc gia giáp biên ({country.borders.length}):
                </h3>
                <div className="borders-list">
                  {country.borders.map((border) => (
                    <span key={border} className="border-badge">
                      {border}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: string;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="info-card">
    <div className="info-card-header">
      <span className="info-icon">{icon}</span>
      <p className="info-label">{label}</p>
    </div>
    <p className="info-value">{value}</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CountryList />} />
      <Route path="/country/:code" element={<CountryDetail />} />
    </Routes>
  );
};
export default App;