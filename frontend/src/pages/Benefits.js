import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TYPE_LABEL = { central: '🇮🇳 Central', state: '📍 State' };
const TYPE_BADGE = { central: 'badge-blue', state: 'badge-green' };

function BenefitCard({ item, onOpen }) {
  const isSubsidy = item.benefit_type_group === 'subsidy';
  
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
            <span className={`badge ${TYPE_BADGE[item.type] || 'badge-blue'}`}>
              {TYPE_LABEL[item.type] || item.type}{item.state ? ` — ${item.state}` : ''}
            </span>
            <span className="tag" style={{ background: isSubsidy ? '#f3e5f5' : '#e3f2fd', color: isSubsidy ? '#7b1fa2' : '#1565c0' }}>
              {isSubsidy ? '🛠️ SUBSIDY' : '🏛️ SCHEME'}
            </span>
            <span className="tag">{item.category.replace(/_/g, ' ')}</span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{item.name}</h3>
          <p style={{ color: '#6b7280', fontSize: 13 }}>{item.short_name || item.full_name}</p>
        </div>
        
        {item.benefit_amount > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2d6a2d' }}>₹{item.benefit_amount.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>max benefit</div>
          </div>
        )}
        {isSubsidy && item.subsidy_percent && (
           <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: 22, fontWeight: 800, color: '#7b1fa2' }}>{item.subsidy_percent}%</div>
             <div style={{ fontSize: 11, color: '#9ca3af' }}>subsidy rate</div>
           </div>
        )}
      </div>

      <p style={{ fontSize: 14, color: '#374151', marginBottom: 12, lineHeight: 1.7 }}>
        {item.benefit || item.description}
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary btn-sm" onClick={() => onOpen(item)}>Details & Apply →</button>
        {item.apply_link && (
          <a href={item.apply_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1565c0' }}>Official Site ↗</a>
        )}
        {item.helpline && <span style={{ fontSize: 12, color: '#6b7280' }}>📞 {item.helpline}</span>}
      </div>
    </div>
  );
}

function BenefitModal({ item, onClose }) {
  if (!item) return null;
  const isSubsidy = item.benefit_type_group === 'subsidy';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 16, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`badge ${TYPE_BADGE[item.type] || 'badge-blue'}`}>{TYPE_LABEL[item.type] || item.type}</span>
            <span className="tag">{isSubsidy ? 'Subsidy' : 'Scheme'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', fontSize: 22, color: '#6b7280', padding: 0 }}>✕</button>
        </div>
        
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{item.name}</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>{item.full_name || item.description}</p>

        <div style={{ background: isSubsidy ? '#f3e5f5' : '#f0fdf4', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: isSubsidy ? '#7b1fa2' : '#2d6a2d', marginBottom: 6 }}>BENEFITS</div>
          <p style={{ fontSize: 15, color: '#1f2937', lineHeight: 1.6 }}>{item.benefit || item.description}</p>
          {isSubsidy && item.subsidy_percent && (
            <div style={{ marginTop: 10, fontWeight: 700, color: '#7b1fa2' }}>Subsidy Percentage: {item.subsidy_percent}%</div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>ELIGIBILITY</div>
          <p style={{ fontSize: 14, color: '#374151' }}>{item.eligibility?.description || 'All land-holding farmers'}</p>
          <ul style={{ fontSize: 14, color: '#374151', marginTop: 8, paddingLeft: 20 }}>
             {item.eligibility?.min_land_acres && <li>Min Land: {item.eligibility.min_land_acres} acres</li>}
             {item.eligibility?.farmer_types && <li>Farmer Types: {item.eligibility.farmer_types.join(', ')}</li>}
          </ul>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 10 }}>HOW TO APPLY</div>
          {item.apply_steps?.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>DOCUMENTS REQUIRED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {item.documents?.map(d => <span key={d} className="tag">{d}</span>)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {item.apply_link && (
            <a href={item.apply_link} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
              <button className="btn-primary" style={{ width: '100%' }}>Apply Online ↗</button>
            </a>
          )}
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Close</button>
        </div>
      </div>
    </div>
  );
}
function EligibilityChecker({ states, onResults, onClose }) {
  const [formData, setFormData] = useState({ state: '', land_acres: '', farmer_type: 'small' });
  const [checking, setChecking] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await axios.post(`${API_BASE}/benefits/check-eligibility`, formData);
      onResults(res.data.data);
    } catch (err) { console.error(err); }
    finally { setChecking(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, maxWidth: 450, width: '100%', padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>✨ Smart Eligibility Checker</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Enter your details to find schemes and subsidies you can apply for today.</p>
        
        <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>SELECT YOUR STATE</label>
            <select 
              required
              value={formData.state} 
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0' }}
            >
              <option value="">Choose State...</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>LAND HOLDING (IN ACRES)</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 2.5"
              value={formData.land_acres}
              onChange={e => setFormData({ ...formData, land_acres: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>FARMER CATEGORY</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['small', 'marginal', 'large'].map(t => (
                <button 
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, farmer_type: t })}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0',
                    background: formData.farmer_type === t ? '#2d6a2d' : 'white',
                    color: formData.farmer_type === t ? 'white' : '#64748b',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={checking}
            className="btn-primary" 
            style={{ width: '100%', marginTop: 10, padding: 14, fontSize: 16 }}
          >
            {checking ? 'Checking Database...' : 'Find My Benefits →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Benefits() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ states: [], categories: [] });
  const [filters, setFilters] = useState({ state: '', category: '', search: '', type: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showChecker, setShowChecker] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    if (!isFiltered) fetchBenefits();
  }, [filters.type, filters.state, filters.category]);

  useEffect(() => {
    fetchMeta();
  }, []);

  async function fetchMeta() {
    try {
      const res = await axios.get(`${API_BASE}/benefits/meta`);
      setMeta(res.data.data);
    } catch (e) { console.error(e); }
  }

  async function fetchBenefits() {
    setLoading(true);
    setIsFiltered(false);
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${API_BASE}/benefits?${params}`);
      setItems(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const handleCheckerResults = (results) => {
    setItems(results);
    setIsFiltered(true);
    setShowChecker(false);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleFilter = () => {
    setIsFiltered(false);
    fetchBenefits();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1>🏛️ Schemes & Subsidies</h1>
          <p>Unified portal for all government financial benefits for farmers</p>
        </div>
        <button 
          onClick={() => setShowChecker(true)}
          style={{ background: 'linear-gradient(135deg, #2d6a2d 0%, #1a4d1a 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(45,106,45,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span>✨ Check My Eligibility</span>
        </button>
      </div>

      {isFiltered && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#166534', fontSize: 14, fontWeight: 600 }}>
            🎯 Showing {items.length} benefits based on your eligibility criteria
          </div>
          <button onClick={handleFilter} style={{ background: '#2d6a2d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Clear Results</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div 
          onClick={() => setFilters(f => ({ ...f, type: '' }))}
          style={{ background: filters.type === '' ? '#e8f5e9' : 'white', border: filters.type === '' ? '2px solid #2d6a2d' : '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', flex: 1, minWidth: 150, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Total Benefits</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2d6a2d' }}>{items.length}</div>
          <div style={{ fontSize: 10, color: '#2d6a2d', fontWeight: 600, marginTop: 4 }}>{filters.type === '' ? '● Currently Viewing' : 'Click to view all'}</div>
        </div>
        <div 
          onClick={() => setFilters(f => ({ ...f, type: 'scheme' }))}
          style={{ background: filters.type === 'scheme' ? '#e3f2fd' : 'white', border: filters.type === 'scheme' ? '2px solid #1565c0' : '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', flex: 1, minWidth: 150, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>🏛️ Govt Schemes</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1565c0' }}>{items.filter(i => i.benefit_type_group === 'scheme').length}</div>
          <div style={{ fontSize: 10, color: '#1565c0', fontWeight: 600, marginTop: 4 }}>{filters.type === 'scheme' ? '● Currently Viewing' : 'Click to filter'}</div>
        </div>
        <div 
          onClick={() => setFilters(f => ({ ...f, type: 'subsidy' }))}
          style={{ background: filters.type === 'subsidy' ? '#f3e5f5' : 'white', border: filters.type === 'subsidy' ? '2px solid #7b1fa2' : '1px solid #e5e7eb', borderRadius: 12, padding: '12px 20px', flex: 1, minWidth: 150, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>🛠️ Capital Subsidies</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#7b1fa2' }}>{items.filter(i => i.benefit_type_group === 'subsidy').length}</div>
          <div style={{ fontSize: 10, color: '#7b1fa2', fontWeight: 600, marginTop: 4 }}>{filters.type === 'subsidy' ? '● Currently Viewing' : 'Click to filter'}</div>
        </div>
      </div>

      {/* Segregation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, gap: 30 }}>
        <button 
          onClick={() => setFilters(f => ({ ...f, type: '' }))}
          style={{ background: 'none', border: 'none', padding: '12px 4px', fontSize: 15, fontWeight: filters.type === '' ? 700 : 500, color: filters.type === '' ? '#2d6a2d' : '#6b7280', borderBottom: filters.type === '' ? '3px solid #2d6a2d' : '3px solid transparent', cursor: 'pointer' }}>
          All Benefits
        </button>
        <button 
          onClick={() => setFilters(f => ({ ...f, type: 'scheme' }))}
          style={{ background: 'none', border: 'none', padding: '12px 4px', fontSize: 15, fontWeight: filters.type === 'scheme' ? 700 : 500, color: filters.type === 'scheme' ? '#1565c0' : '#6b7280', borderBottom: filters.type === 'scheme' ? '3px solid #1565c0' : '3px solid transparent', cursor: 'pointer' }}>
          🏛️ Government Schemes
        </button>
        <button 
          onClick={() => setFilters(f => ({ ...f, type: 'subsidy' }))}
          style={{ background: 'none', border: 'none', padding: '12px 4px', fontSize: 15, fontWeight: filters.type === 'subsidy' ? 700 : 500, color: filters.type === 'subsidy' ? '#7b1fa2' : '#6b7280', borderBottom: filters.type === 'subsidy' ? '3px solid #7b1fa2' : '3px solid transparent', cursor: 'pointer' }}>
          🛠️ Capital Subsidies
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <input 
          placeholder="Search by name or benefit..." 
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && fetchBenefits()}
          style={{ flex: 1 }}
        />
        <select value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}>
          <option value="">All States</option>
          {meta.states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {meta.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button className="btn-primary" onClick={handleFilter}>Search</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
          <p>Loading benefits list...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
           <h3>No benefits found</h3>
           <p>Try matching with different filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {items.map((item, idx) => (
            <BenefitCard key={item.id || idx} item={item} onOpen={setSelectedItem} />
          ))}
        </div>
      )}

      <BenefitModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      
      {showChecker && (
        <EligibilityChecker 
          states={meta.states} 
          onResults={handleCheckerResults}
          onClose={() => setShowChecker(false)} 
        />
      )}
    </div>
  );
}
