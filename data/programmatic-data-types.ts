
/**
 * Programmatic SEO Data Types
 *
 * TypeScript definitions for the programmatic seed data.
 */

export interface Country {
  code: string;
  name: string;
  region: string;
  currency: string;
  languages: string[];
  regulatory_authority: string;
  trading_popularity: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Strategy {
  slug: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Feature {
  slug: string;
  name: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
}

export interface ProgrammaticTemplate {
  page_type: string;
  title_template: string;
  meta_description_template: string;
  content_template: string;
  structured_data_template: Record<string, any>;
}

export interface SeedData {
  countries: Country[];
  categories: Category[];
  strategies: Strategy[];
  features: Feature[];
  templates: ProgrammaticTemplate[];
  metadata: {
    generated_at: string;
    total_countries: number;
    total_categories: number;
    total_strategies: number;
    total_features: number;
    total_templates: number;
  };
}
    