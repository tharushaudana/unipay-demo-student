import React, { useState, useEffect } from 'react';
import { 
  Home, PieChart, User, QrCode, Send, Wallet, 
  ChevronLeft, CheckCircle2, Building2, Coffee, 
  Utensils, ArrowRightLeft, Camera, LogOut, Bell
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_BALANCE = 5000.00;
const VIRTUAL_ACCOUNT_NO = "VA-8492-3310-9941";
const STUDENT_USER = {
  name: "Alex Johnson",
  studentId: "STU-2023-891",
  university: "University of Moratuwa"
};

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'payment', merchant: 'Goda Canteen', amount: 250.00, date: 'Today, 09:15 AM', category: 'Food & Drink' },
  { id: 2, type: 'split', merchant: 'Split with Sarah (Pizza)', amount: 800.00, date: 'Yesterday, 08:30 PM', category: 'Split' },
  { id: 3, type: 'payment', merchant: 'University Bookstore', amount: 1200.00, date: 'Mon, 02:00 PM', category: 'Education' },
];

const UNIVERSITIES = [
  "University of Moratuwa", 
  "University of Colombo", 
  "University of Peradeniya", 
  "University of Sri Jayewardenepura", 
  "University of Kelaniya", 
  "University of Ruhuna", 
  "SLIIT",
  "NSBM Green University"
];
const CANTEENS = ["Goda Canteen", "Wala Canteen", "Staff Canteen", "L Canteen", "Main Cafeteria", "Engineering Block Cafe"];
const RESTAURANTS = ["Burger Joint", "Sushi Express", "The Vegan Bowl", "Taco Stand"];

export default function App() {
  // --- APP STATE ---
  const [currentView, setCurrentView] = useState('login'); // login, dashboard, campus_pay, off_campus_pay, qr_pay, split, success, analytics, profile
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // --- HELPER FUNCTIONS ---
  const handlePayment = (merchant, amount, category = 'General') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (numAmount > balance) {
      alert("Insufficient balance.");
      return;
    }

    // Process payment
    setBalance(prev => prev - numAmount);
    
    const now = new Date();
    const dateString = `${now.toLocaleDateString('en-US', { weekday: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    const newTx = {
      id: Date.now(),
      type: 'payment',
      merchant,
      amount: numAmount,
      date: dateString,
      category
    };
    
    setTransactions([newTx, ...transactions]);
    setPaymentDetails({ ...newTx, time: now.toLocaleTimeString() });
    setCurrentView('success');
  };

  // --- VIEWS ---

  const LoginView = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-screen p-8 bg-indigo-600 text-white">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg rotate-12">
        <Wallet size={48} className="text-indigo-600 -rotate-12" />
      </div>
      <h1 className="text-4xl font-bold mb-2">UniPay</h1>
      <p className="text-indigo-200 text-center mb-12">The smart way to spend on & off campus.</p>
      
      <div className="w-full max-w-md space-y-4">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          Sign In as Student
        </button>
        <button className="w-full bg-indigo-700 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-800 transition-colors">
          Register
        </button>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 pb-24 rounded-b-[40px] relative">
        <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
          <div>
            <p className="text-indigo-200 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold">{STUDENT_USER.name}</h2>
          </div>
          <button className="bg-indigo-500 p-2 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-indigo-500"></span>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 -mt-16 w-full max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100">
          <p className="text-gray-500 text-sm mb-1">Available Voucher Balance</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">LKR {balance.toFixed(2)}</h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentView('qr_pay')}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
            >
              <QrCode size={18} /> Scan QR
            </button>
            <button 
              onClick={() => setCurrentView('split')}
              className="flex-1 bg-indigo-50 text-indigo-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 transition"
            >
              <ArrowRightLeft size={18} /> Split Bill
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 w-full max-w-4xl mx-auto">
        <h3 className="font-bold text-gray-800 mb-4">Transfer & Pay</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentView('campus_pay')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <span className="font-medium text-sm text-gray-700">Campus Pay</span>
          </button>
          <button 
            onClick={() => setCurrentView('off_campus_pay')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <span className="font-medium text-sm text-gray-700">Off-Campus</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Recent Activity</h3>
          <button className="text-indigo-600 text-sm font-medium">See all</button>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                  {tx.category === 'Food & Drink' ? <Coffee size={18} /> : 
                   tx.category === 'Split' ? <ArrowRightLeft size={18} /> : 
                   <Wallet size={18} />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{tx.merchant}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">-LKR {tx.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CampusPayView = () => {
    const [uni, setUni] = useState(UNIVERSITIES[0]);
    const [canteen, setCanteen] = useState('');
    const [amount, setAmount] = useState('');

    return (
      <div className="flex flex-col h-full bg-white min-h-screen">
        <Header title="Campus Pay" onBack={() => setCurrentView('dashboard')} />
        <div className="p-6 flex-1 w-full max-w-2xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">Pay directly to university merchants and canteens.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select University</label>
              <select 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={uni} onChange={e => setUni(e.target.value)}
              >
                {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Canteen/Merchant</label>
              <select 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={canteen} onChange={e => setCanteen(e.target.value)}
              >
                <option value="" disabled>Select a location...</option>
                {CANTEENS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 w-full max-w-2xl mx-auto">
          <button 
            disabled={!canteen || !amount}
            onClick={() => handlePayment(`${uni} - ${canteen}`, amount, 'Food & Drink')}
            className="w-full bg-indigo-600 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    );
  };

  const OffCampusPayView = () => {
    const [restaurant, setRestaurant] = useState('');
    const [amount, setAmount] = useState('');

    return (
      <div className="flex flex-col h-full bg-white min-h-screen">
        <Header title="Off-Campus Pay" onBack={() => setCurrentView('dashboard')} />
        <div className="p-6 flex-1 w-full max-w-2xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">Pay at partnered local restaurants and stores.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Partner Restaurant</label>
              <select 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={restaurant} onChange={e => setRestaurant(e.target.value)}
              >
                <option value="" disabled>Select a restaurant...</option>
                {RESTAURANTS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 w-full max-w-2xl mx-auto">
          <button 
            disabled={!restaurant || !amount}
            onClick={() => handlePayment(restaurant, amount, 'Food & Drink')}
            className="w-full bg-indigo-600 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    );
  };

  const QrScanView = () => {
    const [amount, setAmount] = useState('');
    const [scanned, setScanned] = useState(false);

    return (
      <div className="flex flex-col h-full bg-black min-h-screen">
        <div className="p-4 flex items-center text-white relative w-full max-w-2xl mx-auto">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 z-10"><ChevronLeft size={24} /></button>
          <h2 className="text-lg font-bold flex-1 text-center absolute w-full left-0 z-0">Scan to Pay</h2>
        </div>
        
        <div className="flex-1 relative flex flex-col items-center justify-center px-6 w-full max-w-2xl mx-auto">
          {/* Simulated Camera Viewfinder */}
          <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative mb-8 overflow-hidden bg-gray-900 flex items-center justify-center">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl"></div>
            
            {!scanned ? (
              <div className="text-center text-white/50 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setScanned(true)}>
                <Camera size={32} />
                <span className="text-sm font-medium">Tap to simulate scan</span>
              </div>
            ) : (
              <div className="bg-indigo-500/20 w-full h-full flex items-center justify-center flex-col animate-pulse">
                <CheckCircle2 className="text-indigo-400 mb-2" size={40} />
                <span className="text-white font-bold">Merchant Detected</span>
                <span className="text-indigo-200 text-sm">Goda Canteen</span>
              </div>
            )}
          </div>

          {scanned && (
             <div className="w-full bg-white rounded-3xl p-6 animate-in slide-in-from-bottom-10">
                <p className="text-center text-gray-500 mb-4 font-medium">Enter amount for Goda Canteen</p>
                <input 
                  type="number" 
                  placeholder="LKR 0.00" 
                  className="w-full text-center p-4 bg-gray-50 rounded-2xl text-4xl font-extrabold text-gray-900 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  autoFocus
                />
                <button 
                  disabled={!amount}
                  onClick={() => handlePayment('Goda Canteen (QR)', amount, 'Food & Drink')}
                  className="w-full bg-indigo-600 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
                >
                  Confirm Payment
                </button>
             </div>
          )}
        </div>
      </div>
    );
  };

  const SplitBillView = () => {
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState('');

    return (
      <div className="flex flex-col h-full bg-white min-h-screen">
        <Header title="Split Bill" onBack={() => setCurrentView('dashboard')} />
        <div className="p-6 flex-1 w-full max-w-2xl mx-auto">
          <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-4 mb-8">
            <div className="bg-white p-3 rounded-full text-indigo-600 shadow-sm">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Peer-to-Peer Split</h3>
              <p className="text-sm text-indigo-600">Send money instantly using Student ID</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Student ID</label>
              <input 
                type="text" 
                placeholder="e.g. STU-2024-123" 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                value={studentId} onChange={e => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Send (LKR)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 w-full max-w-2xl mx-auto">
          <button 
            disabled={!studentId || !amount}
            onClick={() => handlePayment(`Split with ${studentId.toUpperCase()}`, amount, 'Split')}
            className="w-full bg-indigo-600 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors"
          >
            Send Funds
          </button>
        </div>
      </div>
    );
  };

  const SuccessView = () => (
    <div className="flex flex-col h-full bg-indigo-600 text-white relative justify-center items-center p-8 min-h-screen overflow-hidden">
      <div className="bg-white/10 w-64 h-64 rounded-full absolute -top-10 -right-10 blur-3xl"></div>
      <div className="bg-white/10 w-64 h-64 rounded-full absolute -bottom-10 -left-10 blur-3xl"></div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 animate-bounce">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold mb-1 relative z-10">Payment Successful!</h2>
        <p className="text-indigo-200 mb-8 relative z-10 text-center">Your transaction has been processed.</p>
        
        <div className="bg-white text-gray-900 w-full rounded-3xl p-6 shadow-2xl relative z-10">
          <div className="text-center mb-6 border-b border-gray-100 pb-6">
            <p className="text-gray-500 text-sm mb-1">Total Paid</p>
            <h1 className="text-4xl font-extrabold">LKR {paymentDetails?.amount.toFixed(2)}</h1>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Merchant</span>
              <span className="font-semibold text-right max-w-[60%]">{paymentDetails?.merchant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold">{paymentDetails?.date.split(',')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-semibold">{paymentDetails?.time || "Just now"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-xs mt-1">TXN-{Math.floor(Math.random() * 100000000)}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-xl font-bold text-lg mt-8 relative z-10 backdrop-blur-sm transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto min-h-screen">
      <Header title="Spending Analytics" />
      <div className="p-6 w-full max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
          <p className="text-gray-500 text-sm text-center mb-1">Total Spent This Month</p>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">LKR 4,500.00</h2>
          
          {/* Simulated Chart */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 flex items-center gap-2"><Coffee size={14}/> Food & Drink</span>
                <span className="font-bold">LKR 2,500.00</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 flex items-center gap-2"><Building2 size={14}/> Education</span>
                <span className="font-bold">LKR 1,200.00</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 flex items-center gap-2"><ArrowRightLeft size={14}/> Splits/Transfers</span>
                <span className="font-bold">LKR 800.00</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mb-4">Tips for you</h3>
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex gap-3">
          <div className="bg-indigo-100 p-2 rounded-full h-fit text-indigo-600">
            <PieChart size={20} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 text-sm">You're saving well!</h4>
            <p className="text-sm text-indigo-700 mt-1">You've spent 15% less on off-campus dining compared to last month.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto min-h-screen">
      <Header title="My Profile" />
      <div className="p-6 flex flex-col items-center w-full max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-sm border-4 border-white">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{STUDENT_USER.name}</h2>
        <p className="text-gray-500">{STUDENT_USER.university}</p>
        
        <div className="w-full mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Account Details</h3>
          
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">Student ID</p>
              <p className="font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{STUDENT_USER.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Virtual Account Number</p>
              <div className="flex items-center justify-between font-mono font-medium text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <span>{VIRTUAL_ACCOUNT_NO}</span>
                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Use this number to receive funds from parents or bank accounts.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setCurrentView('login')}
          className="w-full mt-6 bg-red-50 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  // --- REUSABLE COMPONENTS ---
  const Header = ({ title, onBack }) => (
    <div className="bg-white p-4 flex items-center shadow-sm relative z-10 justify-center">
      <div className="w-full max-w-2xl flex items-center relative">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition absolute left-0">
            <ChevronLeft size={24} />
          </button>
        )}
        <h2 className="text-lg font-bold flex-1 text-center text-gray-800">{title}</h2>
      </div>
    </div>
  );

  const NavigationBar = () => {
    // Only show on main tabs
    if (!['dashboard', 'analytics', 'profile'].includes(currentView)) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-2 pb-6 sm:pb-4 z-50">
        <div className="w-full max-w-md flex justify-around mx-auto">
          <NavButton icon={<Home />} label="Home" id="dashboard" />
          <NavButton icon={<PieChart />} label="Analytics" id="analytics" />
          <NavButton icon={<User />} label="Profile" id="profile" />
        </div>
      </div>
    );
  };

  const NavButton = ({ icon, label, id }) => {
    const isActive = currentView === id;
    return (
      <button 
        onClick={() => setCurrentView(id)}
        className={`flex flex-col items-center p-2 min-w-[64px] transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <div className="mb-1">{icon}</div>
        <span className="text-[10px] font-semibold">{label}</span>
      </button>
    );
  };

  // --- RENDERER ---
  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative font-sans">
      {/* Dynamic View Content */}
      {currentView === 'login' && <LoginView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'campus_pay' && <CampusPayView />}
      {currentView === 'off_campus_pay' && <OffCampusPayView />}
      {currentView === 'qr_pay' && <QrScanView />}
      {currentView === 'split' && <SplitBillView />}
      {currentView === 'success' && <SuccessView />}
      {currentView === 'analytics' && <AnalyticsView />}
      {currentView === 'profile' && <ProfileView />}

      {/* Bottom Navigation Menu */}
      <NavigationBar />
    </div>
  );
}