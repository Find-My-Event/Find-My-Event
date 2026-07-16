import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
export default function PublicScanner({ token }: { token: string }) {
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Generate or retrieve Device ID
  useEffect(() => {
    let savedId = localStorage.getItem('scannerDeviceId');
    if (!savedId) {
      savedId = 'dev_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('scannerDeviceId', savedId);
    }
    setDeviceId(savedId);
  }, []);

  // Verification on page load
  useEffect(() => {
    if (!token || !deviceId) return;

    const verifyScanner = async () => {
      try {
        await api.get(`/events/verify-scanner/${token}?deviceId=${deviceId}`);
        setVerifying(false);
      } catch (err: any) {
        setVerificationError(err.response?.data?.message || 'Verification failed. Invalid magic link.');
        setVerifying(false);
      }
    };

    verifyScanner();
  }, [token, deviceId]);

  useEffect(() => {
    if (!token || !deviceId || verifying || verificationError) return;
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false);

    scanner.render(
      async (result: string) => {
        scanner.clear();
        setScanning(true);
        setScanResult(null);

        try {
          const res = await api.post('/events/scan-public', { 
            qrToken: result, 
            scannerToken: token, 
            deviceId 
          });
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
        // Ignore continuous scan errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanResult, token, deviceId, verifying, verificationError]);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '24px', padding: '2rem 1rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111' }}>Event Scanner</h3>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Volunteer Access</p>
        
        {verifying && (
          <div style={{ padding: '3rem 1rem' }}>
            <Loader2 size={40} className="spin" style={{ margin: '0 auto', color: '#8b5cf6' }} />
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>Verifying Access...</p>
          </div>
        )}

        {verificationError && (
          <div style={{ padding: '2rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px' }}>
            <XCircle size={48} color="#ef4444" style={{ margin: '0 auto' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '1rem', color: '#991b1b' }}>
              Access Denied
            </h4>
            <p style={{ marginTop: '0.5rem', color: '#7f1d1d', fontSize: '0.9rem' }}>{verificationError}</p>
          </div>
        )}

        {!verifying && !verificationError && (
          <>
            {!scanResult && !scanning && (
              <div id="reader" style={{ borderRadius: '16px', overflow: 'hidden', border: 'none', background: '#000' }}></div>
            )}

            {scanning && (
              <div style={{ padding: '3rem 1rem' }}>
                <Loader2 size={40} className="spin" style={{ margin: '0 auto', color: '#8b5cf6' }} />
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>Verifying Ticket...</p>
              </div>
            )}

            {scanResult && (
              <div style={{ 
                padding: '2rem 1rem', 
                background: scanResult.status === 'success' ? '#ecfdf5' : '#fef2f2', 
                border: `1px solid ${scanResult.status === 'success' ? '#a7f3d0' : '#fecaca'}`,
                borderRadius: '16px' 
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
          </>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
