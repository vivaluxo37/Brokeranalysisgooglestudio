type ConversionContext = Record<string, unknown>;

interface AffiliateClickData {
  affiliateId: string;
  brokerId?: string;
  brokerName?: string;
  campaignId?: string;
  linkId?: string;
  linkUrl?: string;
  linkType?: string;
  placement?: string;
  metadata?: ConversionContext;
  timestamp?: number;
}

interface ConversionOptions {
  type: string;
  value?: number;
  currency?: string;
  metadata?: ConversionContext;
}

const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

const storeKey = {
  conversions: 'conversion_tracking_events',
  affiliateClicks: 'conversion_tracking_affiliate_clicks',
};

type ConversionEvent = ConversionOptions & {
  id: string;
  sessionId: string;
  path: string;
  userAgent?: string;
  timestamp: number;
};

const MAX_STORED_EVENTS = 250;
const MAX_AFFILIATE_CLICKS = 250;

const SAFE_DEFAULT_CONTEXT: ConversionEvent = {
  id: 'noop',
  type: 'noop',
  sessionId: 'server',
  path: '/',
  timestamp: Date.now(),
};

function readFromStorage<T>(key: string): T | undefined {
  if (!isBrowser) return undefined;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('[conversionTracking] Failed to read from storage', error);
    return undefined;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('[conversionTracking] Failed to persist storage', error);
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function getSessionId(): string {
  if (!isBrowser) return 'server';

  const key = 'conversion_tracking_session_id';
  let sessionId = window.sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = generateId();
    try {
      window.sessionStorage.setItem(key, sessionId);
    } catch (error) {
      console.warn('[conversionTracking] Unable to persist session id', error);
    }
  }

  return sessionId;
}

function collectBaseContext(): Pick<ConversionEvent, 'sessionId' | 'path' | 'userAgent'> {
  if (!isBrowser) {
    return {
      sessionId: 'server',
      path: '/',
      userAgent: undefined,
    };
  }

  return {
    sessionId: getSessionId(),
    path: window.location.pathname,
    userAgent: window.navigator.userAgent,
  };
}

function recordEvent(event: ConversionEvent): void {
  if (!isBrowser) return;

  const events = readFromStorage<ConversionEvent[]>(storeKey.conversions) ?? [];
  const nextEvents = [...events.slice(-MAX_STORED_EVENTS + 1), event];
  writeToStorage(storeKey.conversions, nextEvents);
}

function recordAffiliateClick(click: AffiliateClickData & { id: string }): void {
  if (!isBrowser) return;

  const clicks = readFromStorage<(AffiliateClickData & { id: string })[]>(storeKey.affiliateClicks) ?? [];
  const nextClicks = [...clicks.slice(-MAX_AFFILIATE_CLICKS + 1), click];
  writeToStorage(storeKey.affiliateClicks, nextClicks);
}

function buildEvent(options: ConversionOptions): ConversionEvent {
  const base = collectBaseContext();

  return {
    id: generateId(),
    timestamp: Date.now(),
    ...options,
    sessionId: base.sessionId,
    path: base.path,
    userAgent: base.userAgent,
  };
}

function emitEvent(event: ConversionEvent): void {
  if (!isBrowser) return;

  recordEvent(event);

  const analyticsDisabled = Boolean(window.localStorage.getItem('conversion_tracking_disable_emit'));
  if (analyticsDisabled) return;

  try {
    window.dispatchEvent(
      new CustomEvent('conversion-tracking:event', { detail: event }),
    );
  } catch (error) {
    console.warn('[conversionTracking] Failed to emit event', error);
  }
}

export function trackConversion(options: ConversionOptions): string {
  const event = buildEvent(options);
  emitEvent(event);
  return event.id;
}

export function trackAffiliateLinkClick(data: AffiliateClickData): string {
  const id = generateId();
  const click = {
    id,
    timestamp: Date.now(),
    ...data,
  };

  recordAffiliateClick(click);

  trackConversion({
    type: 'affiliate_click',
    metadata: {
      affiliateId: data.affiliateId,
      brokerId: data.brokerId,
      brokerName: data.brokerName,
      campaignId: data.campaignId,
      linkId: data.linkId,
      linkType: data.linkType,
      placement: data.placement,
    },
  });

  return id;
}

export function getRecentConversions(): ConversionEvent[] {
  return readFromStorage<ConversionEvent[]>(storeKey.conversions) ?? [SAFE_DEFAULT_CONTEXT];
}

export function getRecentAffiliateClicks(): (AffiliateClickData & { id: string })[] {
  return readFromStorage<(AffiliateClickData & { id: string })[]>(storeKey.affiliateClicks) ?? [];
}

export function clearConversionHistory(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(storeKey.conversions);
  window.localStorage.removeItem(storeKey.affiliateClicks);
}

export type { AffiliateClickData, ConversionEvent, ConversionOptions };
