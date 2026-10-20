import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

export default function DownloadReceipt({ receipt }) {
  if (!receipt) return null;

  const handlePrint = () => {
    // Use browser's built-in print dialog instead of window.open
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg print:shadow-none">
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-bold text-fuchsia-600">
              MC
            </div>
            <div>
              <p className="text-white font-black text-base leading-tight">MyCastNow</p>
              <p className="text-fuchsia-200 text-xs">mycastnow.com</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-fuchsia-200 text-xs font-semibold uppercase tracking-wide">Payment Receipt</p>
            <p className="text-white text-xs font-bold mt-0.5">{receipt.date}</p>
          </div>
        </div>

        <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={18} />
            <span className="text-green-700 font-bold text-sm">Payment Confirmed</span>
          </div>
          <span className="text-2xl font-black text-green-700">₹{receipt.amount}</span>
        </div>

        <div className="px-6 py-5 space-y-3">
          {[
            { label: 'Paid By', value: receipt.name || 'N/A' },
            { label: 'Email', value: receipt.phone },
            { label: 'Purpose', value: 'Company Registration Fee' },
            { label: 'Payment ID', value: receipt.paymentId, mono: true },
            { label: 'Order ID', value: receipt.orderId, mono: true },
            { label: 'Status', value: 'SUCCESS', green: true },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-start gap-4">
              <span className="text-xs font-bold text-gray-400 shrink-0 w-24">{row.label}</span>
              <span className={`text-xs text-right break-all ${row.mono ? 'font-mono text-gray-500' : row.green ? 'font-black text-green-600' : 'font-semibold text-gray-800'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 text-center">
          <p className="text-xs text-gray-400">Computer-generated receipt · No signature required</p>
          <p className="text-xs text-gray-400 mt-0.5">Support: info@mycastnow.com</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all print:hidden"
      >
        <Download size={16} />
        Download / Print Receipt
      </button>

      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
