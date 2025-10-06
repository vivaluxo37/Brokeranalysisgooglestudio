// Responsive design hooks - stub implementation

export const useResponsiveDesign = () => ({
  breakpoint: 'desktop' as 'mobile' | 'tablet' | 'desktop',
  isDesktop: true,
  isMobile: false
});

export const useBreakpointManager = () => ({
  currentBreakpoint: 'lg',
  isAbove: () => true,
  isBelow: () => false
});

export const useResponsiveImage = () => ({
  getResponsiveImageProps: (src: string) => ({ src }),
  getSrcSet: () => ''
});