import { z } from 'zod';

// Broker data validation schemas
export const BrokerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  website: z.string().url(),
  yearFounded: z.number().min(1900).max(new Date().getFullYear()),
  headquarters: z.string(),
  regulation: z.array(z.object({
    authority: z.string(),
    licenseNumber: z.string(),
    status: z.enum(['active', 'suspended', 'revoked'])
  })),
  tradingConditions: z.object({
    spreads: z.object({
      eurusd: z.number().min(0),
      gbpusd: z.number().min(0),
      usdjpy: z.number().min(0)
    }),
    commission: z.number().min(0).optional(),
    leverage: z.number().min(1).max(5000),
    minDeposit: z.string(),
    platforms: z.array(z.string())
  }),
  fees: z.object({
    inactivity: z.number().min(0).optional(),
    withdrawal: z.number().min(0).optional(),
    deposit: z.array(z.object({
      method: z.string(),
      fee: z.number().min(0),
      minAmount: z.string()
    }))
  }).optional(),
  ratings: z.object({
    regulation: z.number().min(0).max(10),
    costs: z.number().min(0).max(10),
    platforms: z.number().min(0).max(10),
    support: z.number().min(0).max(10)
  }),
  features: z.array(z.string()),
  customerSupport: z.object({
    languages: z.array(z.string()),
    availability: z.string(),
    methods: z.array(z.string())
  })
});

export const ReviewSchema = z.object({
  id: z.string().optional(),
  brokerId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(2000),
  tradingExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  accountType: z.string(),
  verified: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  tradingLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  preferredBrokers: z.array(z.string()).optional(),
  createdAt: z.date().optional()
});

// API request validation schemas
export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  context: z.enum(['chatbot', 'tutor']).default('chatbot')
});

export const BrokerQuerySchema = z.object({
  search: z.string().optional(),
  regulation: z.string().optional(),
  minDeposit: z.string().optional(),
  platform: z.string().optional(),
  leverage: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0)
});

export const ComparisonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  brokerIds: z.array(z.string()).min(2).max(5),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type Broker = z.infer<typeof BrokerSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type User = z.infer<typeof UserSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type BrokerQuery = z.infer<typeof BrokerQuerySchema>;
export type Comparison = z.infer<typeof ComparisonSchema>;