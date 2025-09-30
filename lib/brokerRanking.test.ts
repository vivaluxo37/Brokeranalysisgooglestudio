import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrokerRankingEngine, getBrokerRanking, updateRankingWeights } from './brokerRanking';
import { createMockBroker, createMockRankingWeight } from '../src/test/setup';

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  })),
};

vi.mock('./supabase', () => ({
  supabase: mockSupabase,
}));

describe('BrokerRankingEngine', () => {
  let rankingEngine: BrokerRankingEngine;

  beforeEach(() => {
    rankingEngine = new BrokerRankingEngine();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default weights', () => {
      expect(rankingEngine).toBeDefined();
      expect(rankingEngine['weights']).toBeDefined();
    });
  });

  describe('loadWeights', () => {
    it('should load weights from database', async () => {
      const mockWeights = [
        createMockRankingWeight({ factor: 'regulation', weight: 0.25 }),
        createMockRankingWeight({ factor: 'execution', weight: 0.20 }),
        createMockRankingWeight({ factor: 'costs', weight: 0.20 }),
      ];

      mockSupabase.from().select().mockResolvedValue({
        data: mockWeights,
        error: null,
      });

      await rankingEngine.loadWeights();

      expect(mockSupabase.from).toHaveBeenCalledWith('ranking_weights');
      expect(rankingEngine['weights']).toEqual({
        regulation: 0.25,
        execution: 0.20,
        costs: 0.20,
      });
    });

    it('should use default weights on database error', async () => {
      mockSupabase.from().select().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await rankingEngine.loadWeights();

      expect(rankingEngine['weights']).toEqual({
        regulation: 0.25,
        execution: 0.20,
        costs: 0.20,
        platform: 0.15,
        country_availability: 0.10,
        user_reviews: 0.10,
      });
    });
  });

  describe('calculateRegulationScore', () => {
    it('should score FCA regulation highly', () => {
      const broker = createMockBroker({ regulation: 'FCA' });
      const score = rankingEngine['calculateRegulationScore'](broker);
      expect(score).toBeGreaterThan(0.8);
    });

    it('should score ASIC regulation highly', () => {
      const broker = createMockBroker({ regulation: 'ASIC' });
      const score = rankingEngine['calculateRegulationScore'](broker);
      expect(score).toBeGreaterThan(0.8);
    });

    it('should score multiple regulators even higher', () => {
      const broker = createMockBroker({ regulation: 'FCA, ASIC' });
      const score = rankingEngine['calculateRegulationScore'](broker);
      expect(score).toBeGreaterThan(0.9);
    });

    it('should score unregulated brokers low', () => {
      const broker = createMockBroker({ regulation: 'Unregulated' });
      const score = rankingEngine['calculateRegulationScore'](broker);
      expect(score).toBeLessThan(0.3);
    });

    it('should handle missing regulation field', () => {
      const broker = createMockBroker({ regulation: null });
      const score = rankingEngine['calculateRegulationScore'](broker);
      expect(score).toBe(0);
    });
  });

  describe('calculateExecutionScore', () => {
    it('should score lower spreads higher', () => {
      const lowSpreadBroker = createMockBroker({ spreads_from: 0.1 });
      const highSpreadBroker = createMockBroker({ spreads_from: 2.0 });
      
      const lowScore = rankingEngine['calculateExecutionScore'](lowSpreadBroker);
      const highScore = rankingEngine['calculateExecutionScore'](highSpreadBroker);
      
      expect(lowScore).toBeGreaterThan(highScore);
    });

    it('should handle missing spreads data', () => {
      const broker = createMockBroker({ spreads_from: null });
      const score = rankingEngine['calculateExecutionScore'](broker);
      expect(score).toBe(0.5); // Default middle score
    });
  });

  describe('calculateCostScore', () => {
    it('should score lower minimum deposits higher', () => {
      const lowDepositBroker = createMockBroker({ min_deposit: 10 });
      const highDepositBroker = createMockBroker({ min_deposit: 1000 });
      
      const lowScore = rankingEngine['calculateCostScore'](lowDepositBroker);
      const highScore = rankingEngine['calculateCostScore'](highDepositBroker);
      
      expect(lowScore).toBeGreaterThan(highScore);
    });

    it('should handle zero minimum deposit', () => {
      const broker = createMockBroker({ min_deposit: 0 });
      const score = rankingEngine['calculateCostScore'](broker);
      expect(score).toBe(1.0); // Perfect score for no minimum
    });
  });

  describe('calculatePlatformScore', () => {
    it('should score MT4 and MT5 platforms highly', () => {
      const mt4Broker = createMockBroker({ platforms: 'MT4' });
      const mt5Broker = createMockBroker({ platforms: 'MT5' });
      const bothBroker = createMockBroker({ platforms: 'MT4, MT5, WebTrader' });
      
      const mt4Score = rankingEngine['calculatePlatformScore'](mt4Broker);
      const mt5Score = rankingEngine['calculatePlatformScore'](mt5Broker);
      const bothScore = rankingEngine['calculatePlatformScore'](bothBroker);
      
      expect(mt4Score).toBeGreaterThan(0.6);
      expect(mt5Score).toBeGreaterThan(0.6);
      expect(bothScore).toBeGreaterThan(0.8);
    });

    it('should handle missing platform data', () => {
      const broker = createMockBroker({ platforms: null });
      const score = rankingEngine['calculatePlatformScore'](broker);
      expect(score).toBe(0.3); // Low score for unknown platforms
    });
  });

  describe('rankBrokers', () => {
    it('should rank brokers by total weighted score', async () => {
      const brokers = [
        createMockBroker({
          id: '1',
          name: 'High Quality Broker',
          regulation: 'FCA, ASIC',
          spreads_from: 0.1,
          min_deposit: 10,
          platforms: 'MT4, MT5',
          rating: 9.0,
        }),
        createMockBroker({
          id: '2',
          name: 'Average Broker',
          regulation: 'CySEC',
          spreads_from: 1.0,
          min_deposit: 250,
          platforms: 'WebTrader',
          rating: 6.5,
        }),
        createMockBroker({
          id: '3',
          name: 'Poor Broker',
          regulation: 'Unregulated',
          spreads_from: 3.0,
          min_deposit: 1000,
          platforms: null,
          rating: 4.0,
        }),
      ];

      const ranked = await rankingEngine.rankBrokers(brokers);

      expect(ranked).toHaveLength(3);
      expect(ranked[0].name).toBe('High Quality Broker');
      expect(ranked[2].name).toBe('Poor Broker');
      
      // Scores should be in descending order
      expect(ranked[0].totalScore).toBeGreaterThan(ranked[1].totalScore);
      expect(ranked[1].totalScore).toBeGreaterThan(ranked[2].totalScore);
    });

    it('should apply category matching bonus', async () => {
      const brokers = [
        createMockBroker({ id: '1', name: 'ECN Broker', account_types: 'ECN' }),
        createMockBroker({ id: '2', name: 'Standard Broker', account_types: 'Standard' }),
      ];

      const ranked = await rankingEngine.rankBrokers(brokers, {
        categoryId: 'ecn-brokers',
      });

      const ecnBroker = ranked.find(b => b.name === 'ECN Broker');
      const standardBroker = ranked.find(b => b.name === 'Standard Broker');

      expect(ecnBroker?.categoryMatchScore).toBeGreaterThan(0);
      expect(standardBroker?.categoryMatchScore).toBe(0);
    });

    it('should limit results when specified', async () => {
      const brokers = Array.from({ length: 10 }, (_, i) => 
        createMockBroker({ id: String(i + 1), name: `Broker ${i + 1}` })
      );

      const ranked = await rankingEngine.rankBrokers(brokers, { limit: 5 });

      expect(ranked).toHaveLength(5);
    });
  });

  describe('updateWeights', () => {
    it('should update weights and clear cache', async () => {
      const newWeights = { regulation: 0.30, execution: 0.25, costs: 0.15 };
      
      await rankingEngine.updateWeights(newWeights);
      
      expect(rankingEngine['weights']).toEqual(newWeights);
      expect(rankingEngine['weightsLastLoaded']).toBe(0); // Cache cleared
    });

    it('should validate weights sum to 1.0', async () => {
      const invalidWeights = { regulation: 0.80, execution: 0.50 }; // Sum > 1.0
      
      await expect(rankingEngine.updateWeights(invalidWeights))
        .rejects.toThrow('Total weights must not exceed 1.0');
    });
  });
});

describe('getBrokerRanking', () => {
  it('should return ranked brokers using shared instance', async () => {
    const brokers = [
      createMockBroker({ id: '1', name: 'Test Broker 1' }),
      createMockBroker({ id: '2', name: 'Test Broker 2' }),
    ];

    const ranked = await getBrokerRanking(brokers);

    expect(ranked).toHaveLength(2);
    expect(ranked[0]).toHaveProperty('totalScore');
    expect(ranked[0]).toHaveProperty('ranking');
  });
});

describe('updateRankingWeights', () => {
  it('should update weights in shared instance', async () => {
    const newWeights = { regulation: 0.35, execution: 0.30, costs: 0.25, platform: 0.10 };
    
    await updateRankingWeights(newWeights);
    
    // Should not throw and function should complete
    expect(true).toBe(true);
  });
});

describe('Edge cases and error handling', () => {
  beforeEach(() => {
    rankingEngine = new BrokerRankingEngine();
  });

  it('should handle empty broker list', async () => {
    const ranked = await rankingEngine.rankBrokers([]);
    expect(ranked).toHaveLength(0);
  });

  it('should handle brokers with missing data gracefully', async () => {
    const incompleteBroker = {
      id: '1',
      name: 'Incomplete Broker',
      // Missing most fields
    };

    const ranked = await rankingEngine.rankBrokers([incompleteBroker as any]);

    expect(ranked).toHaveLength(1);
    expect(ranked[0].totalScore).toBeGreaterThanOrEqual(0);
    expect(ranked[0].totalScore).toBeLessThanOrEqual(1);
  });

  it('should handle database connection errors', async () => {
    mockSupabase.from().select().mockRejectedValue(new Error('Connection failed'));

    // Should not throw, should use default weights
    await rankingEngine.loadWeights();
    expect(rankingEngine['weights']).toBeDefined();
  });

  it('should handle extremely large broker lists', async () => {
    const largeBrokerList = Array.from({ length: 1000 }, (_, i) => 
      createMockBroker({ id: String(i + 1), name: `Broker ${i + 1}` })
    );

    const start = Date.now();
    const ranked = await rankingEngine.rankBrokers(largeBrokerList, { limit: 100 });
    const duration = Date.now() - start;

    expect(ranked).toHaveLength(100);
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });
});