import React, { useState } from 'react';
import { ShoppingBag, Eye, Search, AlertCircle, CheckCircle2, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface Finding {
  id: string;
  name: string;
  category: string;
  description: string;
  discovered: boolean;
}

export const TargetReconSandbox: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'store' | 'orders' | 'profile' | 'api'>('store');
  const [couponInput, setCouponInput] = useState('WELCOME10');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [orderQueryId, setOrderQueryId] = useState('8821');
  const [orderData, setOrderData] = useState<any>({
    id: 8821,
    customer: 'Alex Chen (You)',
    items: ['Mechanical Keycaps Set', 'USB-C Braided Cable'],
    total: '$42.00',
    shippingAddress: '742 Evergreen Terr, Springfield'
  });

  const [findings, setFindings] = useState<Finding[]>([
    {
      id: 'f1',
      name: 'Sequential Unchecked Order Receipt Endpoint',
      category: 'IDOR',
      description: 'Querying /api/orders/8820 returns another customer’s order without requiring authentication.',
      discovered: false
    },
    {
      id: 'f2',
      name: 'Leaked Coupon Logic in API Response',
      category: 'Info Leak',
      description: 'The coupon verification API leaks max_uses_remaining and internal algorithm keys.',
      discovered: false
    },
    {
      id: 'f3',
      name: 'Client-Side User Role in LocalStorage',
      category: 'Broken Access Control',
      description: 'LocalStorage holds "user_permission_level: standard_customer" which is checked by the client.',
      discovered: false
    },
    {
      id: 'f4',
      name: 'Stack Trace Leak on Malformed Input',
      category: 'Information Disclosure',
      description: 'Submitting special characters in order ID exposes backend database version & table names.',
      discovered: false
    }
  ]);

  const markDiscovered = (id: string) => {
    setFindings(prev => {
      const next = prev.map(f => f.id === id ? { ...f, discovered: true } : f);
      const totalDiscovered = next.filter(f => f.discovered).length;
      if (totalDiscovered >= 2 && onComplete) {
        onComplete();
      }
      return next;
    });
  };

  const handleFetchOrder = (id: string) => {
    setOrderQueryId(id);
    if (id === '8820') {
      setOrderData({
        id: 8820,
        customer: 'Dr. Evelyn Reed (Confidential)',
        items: ['Enterprise Cryptographic HSM Unit', 'Biometric Scanner'],
        total: '$3,850.00',
        shippingAddress: '404 DARPA Way, Arlington, VA'
      });
      markDiscovered('f1');
    } else if (id.includes("'") || isNaN(Number(id))) {
      setOrderData({
        error: 'Unhandled SQLException: syntax error at or near "\'" in SELECT * FROM orders WHERE id = ' + id,
        stack: 'at pgsql_client.query (driver.js:412:12)\nat OrderService.find (/srv/app/services/orders.ts:89)'
      });
      markDiscovered('f4');
    } else {
      setOrderData({
        id: parseInt(id),
        customer: 'Customer #' + id,
        items: ['General Merchandise'],
        total: '$59.00',
        shippingAddress: '100 Main St'
      });
    }
  };

  const verifyCoupon = () => {
    if (couponInput.toUpperCase() === 'WELCOME10') {
      setCouponFeedback('Valid coupon! 10% discount applied. (API Response leaked: max_uses_remaining=9999, internal_salt=sec_88a)');
      markDiscovered('f2');
    } else {
      setCouponFeedback('Invalid coupon code. Try WELCOME10 or inspect network responses.');
    }
  };

  const discoveredCount = findings.filter(f => f.discovered).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Live Target Reconnaissance ("ShopNova")
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              There are no flags or artificial riddles here. Explore like an auditor and notice what the developers forgot.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-sans">
          <span className="text-[11px] text-slate-400">Anomalies Noticed:</span>
          <span className="text-sm font-bold font-mono text-purple-400">
            {discoveredCount} / {findings.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mock Application Surface */}
        <div className="lg:col-span-2 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col font-sans">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="font-black text-purple-400 tracking-wider">SHOPNOVA</span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs text-slate-400">Customer Portal</span>
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-2.5 py-1 rounded transition ${activeTab === 'store' ? 'bg-purple-900/60 text-purple-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Catalog
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-2.5 py-1 rounded transition ${activeTab === 'orders' ? 'bg-purple-900/60 text-purple-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-2.5 py-1 rounded transition ${activeTab === 'profile' ? 'bg-purple-900/60 text-purple-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Account
              </button>
            </div>
          </div>

          {/* Tab Views */}
          <div className="flex-1 space-y-4">
            {activeTab === 'store' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h5 className="font-bold text-sm text-slate-100">Mechanical Keycaps</h5>
                    <p className="text-xs text-slate-400 mt-1">Double-shot PBT keycaps.</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-mono text-emerald-400 font-bold">$34.00</span>
                      <button className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold">
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h5 className="font-bold text-sm text-slate-100">Braided Coil Cable</h5>
                    <p className="text-xs text-slate-400 mt-1">Custom aviator connector.</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-mono text-emerald-400 font-bold">$22.00</span>
                      <button className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300">Have a promotional coupon?</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs font-mono uppercase"
                    />
                    <button
                      onClick={verifyCoupon}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-bold"
                    >
                      Verify Coupon
                    </button>
                  </div>
                  {couponFeedback && (
                    <p className="text-[11px] text-cyan-300 font-mono mt-1 break-all bg-slate-950 p-2 rounded border border-slate-800">
                      {couponFeedback}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Order Lookup ID:</span>
                  <input
                    type="text"
                    value={orderQueryId}
                    onChange={(e) => setOrderQueryId(e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs font-mono text-cyan-300"
                  />
                  <button
                    onClick={() => handleFetchOrder(orderQueryId)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-xs"
                  >
                    Fetch
                  </button>
                  <button
                    onClick={() => handleFetchOrder('8820')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                    title="Test neighbor ID 8820"
                  >
                    Try #8820
                  </button>
                  <button
                    onClick={() => handleFetchOrder("8821'")}
                    className="px-2 py-1 bg-rose-950/60 text-rose-300 border border-rose-900 rounded text-[11px]"
                    title="Test quote injection"
                  >
                    Try 8821'
                  </button>
                </div>

                {orderData.error ? (
                  <div className="p-3 bg-rose-950/40 border border-rose-800 rounded text-rose-300 font-mono text-[11px] space-y-1">
                    <p className="font-bold">{orderData.error}</p>
                    <pre className="text-rose-400/80 text-[10px] overflow-x-auto">{orderData.stack}</pre>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-200">Order #{orderData.id}</span>
                      <span className="text-emerald-400 font-mono font-bold">{orderData.total}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Customer Name</span>
                      <p className="text-slate-200 font-semibold">{orderData.customer}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Shipping Address</span>
                      <p className="text-slate-300">{orderData.shippingAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Username:</span>
                    <span className="font-bold text-slate-200">buyer_alex</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Internal Account ID:</span>
                    <span className="font-mono text-cyan-400">#8821</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Client Permission Flag:</span>
                    <span className="font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                      standard_customer
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => markDiscovered('f3')}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                >
                  Inspect Client Storage Key (user_permission_level)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discovery Tracker Sidebar */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2 font-mono">
              The Security Auditor's Notebook
            </span>
            <p className="text-[11px] text-slate-400 mb-3">
              Notice the subtle clues left behind by the development team:
            </p>

            <div className="space-y-2.5">
              {findings.map((f) => (
                <div
                  key={f.id}
                  className={`p-2.5 rounded-lg border text-xs transition ${
                    f.discovered
                      ? 'bg-purple-950/30 border-purple-600/60 text-purple-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {f.discovered ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className="font-bold text-slate-200">{f.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    {f.discovered ? f.description : 'Undiscovered anomaly. Explore tabs, network, and error inputs.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>The Takeaway:</strong> In real bug bounty programs, nobody tells you which tab has a vulnerability. You look for inputs that touch databases, endpoints that lack ownership checks, and APIs that over-share.
          </div>
        </div>
      </div>
    </div>
  );
};
