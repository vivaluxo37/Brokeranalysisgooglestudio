/**
 * Mobile Optimization System
 * 
 * This module provides utilities for optimizing the mobile experience,
 * including touch gesture recognition, performance optimizations,
 * and viewport/orientation management.
 */

// Touch gesture types
export type TouchGesture = 'tap' | 'double-tap' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch-in' | 'pinch-out' | 'long-press';

// Touch event data
export interface TouchEventData {
  gesture: TouchGesture;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  distance: number;
  velocity: number;
  target: HTMLElement;
}

// Touch gesture callback
export type TouchGestureCallback = (data: TouchEventData) => void;

// Device orientation
export type DeviceOrientation = 'portrait' | 'landscape';

// Viewport configuration
export interface ViewportConfig {
  width: number;
  height: number;
  orientation: DeviceOrientation;
  pixelRatio: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

// Performance configuration
export interface PerformanceConfig {
  enableHardwareAcceleration: boolean;
  enableTouchOptimization: boolean;
  enableReducedMotion: boolean;
  enableLazyLoading: boolean;
  maxConcurrentAnimations: number;
  animationDuration: number;
}

/**
 * Touch Gesture Recognition Class
 */
class TouchGestureRecognizer {
  private callbacks: Map<TouchGesture, TouchGestureCallback[]> = new Map();
  private touchStartTime: number = 0;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private lastTapTime: number = 0;
  private tapCount: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private initialDistance: number = 0;
  private isActive: boolean = false;

  constructor() {
    this.initializeGestures();
  }

  /**
   * Initialize touch gesture recognition
   */
  private initializeGestures(): void {
    // Initialize callback arrays for each gesture
    const gestures: TouchGesture[] = [
      'tap', 'double-tap', 'swipe-left', 'swipe-right', 
      'swipe-up', 'swipe-down', 'pinch-in', 'pinch-out', 'long-press'
    ];
    
    gestures.forEach(gesture => {
      this.callbacks.set(gesture, []);
    });
  }

  /**
   * Add event listeners to an element
   */
  attach(element: HTMLElement): void {
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    element.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', this.handleTouchCancel, { passive: false });
  }

  /**
   * Remove event listeners from an element
   */
  detach(element: HTMLElement): void {
    element.removeEventListener('touchstart', this.handleTouchStart);
    element.removeEventListener('touchmove', this.handleTouchMove);
    element.removeEventListener('touchend', this.handleTouchEnd);
    element.removeEventListener('touchcancel', this.handleTouchCancel);
  }

  /**
   * Register a callback for a specific gesture
   */
  on(gesture: TouchGesture, callback: TouchGestureCallback): void {
    const callbacks = this.callbacks.get(gesture) || [];
    callbacks.push(callback);
    this.callbacks.set(gesture, callbacks);
  }

  /**
   * Remove a callback for a specific gesture
   */
  off(gesture: TouchGesture, callback: TouchGestureCallback): void {
    const callbacks = this.callbacks.get(gesture) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
      this.callbacks.set(gesture, callbacks);
    }
  }

  /**
   * Handle touch start event
   */
  private handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    this.touchStartTime = Date.now();
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isActive = true;

    // Set up long press detection
    this.longPressTimer = setTimeout(() => {
      this.triggerGesture('long-press', {
        gesture: 'long-press',
        startX: this.touchStartX,
        startY: this.touchStartY,
        endX: this.touchStartX,
        endY: this.touchStartY,
        duration: 500,
        distance: 0,
        velocity: 0,
        target: event.target as HTMLElement
      });
    }, 500);
  };

  /**
   * Handle touch move event
   */
  private handleTouchMove = (event: TouchEvent): void => {
    if (!this.isActive) return;

    // Cancel long press if moved
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // Handle pinch gestures
    if (event.touches.length === 2) {
      this.handlePinchGesture(event);
    }
  };

  /**
   * Handle touch end event
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isActive) return;
    
    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const touchEndTime = Date.now();
    const duration = touchEndTime - this.touchStartTime;
    
    // Only handle single touch gestures
    if (event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const deltaX = endX - this.touchStartX;
      const deltaY = endY - this.touchStartY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / duration;

      // Determine gesture type
      if (duration < 200 && distance < 10) {
        // Tap gesture
        this.handleTapGesture(endX, endY, duration);
      } else if (duration < 500 && distance > 30) {
        // Swipe gesture
        this.handleSwipeGesture(deltaX, deltaY, distance, duration, velocity, endX, endY);
      }
    }

    this.isActive = false;
  };

  /**
   * Handle touch cancel event
   */
  private handleTouchCancel = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.isActive = false;
  };

  /**
   * Handle tap gestures (single and double)
   */
  private handleTapGesture(x: number, y: number, duration: number): void {
    const now = Date.now();
    const timeSinceLastTap = now - this.lastTapTime;
    
    if (timeSinceLastTap < 300) {
      // Double tap
      this.tapCount++;
      if (this.tapCount === 2) {
        this.triggerGesture('double-tap', {
          gesture: 'double-tap',
          startX: this.touchStartX,
          startY: this.touchStartY,
          endX: x,
          endY: y,
          duration,
          distance: 0,
          velocity: 0,
          target: document.elementFromPoint(x, y) as HTMLElement
        });
        this.tapCount = 0;
      }
    } else {
      // Single tap
      this.tapCount = 1;
      setTimeout(() => {
        if (this.tapCount === 1) {
          this.triggerGesture('tap', {
            gesture: 'tap',
            startX: this.touchStartX,
            startY: this.touchStartY,
            endX: x,
            endY: y,
            duration,
            distance: 0,
            velocity: 0,
            target: document.elementFromPoint(x, y) as HTMLElement
          });
          this.tapCount = 0;
        }
      }, 300);
    }
    
    this.lastTapTime = now;
  };

  /**
   * Handle swipe gestures
   */
  private handleSwipeGesture(
    deltaX: number, 
    deltaY: number, 
    distance: number, 
    duration: number, 
    velocity: number,
    endX: number,
    endY: number
  ): void {
    let gesture: TouchGesture;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      gesture = deltaX > 0 ? 'swipe-right' : 'swipe-left';
    } else {
      // Vertical swipe
      gesture = deltaY > 0 ? 'swipe-down' : 'swipe-up';
    }

    this.triggerGesture(gesture, {
      gesture,
      startX: this.touchStartX,
      startY: this.touchStartY,
      endX,
      endY,
      duration,
      distance,
      velocity,
      target: document.elementFromPoint(endX, endY) as HTMLElement
    });
  };

  /**
   * Handle pinch gestures
   */
  private handlePinchGesture(event: TouchEvent): void {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    if (this.initialDistance === 0) {
      this.initialDistance = distance;
    } else {
      const scale = distance / this.initialDistance;
      
      if (scale < 0.9) {
        this.triggerGesture('pinch-in', {
          gesture: 'pinch-in',
          startX: this.touchStartX,
          startY: this.touchStartY,
          endX: (touch1.clientX + touch2.clientX) / 2,
          endY: (touch1.clientY + touch2.clientY) / 2,
          duration: Date.now() - this.touchStartTime,
          distance: Math.abs(distance - this.initialDistance),
          velocity: 0,
          target: event.target as HTMLElement
        });
        this.initialDistance = 0;
      } else if (scale > 1.1) {
        this.triggerGesture('pinch-out', {
          gesture: 'pinch-out',
          startX: this.touchStartX,
          startY: this.touchStartY,
          endX: (touch1.clientX + touch2.clientX) / 2,
          endY: (touch1.clientY + touch2.clientY) / 2,
          duration: Date.now() - this.touchStartTime,
          distance: Math.abs(distance - this.initialDistance),
          velocity: 0,
          target: event.target as HTMLElement
        });
        this.initialDistance = 0;
      }
    }
  };

  /**
   * Trigger a gesture callback
   */
  private triggerGesture(gesture: TouchGesture, data: TouchEventData): void {
    const callbacks = this.callbacks.get(gesture) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in gesture callback for ${gesture}:`, error);
      }
    });
  }
}

/**
 * Viewport Management Class
 */
class ViewportManager {
  private config: ViewportConfig;
  private listeners: ((config: ViewportConfig) => void)[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private mediaQueries: MediaQueryList[] = [];

  constructor() {
    this.config = this.getCurrentViewportConfig();
    this.initializeViewportTracking();
  }

  /**
   * Get current viewport configuration
   */
  private getCurrentViewportConfig(): ViewportConfig {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';
    const pixelRatio = window.devicePixelRatio || 1;
    
    return {
      width,
      height,
      orientation,
      pixelRatio,
      isSmallScreen: width < 640,
      isMediumScreen: width >= 640 && width < 1024,
      isLargeScreen: width >= 1024
    };
  }

  /**
   * Initialize viewport tracking
   */
  private initializeViewportTracking(): void {
    // Track window resize
    window.addEventListener('resize', this.handleResize);
    
    // Track orientation change
    window.addEventListener('orientationchange', this.handleOrientationChange);
    
    // Set up media queries for responsive breakpoints
    this.setupMediaQueries();
    
    // Set up ResizeObserver for more accurate tracking if available
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(document.body);
    }
  }

  /**
   * Set up media queries for responsive breakpoints
   */
  private setupMediaQueries(): void {
    const breakpoints = [
      '(max-width: 639px)',
      '(min-width: 640px) and (max-width: 1023px)',
      '(min-width: 1024px)'
    ];
    
    breakpoints.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', this.handleResize);
      this.mediaQueries.push(mediaQuery);
    });
  }

  /**
   * Handle resize event
   */
  private handleResize = (): void => {
    const newConfig = this.getCurrentViewportConfig();
    
    // Only update if configuration changed
    if (
      newConfig.width !== this.config.width ||
      newConfig.height !== this.config.height ||
      newConfig.orientation !== this.config.orientation
    ) {
      this.config = newConfig;
      this.notifyListeners();
    }
  };

  /**
   * Handle orientation change event
   */
  private handleOrientationChange = (): void => {
    // Small delay to allow the browser to update dimensions
    setTimeout(this.handleResize, 100);
  };

  /**
   * Notify all listeners of viewport changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.config);
      } catch (error) {
        console.error('Error in viewport listener:', error);
      }
    });
  }

  /**
   * Add a viewport change listener
   */
  addListener(listener: (config: ViewportConfig) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a viewport change listener
   */
  removeListener(listener: (config: ViewportConfig) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Get current viewport configuration
   */
  getConfig(): ViewportConfig {
    return { ...this.config };
  }

  /**
   * Check if the current viewport matches a breakpoint
   */
  isBreakpoint(breakpoint: 'small' | 'medium' | 'large'): boolean {
    switch (breakpoint) {
      case 'small':
        return this.config.isSmallScreen;
      case 'medium':
        return this.config.isMediumScreen;
      case 'large':
        return this.config.isLargeScreen;
      default:
        return false;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    this.mediaQueries.forEach(mediaQuery => {
      mediaQuery.removeEventListener('change', this.handleResize);
    });
    
    this.listeners = [];
  }
}

/**
 * Mobile Performance Optimizer Class
 */
class MobilePerformanceOptimizer {
  private config: PerformanceConfig;
  private activeAnimations: Set<string> = new Set();
  private intersectionObserver: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableHardwareAcceleration: true,
      enableTouchOptimization: true,
      enableReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      enableLazyLoading: true,
      maxConcurrentAnimations: 3,
      animationDuration: 300,
      ...config
    };
    
    this.initializeOptimizations();
  }

  /**
   * Initialize performance optimizations
   */
  private initializeOptimizations(): void {
    // Enable hardware acceleration
    if (this.config.enableHardwareAcceleration) {
      this.enableHardwareAcceleration();
    }
    
    // Enable touch optimization
    if (this.config.enableTouchOptimization) {
      this.enableTouchOptimization();
    }
    
    // Set up lazy loading
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }
    
    // Set up mutation observer for performance monitoring
    this.setupMutationObserver();
  }

  /**
   * Enable hardware acceleration
   */
  private enableHardwareAcceleration(): void {
    // Add CSS transform to elements that will be animated
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enable touch optimization
   */
  private enableTouchOptimization(): void {
    // Add touch optimization styles
    const style = document.createElement('style');
    style.textContent = `
      .touch-optimized {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Set up lazy loading for images
   */
  private setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              this.loadElement(element);
              this.intersectionObserver?.unobserve(element);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
      
      // Observe elements with data-lazy attribute
      document.querySelectorAll('[data-lazy]').forEach(element => {
        this.intersectionObserver?.observe(element);
      });
    }
  }

  /**
   * Load a lazy element
   */
  private loadElement(element: HTMLElement): void {
    const src = element.getAttribute('data-src');
    if (src && element instanceof HTMLImageElement) {
      element.src = src;
      element.removeAttribute('data-src');
      element.classList.add('loaded');
    }
  }

  /**
   * Set up mutation observer for performance monitoring
   */
  private setupMutationObserver(): void {
    if ('MutationObserver' in window) {
      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Apply optimizations to new elements
                if (element.hasAttribute('data-mobile-optimized')) {
                  this.optimizeElement(element as HTMLElement);
                }
                
                // Set up lazy loading for new images
                if (element.hasAttribute('data-lazy') && this.intersectionObserver) {
                  this.intersectionObserver.observe(element);
                }
              }
            });
          }
        });
      });
      
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Optimize an element for mobile performance
   */
  optimizeElement(element: HTMLElement): void {
    // Add mobile optimization classes
    if (this.config.enableHardwareAcceleration) {
      element.classList.add('mobile-optimized');
    }
    
    if (this.config.enableTouchOptimization) {
      element.classList.add('touch-optimized');
    }
  }

  /**
   * Start an animation with performance constraints
   */
  startAnimation(id: string): boolean {
    if (this.activeAnimations.size >= this.config.maxConcurrentAnimations) {
      return false;
    }
    
    this.activeAnimations.add(id);
    return true;
  }

  /**
   * End an animation
   */
  endAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  /**
   * Create an optimized animation
   */
  createAnimation(
    element: HTMLElement, 
    keyframes: Keyframe[], 
    options?: KeyframeAnimationOptions
  ): Animation | null {
    if (!this.startAnimation(element.id)) {
      return null;
    }
    
    const animation = element.animate(keyframes, {
      duration: this.config.animationDuration,
      easing: 'ease-out',
      ...options
    });
    
    animation.addEventListener('finish', () => {
      this.endAnimation(element.id);
    });
    
    return animation;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    this.activeAnimations.clear();
  }
}

// Create singleton instances
const touchGestureRecognizer = new TouchGestureRecognizer();
const viewportManager = new ViewportManager();
const performanceOptimizer = new MobilePerformanceOptimizer();

/**
 * Mobile Optimization API
 */
export const mobileOptimization = {
  // Touch gesture recognition
  touch: {
    recognizer: touchGestureRecognizer,
    on: (gesture: TouchGesture, callback: TouchGestureCallback) => 
      touchGestureRecognizer.on(gesture, callback),
    off: (gesture: TouchGesture, callback: TouchGestureCallback) => 
      touchGestureRecognizer.off(gesture, callback),
    attach: (element: HTMLElement) => touchGestureRecognizer.attach(element),
    detach: (element: HTMLElement) => touchGestureRecognizer.detach(element)
  },
  
  // Viewport management
  viewport: {
    manager: viewportManager,
    getConfig: () => viewportManager.getConfig(),
    isBreakpoint: (breakpoint: 'small' | 'medium' | 'large') => 
      viewportManager.isBreakpoint(breakpoint),
    addListener: (listener: (config: ViewportConfig) => void) => 
      viewportManager.addListener(listener),
    removeListener: (listener: (config: ViewportConfig) => void) => 
      viewportManager.removeListener(listener)
  },
  
  // Performance optimization
  performance: {
    optimizer: performanceOptimizer,
    optimizeElement: (element: HTMLElement) => 
      performanceOptimizer.optimizeElement(element),
    createAnimation: (
      element: HTMLElement, 
      keyframes: Keyframe[], 
      options?: KeyframeAnimationOptions
    ) => performanceOptimizer.createAnimation(element, keyframes, options),
    startAnimation: (id: string) => performanceOptimizer.startAnimation(id),
    endAnimation: (id: string) => performanceOptimizer.endAnimation(id)
  }
};

/**
 * Utility functions for mobile optimization
 */
export const mobileUtils = {
  /**
   * Check if the device is mobile
   */
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || viewportManager.isBreakpoint('small');
  },
  
  /**
   * Check if the device supports touch
   */
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  /**
   * Get safe area insets for notched displays
   */
  getSafeAreaInsets: () => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
      right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
      bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
    };
  },
  
  /**
   * Apply safe area insets to an element
   */
  applySafeAreaInsets: (element: HTMLElement) => {
    const insets = mobileUtils.getSafeAreaInsets();
    element.style.paddingTop = `max(${insets.top}px, var(--default-padding-top, 0))`;
    element.style.paddingRight = `max(${insets.right}px, var(--default-padding-right, 0))`;
    element.style.paddingBottom = `max(${insets.bottom}px, var(--default-padding-bottom, 0))`;
    element.style.paddingLeft = `max(${insets.left}px, var(--default-padding-left, 0))`;
  },
  
  /**
   * Prevent scroll bounce on iOS
   */
  preventScrollBounce: () => {
    document.body.addEventListener('touchmove', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });
  },
  
  /**
   * Enable smooth scrolling for mobile
   */
  enableSmoothScrolling: () => {
    document.documentElement.style.scrollBehavior = 'smooth';
    (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
  },
  
  /**
   * Optimize images for mobile
   */
  optimizeImageSrc: (src: string, width?: number): string => {
    if (!width) {
      width = viewportManager.getConfig().width;
    }
    
    // Add width parameter to image URL if supported
    if (src.includes('?')) {
      return `${src}&w=${width}`;
    } else {
      return `${src}?w=${width}`;
    }
  }
};

// Initialize mobile optimizations on module load
if (typeof window !== 'undefined') {
  // Apply safe area insets to root element
  mobileUtils.applySafeAreaInsets(document.documentElement);
  
  // Enable smooth scrolling
  mobileUtils.enableSmoothScrolling();
  
  // Prevent scroll bounce on iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    mobileUtils.preventScrollBounce();
  }
}

export default mobileOptimization;