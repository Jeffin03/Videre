import React, { useState } from 'react';
import { ShoppingCart, Check, ShieldAlert, Sparkles, RefreshCw, Terminal } from 'lucide-react';

interface FormBypassDemoProps {
  onComplete?: () => void;
}

export const FormBypassDemo: React.FC<FormBypassDemoProps> = ({ onComplete }) => {
  const [unitPrice, setUnitPrice] = useState('120.00');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const numPrice = parseFloat(unitPrice) || 0;
    const total = numPrice * quantity;

    const result = {
      orderId: 'ORD-' + Math.floor(Math.random() * 90000 + 10000),
      item: 'Mechanical Keyboard - RGB Pro',
      billedUnitPrice: numPrice,
      quantity,
      totalCharged: total.toFixed(2),
      tampered: numPrice !== 120.00 || quantity < 1
    };

    setOrderResult(result);
    if (result.tampered && onComplete) {
      onComplete();
    }
  };

  const resetForm = () => {
    setUnitPrice('120.00');
    setQuantity(1);
    setIsSubmitDisabled(false);
    setOrderResult(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Parameter & Price Tampering
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              What happens when an e-commerce backend trusts the price submitted by the HTML form?
            </p>
          </div>
        </div>

        <button
          onClick={resetForm}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Form</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Storefront form with simulated developer inspector */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center font-sans">
            <div>
              <h5 className="font-bold text-slate-100">DevGear Checkout Terminal</h5>
              <p className="text-[11px] text-slate-400">Mechanical Keyboard - RGB Pro</p>
            </div>
            <span className="text-emerald-400 font-mono font-bold text-base">
              ${unitPrice}
            </span>
          </div>

          <form onSubmit={handleCheckout} className="space-y-3 font-sans">
            {/* The Hidden Price Input Simulator */}
            <div className="p-2.5 bg-purple-950/20 border border-purple-800/40 rounded space-y-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-purple-300 font-mono font-bold flex items-center space-x-1">
                  <span>&lt;input type="hidden" name="unit_price"&gt;</span>
                </span>
                <span className="text-amber-400 font-sans uppercase font-bold">Client Parameter</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-mono text-xs">$</span>
                <input
                  type="text"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="flex-1 bg-slate-900 border border-purple-700/60 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="120.00"
                />
                <button
                  type="button"
                  onClick={() => setUnitPrice('1.00')}
                  className="px-2 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 rounded text-[10px] font-mono transition"
                >
                  Set to $1.00
                </button>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Normally invisible in standard UI. In DevTools Elements tab, you can edit this attribute in seconds.
              </p>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-slate-400 mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max="5"
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-slate-200 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-2 rounded font-bold text-xs transition flex items-center justify-center space-x-2 ${
                  isSubmitDisabled
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Submit Order (${(parseFloat(unitPrice) || 0) * quantity})</span>
              </button>
            </div>
          </form>
        </div>

        {/* Server Receipt and Flaw Breakdown */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div>
            <div className="flex items-center space-x-1.5 text-slate-300 font-bold mb-2 pb-2 border-b border-slate-800 text-xs">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Server Payment Gateway</span>
            </div>

            {orderResult ? (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border ${
                  orderResult.tampered
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold font-mono">{orderResult.orderId}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      orderResult.tampered ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300'
                    }`}>
                      {orderResult.tampered ? 'TAMPERED ORDER' : 'STANDARD ORDER'}
                    </span>
                  </div>
                  <p className="text-xs">{orderResult.item} (x{orderResult.quantity})</p>
                  <p className="text-lg font-mono font-bold mt-2 text-emerald-400">
                    Total Charged: ${orderResult.totalCharged}
                  </p>
                </div>

                {orderResult.tampered && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Vulnerability Demonstrated:</strong> The server billed the order based on the client's submitted price ($1.00) instead of fetching the authoritative $120.00 price from the catalog database!
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Submit an order to view the backend receipt.
              </div>
            )}
          </div>

          <div className="mt-4 p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-slate-300">The Golden Rule:</strong> Never accept pricing, roles, or limits from client form data. The server must always query its own source of truth.
          </div>
        </div>
      </div>
    </div>
  );
};
