// Mobile optimization hooks - stub implementation

export const useMobileOptimization = () => ({
  isMobile: false,
  isTablet: false,
  orientation: 'portrait' as 'portrait' | 'landscape'
});

export const useTouchGestures = () => ({
  onSwipe: () => {},
  onTap: () => {},
  onPinch: () => {}
});

export const useViewportManager = () => ({
  viewport: { width: 1024, height: 768 },
  isMobile: false
});

export const useMobilePerformance = () => ({
  isLowEndDevice: false,
  reducedMotion: false,
  slowConnection: false
});