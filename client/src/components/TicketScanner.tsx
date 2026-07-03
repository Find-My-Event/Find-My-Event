import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function TicketScanner() {
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Only initialize scanner if not already processing a result
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false);

    scanner.render(
      async (result: string) => {
        // Stop scanning temporarily
        scanner.clear();
        setScanning(true);
        setScanResult(null);

        try {
          const res = await api.post('/events/scan', { qrToken: result });
          setScanResult({ status: 'success', message: res.data.message || 'Access Granted' });
        } catch (error: any) {
          setScanResult({ 
            status: 'error', 
            message: error.response?.data?.message || 'Invalid Ticket / Scan Failed' 
          });
        } finally {
          setScanning(false);
        }
      },
      () => {
        // Ignore continuous scan errors (usually just means no QR found yet)
      }
    );

    return () => {
      scanner.clear().catch((error: any) => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [scanResult]);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111' }}>Scan Ticket</h3>
      
      {!scanResult && !scanning && (
        <div id="reader" style={{ borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}></div>
      )}

      {scanning && (
        <div style={{ padding: '3rem 1rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Loader2 size={40} className="spin" style={{ margin: '0 auto', color: '#8b5cf6' }} />
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>Verifying Ticket...</p>
        </div>
      )}

      {scanResult && (
        <div style={{ 
          padding: '2rem 1rem', 
          background: scanResult.status === 'success' ? '#ecfdf5' : '#fef2f2', 
          border: `1px solid ${scanResult.status === 'success' ? '#a7f3d0' : '#fecaca'}`,
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
        }}>
          {scanResult.status === 'success' ? (
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto' }} />
          ) : (
            <XCircle size={48} color="#ef4444" style={{ margin: '0 auto' }} />
          )}
          <h4 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            marginTop: '1rem', 
            color: scanResult.status === 'success' ? '#065f46' : '#991b1b' 
          }}>
            {scanResult.message}
          </h4>
          
          <button 
            onClick={() => setScanResult(null)}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Scan Next Ticket
          </button>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
