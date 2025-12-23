import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Flashlight, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode('qr-reader');
    }

    return () => {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop().catch(console.error);
        }
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError(null);
      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // Success callback
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // Error callback - ignore, just means no QR found in this frame
        }
      );
    } catch (err) {
      console.error('QR Scanner error:', err);
      setError('Camera access denied or not available. Please grant camera permission.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      const state = scannerRef.current.getState();
      if (state === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.stop();
      }
    }
    setIsScanning(false);
  };

  const toggleCamera = async () => {
    await stopScanning();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    // Re-start scanning with new camera
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  const handleClose = async () => {
    await stopScanning();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-chai-charcoal"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-chai-charcoal to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-chai-cream hover:bg-chai-cream/10"
            >
              <X className="w-6 h-6" />
            </Button>
            <h2 className="font-display text-xl text-chai-cream">SCAN QR CODE</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCamera}
              className="text-chai-cream hover:bg-chai-cream/10"
            >
              <SwitchCamera className="w-6 h-6" />
            </Button>
          </div>

          {/* Scanner Container */}
          <div className="h-full flex flex-col items-center justify-center px-4">
            <div
              ref={containerRef}
              className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden"
            >
              {/* QR Reader Element */}
              <div
                id="qr-reader"
                className={cn(
                  'w-full h-full',
                  !isScanning && 'hidden'
                )}
              />

              {/* Overlay when not scanning */}
              {!isScanning && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-chai-dark flex flex-col items-center justify-center gap-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-2xl bg-chai-orange/20 flex items-center justify-center"
                  >
                    <Camera className="w-10 h-10 text-chai-orange" />
                  </motion.div>
                  <p className="text-chai-cream/70 text-center">
                    Initializing camera...
                  </p>
                </motion.div>
              )}

              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-chai-dark flex flex-col items-center justify-center gap-4 p-6"
                >
                  <div className="w-20 h-20 rounded-2xl bg-destructive/20 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-destructive" />
                  </div>
                  <p className="text-chai-cream/70 text-center text-sm">
                    {error}
                  </p>
                  <Button variant="orange" onClick={startScanning}>
                    Try Again
                  </Button>
                </motion.div>
              )}

              {/* Scanner Frame Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Dark overlay around scanner area */}
                  <div className="absolute inset-0 bg-chai-charcoal/50" />
                  
                  {/* Clear center area */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-chai-orange rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-chai-orange rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-chai-orange rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-chai-orange rounded-br-xl" />
                    
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-chai-orange to-transparent"
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-chai-cream/60 text-center mt-6 text-sm"
            >
              Point your camera at the QR code displayed at the outlet counter
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
