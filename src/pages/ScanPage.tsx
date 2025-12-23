import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, CheckCircle2, AlertCircle, Loader2, Camera, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { verifyQRCode, getCurrentLocation, getLastVisit, calculateDistance } from '@/lib/api';
import { QRScanner } from '@/components/scanner/QRScanner';
import { LiveLocationMap } from '@/components/location/LiveLocationMap';

type ScanState = 'idle' | 'scanning' | 'locating' | 'verifying' | 'success' | 'error';

export default function ScanPage() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [showScanner, setShowScanner] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [lastVisitTime, setLastVisitTime] = useState<Date | null>(null);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const { outlets, user, isAuthenticated, refreshProfile, refreshData } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      getLastVisit(user.id).then(visit => {
        if (visit) {
          setLastVisitTime(new Date(visit.created_at));
        }
      });
    }
  }, [isAuthenticated, user, navigate]);

  const canScan = !lastVisitTime || (Date.now() - lastVisitTime.getTime()) > 6 * 60 * 60 * 1000;
  const nextScanTime = lastVisitTime 
    ? new Date(lastVisitTime.getTime() + 6 * 60 * 60 * 1000) 
    : null;

  const handleQRScan = async (qrCode: string) => {
    setShowScanner(false);
    setScanState('locating');
    
    let latitude: number | undefined;
    let longitude: number | undefined;
    
    try {
      const position = await getCurrentLocation();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      setUserLocation({ lat: latitude, lng: longitude });
    } catch (error) {
      console.log('Location not available');
    }
    
    setScanState('verifying');
    
    const result = await verifyQRCode(qrCode, latitude, longitude);
    
    if (result.success && result.data) {
      setScanState('success');
      setCreditsEarned(result.data.credits_earned || 10);
      toast.success(`Check-in successful! +${result.data.credits_earned || 10} credits 🎉`);
      await refreshProfile();
      await refreshData();
      setLastVisitTime(new Date());
    } else {
      setScanState('error');
      toast.error(result.error || 'Verification failed');
    }
  };

  const resetScan = () => {
    setScanState('idle');
    setCreditsEarned(0);
  };

  const outletsWithDistance = outlets.map(outlet => {
    let distance: number | undefined;
    if (userLocation) {
      distance = calculateDistance(userLocation.lat, userLocation.lng, outlet.latitude, outlet.longitude);
    }
    return { ...outlet, distance };
  }).sort((a, b) => (a.distance || 999) - (b.distance || 999));

  return (
    <div className="min-h-screen">
      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />

      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-5xl text-foreground">SCAN & EARN</h1>
          <p className="text-muted-foreground mt-2">Scan the QR code at any outlet</p>
        </motion.div>

        {/* Cooldown Warning */}
        {!canScan && nextScanTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-muted rounded-2xl p-4 mb-6 text-center"
          >
            <AlertCircle className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Next scan at <span className="font-medium text-foreground">{nextScanTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </motion.div>
        )}

        {/* Scanner Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden mb-8',
            scanState === 'idle' && 'bg-gradient-chai',
            scanState === 'locating' && 'bg-chai-dark',
            scanState === 'verifying' && 'bg-chai-dark',
            scanState === 'success' && 'bg-green-900',
            scanState === 'error' && 'bg-red-900'
          )}
        >
          <div className="texture-overlay" />
          
          <AnimatePresence mode="wait">
            {scanState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 rounded-3xl bg-chai-cream/10 backdrop-blur-sm flex items-center justify-center mb-6"
                >
                  <QrCode className="w-16 h-16 text-chai-cream" />
                </motion.div>
                <p className="text-chai-cream/80 text-center">Tap below to open camera scanner</p>
              </motion.div>
            )}

            {(scanState === 'locating' || scanState === 'verifying') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-16 h-16 text-chai-orange" />
                </motion.div>
                <p className="text-chai-cream mt-4">{scanState === 'locating' ? 'Getting location...' : 'Verifying...'}</p>
              </motion.div>
            )}

            {scanState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <CheckCircle2 className="w-24 h-24 text-green-400" />
                <h3 className="font-display text-2xl text-chai-cream mt-4">CHECK-IN COMPLETE!</h3>
                <p className="text-chai-cream/80 mt-2">+{creditsEarned} credits earned</p>
              </motion.div>
            )}

            {scanState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <AlertCircle className="w-24 h-24 text-red-400" />
                <h3 className="font-display text-2xl text-chai-cream mt-4">FAILED</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          {scanState === 'idle' ? (
            <>
              <Button
                variant="scan"
                size="xl"
                onClick={() => setShowScanner(true)}
                disabled={!canScan}
                className="w-full"
              >
                <Camera className="w-6 h-6" />
                OPEN SCANNER
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="w-full"
              >
                <Navigation className="w-4 h-4" />
                {showMap ? 'Hide Map' : 'Show Nearby Outlets'}
              </Button>
            </>
          ) : (scanState === 'success' || scanState === 'error') && (
            <Button variant="chai" size="xl" onClick={resetScan} className="w-full">
              Done
            </Button>
          )}
        </div>

        {/* Live Location Map */}
        {showMap && <LiveLocationMap outlets={outletsWithDistance} />}

        {/* Nearby Outlets List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-xl text-foreground mb-4">NEARBY OUTLETS</h2>
          <div className="space-y-3">
            {outletsWithDistance.filter(o => o.is_open).slice(0, 5).map((outlet) => (
              <div key={outlet.id} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{outlet.name}</h3>
                    <p className="text-sm text-muted-foreground">{outlet.address}</p>
                  </div>
                  {outlet.distance !== undefined && (
                    <span className="text-xs text-muted-foreground">{outlet.distance.toFixed(1)} km</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
