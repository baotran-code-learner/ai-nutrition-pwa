import { useEffect, useRef, useState } from 'react';

export default function CameraScreen({ onClose, onCapture }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamActive(true);
      } catch (err) {
        setError('Camera access denied or unavailable.');
        console.error(err);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStreamActive(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');

    if (typeof onCapture === 'function') {
      onCapture(photoDataUrl);
    }

    stopCamera();
    onClose();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        if (typeof onCapture === 'function') {
          onCapture(result);
        }
        stopCamera();
        onClose();
      }
    };

    reader.onerror = () => {
      setError('Unable to read the selected image file.');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div id="Canvas_Camera" style={{ position: 'absolute', inset: 0, backgroundColor: '#020617', display: 'flex', flexDirection: 'column', zIndex: 50, fontFamily: 'sans-serif' }}>
      <div style={{ flex: '1', position: 'relative', backgroundColor: '#141516', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #1e293b 0%, #020617 100%)' }}>
          <span style={{ fontSize: '82px', filter: 'grayscale(30%)' }}>🥗</span>
        </div>

        <div style={{ width: '220px', height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: '12px' }} />
          <div style={{ position: 'absolute', left: '12px', right: '12px', height: '2px', backgroundColor: 'rgba(16, 185, 129, 0.7)', top: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 12px #10b981' }} />
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'absolute', bottom: '-40px', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {error || (streamActive ? 'Aligning Food Item...' : 'Starting camera...')}
          </span>
        </div>

        <button onClick={onClose} style={{ position: 'absolute', top: '15px', left: '14px', width: '40px', height: '40px', borderRadius: '60%', backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '2px solid #334155', color: '#ffffff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}>
          ✕
        </button>
      </div>

      <div style={{ height: '140px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 32px', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={handleCapture} 
            style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'transparent', border: '4px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: '#f43f5e', transition: 'transform 0.15s ease' }} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            
            style={{ minWidth: '150px', padding: '14px 18px', borderRadius: '999px', border: '1px solid #334155', backgroundColor: '#111827', color: '#f8fafc', fontWeight: '700', cursor: 'pointer' }}
          >
            Choose Photo
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}