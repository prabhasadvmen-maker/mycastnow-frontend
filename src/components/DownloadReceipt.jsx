import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';

export default function DownloadReceipt({ receipt }) {
  if (!receipt) return null;

  const handlePrint = () => {
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>MyCastNow Receipt</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#f3f4f6;display:flex;justify-content:center;padding:40px}
.card{background:white;border-radius:20px;overflow:hidden;width:480px;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
.hdr{background:linear-gradient(135deg,#a21caf,#7c3aed);padding:20px 24px;display:flex;justify-content:space-between;align-items:center}
.logo-row{display:flex;align-items:center;gap:10px}
.logo-row img{height:36px;width:36px;border-radius:8px;object-fit:cover}
.brand{color:white;font-weight:900;font-size:15px}
.url{color:#e9d5ff;font-size:11px;margin-top:2px}
.hdr-right{text-align:right}
.rl{color:#e9d5ff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.rd{color:white;font-size:11px;font-weight:700;margin-top:3px}
.amt-row{background:#f0fdf4;border-bottom:1px solid #dcfce7;padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
.confirmed{color:#15803d;font-weight:700;font-size:13px}
.amt{font-size:26px;font-weight:900;color:#15803d}
.details{padding:20px 24px}
.row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #f3f4f6}
.row:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.lbl{font-size:11px;font-weight:700;color:#9ca3af;white-space:nowrap;min-width:80px}
.val{font-size:11px;text-align:right;word-break:break-all;color:#1f2937;font-weight:600}
.mono{font-family:monospace;color:#6b7280;font-size:10px}
.green{color:#16a34a;font-weight:900;font-size:12px}
.footer{background:#f9fafb;border-top:1px solid #f3f4f6;padding:14px 24px;text-align:center}
.ft{font-size:10px;color:#9ca3af;margin-bottom:3px}
@media print{body{background:white;padding:20px}.card{box-shadow:none}}
</style></head><body>
<div class="card">
  <div class="hdr">
    <div class="logo-row">
      <img src="/mycastnow logo.jpeg" alt=""/>
      <div><div class="brand">MyCastNow</div><div class="url">mycastnow.com</div></div>
    </div>
    <div class="hdr-right">
      <div class="rl">Payment Receipt</div>
      <div class="rd">${receipt.date}</div>
    </div>
  </div>
  <div class="amt-row">
    <div class="confirmed">&#10003; Payment Confirmed</div>
    <div class="amt">&#8377;${receipt.amount}</div>
  </div>
  <div class="details">
    <div class="row"><span class="lbl">Paid By</span><span class="val">${receipt.name || 'N/A'}</span></div>
    <div class="row"><span class="lbl">Phone</span><span class="val">${receipt.phone}</span></div>
    <div class="row"><span class="lbl">Purpose</span><span class="val">Creator Onboarding Fee</span></div>
    <div class="row"><span class="lbl">Payment ID</span><span class="val mono">${receipt.paymentId}</span></div>
    <div class="row"><span class="lbl">Order ID</span><span class="val mono">${receipt.orderId}</span></div>
    <div class="row"><span class="lbl">Status</span><span class="val green">SUCCESS</span></div>
  </div>
  <div class="footer">
    <div class="ft">Computer-generated receipt. No signature required.</div>
    <div class="ft">Support: support@mycastnow.com</div>
  </div>
</div>
</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/mycastnow logo.jpeg" alt="MyCastNow" className="h-9 w-9 rounded-xl object-cover" />
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
          <span className="text-2xl font-black text-green-700">&#8377;{receipt.amount}</span>
        </div>

        <div className="px-6 py-5 space-y-3">
          {[
            { label: 'Paid By', value: receipt.name || 'N/A' },
            { label: 'Phone', value: receipt.phone },
            { label: 'Purpose', value: 'Creator Onboarding Fee' },
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
          <p className="text-xs text-gray-400 mt-0.5">Support: support@mycastnow.com</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
      >
        <Download size={16} />
        Download / Print Receipt
      </button>
    </div>
  );
}
