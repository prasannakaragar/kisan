import React, { useState } from 'react';

// ─── State/District Data ─────────────────────────────────────────────────────
const STATES_DATA = {
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli-Dharwad', 'Belagavi', 'Raichur', 'Davangere', 'Bellary', 'Shimoga', 'Tumkur', 'Gulbarga'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Kolhapur', 'Aurangabad', 'Solapur', 'Satara', 'Sangli', 'Ahmednagar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Ratlam', 'Hoshangabad', 'Chhindwara'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Agra', 'Kanpur', 'Allahabad', 'Meerut', 'Bareilly', 'Gorakhpur', 'Jhansi', 'Mathura'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur', 'Sikar', 'Bhilwara'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Thanjavur', 'Dindigul', 'Vellore'],
  'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam', 'Guntur', 'Kurnool', 'Tirupati', 'Nellore', 'Anantapur', 'Kadapa', 'Ongole', 'Eluru'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Junagadh', 'Bhavnagar', 'Mehsana', 'Gandhinagar', 'Anand', 'Kutch'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Sangrur', 'Moga', 'Ferozepur', 'Hoshiarpur'],
  'Haryana': ['Karnal', 'Hisar', 'Sirsa', 'Panipat', 'Ambala', 'Rohtak', 'Sonipat', 'Kurukshetra', 'Jind', 'Fatehabad'],
  'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Mahbubnagar', 'Medak', 'Adilabad', 'Rangareddy'],
  'West Bengal': ['Kolkata', 'Bardhaman', 'Hooghly', 'Midnapore', 'Nadia', 'Murshidabad', 'Malda', 'Jalpaiguri', 'Howrah', 'Bankura'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Purnia', 'Darbhanga', 'Begusarai', 'Samastipur', 'Nalanda', 'Vaishali'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Sambalpur', 'Berhampur', 'Rourkela', 'Balasore', 'Puri', 'Koraput', 'Kalahandi', 'Mayurbhanj'],
};

// ─── Buyer Categories ────────────────────────────────────────────────────────
const GOVT_BUYERS = [
  { name: 'APMC / Agricultural Produce Market Committee', type: 'Government', icon: '🏛️', desc: 'Official government-regulated mandis. Fair weighing, transparent auction, MSP guaranteed for notified crops.', benefits: ['MSP price guarantee', 'Regulated weighing', 'Payment within 3 days', 'Dispute resolution'], link: 'https://agmarknet.gov.in', tag: 'Most Trusted' },
  { name: 'FCI — Food Corporation of India', type: 'Central Govt', icon: '🇮🇳', desc: 'India\'s largest food grain procurement agency. Buys wheat, rice, and coarse grains at MSP during Rabi & Kharif seasons.', benefits: ['100% MSP guaranteed', 'Direct bank payment', 'No middlemen', 'Procurement at doorstep in some states'], link: 'https://fci.gov.in', tag: 'MSP Guaranteed' },
  { name: 'NAFED — National Agricultural Cooperative', type: 'Central Govt', icon: '🤝', desc: 'Procures oilseeds, pulses, and other crops under Price Support Scheme (PSS). Active during harvest seasons.', benefits: ['PSS price support', 'Cooperative model', 'Covers 25+ crops', 'State-level procurement centers'], link: 'https://www.nafed-india.com', tag: 'Cooperative' },
  { name: 'State Civil Supplies Corporation', type: 'State Govt', icon: '🏢', desc: 'Each state has its own procurement agency — KFCSC (Karnataka), TNCSC (Tamil Nadu), PSCSC (Punjab), etc.', benefits: ['State MSP (often higher)', 'Local procurement centers', 'Quick payments', 'Bonus over central MSP'], link: '#', tag: 'State Level' },
  { name: 'e-NAM — National Agriculture Market', type: 'Central Govt', icon: '💻', desc: 'Online trading platform connecting APMC mandis across India. Sell to buyers in any state from your local mandi.', benefits: ['Pan-India market access', 'Transparent bidding', 'Better price discovery', 'Reduced middlemen'], link: 'https://enam.gov.in', tag: 'Online Platform' },
  { name: 'Tribal Cooperative (TRIFED)', type: 'Central Govt', icon: '🌿', desc: 'Procures minor forest produce, organic products, and tribal agricultural produce at fair prices.', benefits: ['Fair trade prices', 'Organic premium', 'Van Dhan Kendras', 'Direct tribal support'], link: 'https://trifed.tribal.gov.in', tag: 'Tribal Farmers' },
];

const PRIVATE_BUYERS = [
  { name: 'ITC e-Choupal / ABD', type: 'Corporate', icon: '🏭', desc: 'ITC\'s direct farmer procurement for wheat, soy, coffee, spices, and more. Fair pricing, quality premium.', benefits: ['Quality-based premium', 'Direct procurement', 'Free soil testing', 'Real-time price info'], crops: 'Wheat, Soy, Coffee, Spices, Shrimp', tag: 'Premium Price' },
  { name: 'Reliance Fresh / JioMart', type: 'Corporate', icon: '🛒', desc: 'Direct farm-to-retail procurement for fruits, vegetables, and fresh produce. Collection centers in major districts.', benefits: ['Daily procurement', 'Collection center pickup', 'Fast payment (24-48 hrs)', 'Grade-based pricing'], crops: 'Fruits, Vegetables, Fresh Produce', tag: 'Quick Payment' },
  { name: 'BigBasket / Tata Group', type: 'Corporate', icon: '📦', desc: 'Large-scale procurement of fresh produce for online retail. Works with FPOs and individual farmers.', benefits: ['Consistent demand', 'FPO partnerships', 'Supply contracts', 'Technology support'], crops: 'Vegetables, Fruits, Dairy, Staples', tag: 'Steady Demand' },
  { name: 'Adani Wilmar (Fortune)', type: 'Corporate', icon: '🛢️', desc: 'Major buyer of oilseeds, wheat, rice, and pulses for processing. Procurement through mandis and direct purchase.', benefits: ['Bulk purchase', 'Processing contracts', 'Transport support', 'Competitive pricing'], crops: 'Mustard, Soy, Groundnut, Wheat, Rice', tag: 'Bulk Buyer' },
  { name: 'Cargill India', type: 'MNC', icon: '🌍', desc: 'Global agri-commodity buyer. Procures grains, oilseeds, and cotton. Contract farming available.', benefits: ['Contract farming', 'Global market access', 'Price lock options', 'Input support'], crops: 'Wheat, Corn, Soy, Cotton, Barley', tag: 'Contract Farming' },
  { name: 'Ninjacart / WayCool', type: 'AgriTech', icon: '🚀', desc: 'Tech-enabled fresh produce supply chain. Direct procurement from farms with app-based ordering.', benefits: ['App-based selling', 'Farm pickup', 'Same-day payment', 'No commission'], crops: 'Vegetables, Fruits, Leafy Greens', tag: 'Tech-Enabled' },
  { name: 'DeHaat / AgroStar', type: 'AgriTech', icon: '📱', desc: 'Full-stack agri platforms connecting farmers to buyers. Input supply + output purchase in one platform.', benefits: ['End-to-end support', 'Input + Output market', 'Advisory services', 'Micro-enterprise'], crops: 'All Crops, Inputs', tag: 'Full Platform' },
  { name: 'Local Flour Mills & Dal Mills', type: 'Local', icon: '🏭', desc: 'Local processing units that buy wheat, rice, pulses directly from farmers. Usually offer competitive prices for quality produce.', benefits: ['No transport cost', 'Immediate payment', 'Relationship-based', 'Flexible quantities'], crops: 'Wheat, Rice, Pulses, Millets', tag: 'Nearby' },
];

const EXPORT_BUYERS = [
  { name: 'APEDA — Agricultural Export Authority', type: 'Government', icon: '✈️', desc: 'Government body that facilitates agricultural exports. Connects farmers and FPOs with international buyers.', benefits: ['Export subsidies', 'Quality certification help', 'International buyer connects', 'Training programs'], link: 'https://apeda.gov.in', tag: 'Export Support' },
  { name: 'MPEDA — Marine Products Export', type: 'Government', icon: '🐟', desc: 'For fishermen and aquaculture farmers. Facilitates export of shrimp, fish, and marine products.', benefits: ['Export infrastructure', 'Quality labs', 'Buyer-seller meets', 'Subsidy schemes'], link: 'https://mpeda.gov.in', tag: 'Seafood Export' },
  { name: 'Spices Board India', type: 'Government', icon: '🌶️', desc: 'Promotes export of Indian spices. Quality certification, buyer connections, and e-auction platform.', benefits: ['Quality certification', 'E-auction platform', 'Brand building', 'Export promotion'], link: 'https://www.indianspices.com', tag: 'Spice Farmers' },
];

function BuyerCard({ buyer, accent }) {
  return (
    <div style={{
      background: 'white', borderRadius: 14, border: '1px solid #e5e7eb',
      padding: '20px', transition: 'all 0.2s', cursor: 'default',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {buyer.icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{buyer.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{buyer.type}</div>
          </div>
        </div>
        <span style={{ background: accent + '18', color: accent, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
          {buyer.tag}
        </span>
      </div>
      <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, marginBottom: 14 }}>{buyer.desc}</p>
      {buyer.crops && (
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🌾</span> <strong>Crops:</strong> {buyer.crops}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: buyer.link ? 14 : 0 }}>
        {buyer.benefits.map((b, i) => (
          <span key={i} style={{ background: '#f3f4f6', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
            ✅ {b}
          </span>
        ))}
      </div>
      {buyer.link && buyer.link !== '#' && (
        <a href={buyer.link} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: accent, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          🔗 Visit Official Website →
        </a>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CropBuyers() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeTab, setActiveTab] = useState('govt');
  const [selectedCrop, setSelectedCrop] = useState('');

  const districts = selectedState ? STATES_DATA[selectedState] || [] : [];

  const CROP_FILTER = ['All', 'Wheat', 'Rice', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Cotton', 'Spices', 'Sugarcane'];

  const tabs = [
    { id: 'govt', label: '🏛️ Government & APMC', count: GOVT_BUYERS.length },
    { id: 'private', label: '🏢 Private Companies', count: PRIVATE_BUYERS.length },
    { id: 'export', label: '✈️ Export Channels', count: EXPORT_BUYERS.length },
  ];

  const filteredPrivate = selectedCrop && selectedCrop !== 'All'
    ? PRIVATE_BUYERS.filter(b => b.crops && b.crops.toLowerCase().includes(selectedCrop.toLowerCase()))
    : PRIVATE_BUYERS;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
        borderRadius: 18, padding: '40px 28px', color: 'white', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 99 }}>
              🤝 Direct Buyer Connect · No Middlemen
            </div>
            <div style={{ fontSize: 11, background: '#ea580c', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.3)' }}>
              🏛️ Govt + Private + Export
            </div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
            🏪 Crop Buyers & Tenders
          </h1>
          <p style={{ fontSize: 14, opacity: 0.9, maxWidth: 540, lineHeight: 1.7 }}>
            Find the best buyers for your crops — Government APMC mandis, FCI, private companies like ITC, Reliance, BigBasket, and export channels. Sell at the best price near your location.
          </p>
        </div>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 140, opacity: 0.06 }}>🏪</div>
      </div>

      {/* Location Selector */}
      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #e5e7eb',
        padding: '20px 24px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          📍 Select Your Location
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 6 }}>State</label>
            <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, color: '#1f2937', background: 'white', cursor: 'pointer' }}>
              <option value="">— Select State —</option>
              {Object.keys(STATES_DATA).sort().map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 6 }}>District</label>
            <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, color: selectedState ? '#1f2937' : '#9ca3af', background: 'white', cursor: selectedState ? 'pointer' : 'not-allowed' }}>
              <option value="">— Select District —</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {selectedState && selectedDistrict && (
          <div style={{ marginTop: 14, padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
            ✅ Showing buyers available in <strong>{selectedDistrict}, {selectedState}</strong>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#1f2937' : 'white',
              color: activeTab === tab.id ? 'white' : '#374151',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
            }}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Crop filter for private */}
      {activeTab === 'private' && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {CROP_FILTER.map(crop => (
            <button key={crop} onClick={() => setSelectedCrop(crop === 'All' ? '' : crop)}
              style={{
                padding: '6px 14px', borderRadius: 99, border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
                background: (selectedCrop === crop || (!selectedCrop && crop === 'All')) ? '#ea580c' : 'white',
                color: (selectedCrop === crop || (!selectedCrop && crop === 'All')) ? 'white' : '#374151',
              }}>
              {crop}
            </button>
          ))}
        </div>
      )}

      {/* Buyer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 32 }} className="buyers-grid">
        {activeTab === 'govt' && GOVT_BUYERS.map((b, i) => <BuyerCard key={i} buyer={b} accent="#1565c0" />)}
        {activeTab === 'private' && filteredPrivate.map((b, i) => <BuyerCard key={i} buyer={b} accent="#ea580c" />)}
        {activeTab === 'export' && EXPORT_BUYERS.map((b, i) => <BuyerCard key={i} buyer={b} accent="#7c3aed" />)}
      </div>

      {/* MSP Info Box */}
      <div style={{
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16,
        padding: '24px 28px', marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e40af', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          💡 What is MSP? (Minimum Support Price)
        </h3>
        <p style={{ fontSize: 13, color: '#1e3a5f', lineHeight: 1.8, marginBottom: 12 }}>
          MSP is the price set by the Government of India at which it will buy crops from farmers. This protects farmers from price crashes. FCI and state agencies buy at MSP during procurement seasons.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { crop: '🌾 Wheat', price: '₹2,275/qtl' },
            { crop: '🍚 Rice (Paddy)', price: '₹2,300/qtl' },
            { crop: '🌻 Mustard', price: '₹5,650/qtl' },
            { crop: '🫘 Moong Dal', price: '₹8,558/qtl' },
            { crop: '🥜 Groundnut', price: '₹6,377/qtl' },
            { crop: '🌽 Maize', price: '₹2,090/qtl' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{item.crop}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e40af' }}>{item.price}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: '#6b7280' }}>* MSP rates for Kharif/Rabi 2025-26 season. Actual rates may vary.</div>
      </div>

      {/* Tips */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '20px 24px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 10 }}>💡 Tips for Getting the Best Price</h3>
        <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#78350f', lineHeight: 2 }}>
          <li>Always check prices at 2-3 mandis before selling</li>
          <li>Register on e-NAM for access to buyers across India</li>
          <li>Join or form an FPO (Farmer Producer Organization) for better bargaining power</li>
          <li>Grade and sort your produce — quality produce gets 10-20% premium</li>
          <li>Know the MSP before selling — never sell below government support price</li>
          <li>Consider contract farming with companies like ITC/Cargill for price security</li>
        </ul>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .buyers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
