import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * AppLoader - Global loading overlay that appears ONLY for slow requests (>400ms)
 * Memoized to prevent unnecessary re-renders
 */
export const AppLoader = memo(function AppLoader() {
  const { showLoader } = useGlobalLoading({
    delay: 400,
    minDisplayTime: 300,
  });

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center
                     bg-background/90 backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
          role="status"
        >
          {/* New Lottie Animation */}
          <div className="w-40 h-40 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/67a3ff2c-623d-4ab3-87fa-315db5a7cbed/G9q5rDCrCO.lottie"
              autoplay
              loop
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground font-medium mt-2"
          >
            Loading fresh items...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AppLoader;
