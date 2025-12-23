import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { watchLocation, clearLocationWatch, calculateDistance, Outlet } from '@/lib/api';

interface LiveLocationMapProps {
  outlets: Outlet[];
  selectedOutletId?: string | null;
  onNearbyOutlet?: (outlet: Outlet, distance: number) => void;
}

export function LiveLocationMap({ outlets, selectedOutletId, onNearbyOutlet }: LiveLocationMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [nearestOutlet, setNearestOutlet] = useState<{ outlet: Outlet; distance: number } | null>(null);

  useEffect(() => {
    let watchId: number = -1;

    if (isTracking) {
      watchId = watchLocation(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setLocationError(null);

          // Find nearest outlet
          let nearest: { outlet: Outlet; distance: number } | null = null;
          outlets.forEach(outlet => {
            const distance = calculateDistance(
              newLocation.lat,
              newLocation.lng,
              outlet.latitude,
              outlet.longitude
            );
            if (!nearest || distance < nearest.distance) {
              nearest = { outlet, distance };
            }
          });

          if (nearest) {
            setNearestOutlet(nearest);
            if (nearest.distance < 0.5 && onNearbyOutlet) {
              onNearbyOutlet(nearest.outlet, nearest.distance);
            }
          }
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    }

    return () => {
      if (watchId !== -1) {
        clearLocationWatch(watchId);
      }
    };
  }, [isTracking, outlets, onNearbyOutlet]);

  const selectedOutlet = outlets.find(o => o.id === selectedOutletId);
  const distanceToSelected = userLocation && selectedOutlet
    ? calculateDistance(userLocation.lat, userLocation.lng, selectedOutlet.latitude, selectedOutlet.longitude)
    : null;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-chai-dark to-chai-charcoal">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated pulse circles for outlets */}
      <AnimatePresence>
        {outlets.map((outlet, index) => (
          <motion.div
            key={outlet.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            className={cn(
              'absolute w-4 h-4 rounded-full',
              outlet.id === selectedOutletId 
                ? 'bg-accent animate-glow-pulse' 
                : 'bg-chai-warm'
            )}
            style={{
              left: `${20 + (index % 4) * 20}%`,
              top: `${20 + Math.floor(index / 4) * 30}%`,
            }}
          >
            {outlet.id === selectedOutletId && (
              <motion.div
                className="absolute inset-0 rounded-full bg-accent"
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* User location indicator */}
      {userLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-500"
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
              <Navigation className="w-3 h-3 text-white" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Status overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-chai-charcoal to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTracking(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium"
              >
                <Navigation className="w-4 h-4" />
                Start Tracking
              </motion.button>
            ) : locationError ? (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{locationError}</span>
              </div>
            ) : userLocation ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tracking active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-chai-cream/60 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Getting location...</span>
              </div>
            )}
          </div>

          {nearestOutlet && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-right"
            >
              <p className="text-chai-cream/60 text-xs">Nearest outlet</p>
              <p className="text-chai-cream text-sm font-medium">{nearestOutlet.outlet.name}</p>
              <p className={cn(
                'text-xs font-medium',
                nearestOutlet.distance < 0.5 ? 'text-green-400' : 'text-chai-cream/60'
              )}>
                {nearestOutlet.distance < 1 
                  ? `${Math.round(nearestOutlet.distance * 1000)}m away`
                  : `${nearestOutlet.distance.toFixed(1)} km away`
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Distance to selected outlet */}
      {selectedOutlet && distanceToSelected !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4"
        >
          <div className="bg-chai-charcoal/80 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-chai-cream font-medium">{selectedOutlet.name}</p>
                <p className="text-chai-cream/60 text-sm">
                  {distanceToSelected < 1 
                    ? `${Math.round(distanceToSelected * 1000)}m away`
                    : `${distanceToSelected.toFixed(1)} km away`
                  }
                </p>
              </div>
              {distanceToSelected < 0.5 && (
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  In Range
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
