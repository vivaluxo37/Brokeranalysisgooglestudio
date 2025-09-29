import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchResult } from './searchEngine';

/**
 * Web Scrapers for Reliable Forex Industry Sources
 * Extracts specific broker information from trusted websites
 */

export interface ScrapedBrokerData {
  brokerName: string;
  source: string;
  url: string;
  scrapedAt: Date;
  data: {
    regulation?: string[];
    minDeposit?: number;
    spreads?: { pair: string; spread: string }[];
    rating?: number;
    pros?: string[];
    cons?: string[];
    summary?: string;
    platforms?: string[];
    rawText?: string;
  };
  confidence: number; // 0-1
}

export interface ScraperOptions {
  timeout?: number;
  retries?: number;
  userAgent?: string;
  headers?: Record<string, string>;
}

export class BrokerWebScrapers {
  private readonly defaultOptions: ScraperOptions = {
    timeout: 15000,
    retries: 3,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  };

  /**
   * Scrapes broker information from a search result
   */
  public async scrapeBrokerInfo(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    const domain = this.extractDomain(searchResult.link);
    
    try {
      switch (domain) {
        case 'forexpeacearmy.com':
          return await this.scrapeForexPeaceArmy(searchResult, brokerName);
        case 'fxempire.com':
          return await this.scrapeFXEmpire(searchResult, brokerName);
        case 'babypips.com':
          return await this.scrapeBabyPips(searchResult, brokerName);
        case 'dailyfx.com':
          return await this.scrapeDailyFX(searchResult, brokerName);
        default:
          return await this.scrapeGeneric(searchResult, brokerName);
      }
    } catch (error) {
      console.error(`❌ Scraping failed for ${searchResult.link}:`, error);
      return this.createEmptyResult(searchResult, brokerName);
    }
  }

  /**
   * Scrapes multiple URLs concurrently
   */
  public async scrapeMultiple(searchResults: SearchResult[], brokerName: string): Promise<ScrapedBrokerData[]> {
    const promises = searchResults.map(result => 
      this.scrapeBrokerInfo(result, brokerName)
    );

    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter((result): result is PromiseFulfilledResult<ScrapedBrokerData> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .filter(data => data.confidence > 0);
    } catch (error) {
      console.error('❌ Batch scraping failed:', error);
      return [];
    }
  }

  /**
   * Checks if a website allows scraping (robots.txt check)
   */
  public async checkRobotsPermission(url: string): Promise<boolean> {
    try {
      const domain = this.extractDomain(url);
      const robotsUrl = `https://${domain}/robots.txt`;
      
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: { 'User-Agent': this.defaultOptions.userAgent }
      });

      const robotsText = response.data.toLowerCase();
      
      // Check if our user agent or * is disallowed
      const lines = robotsText.split('\n');
      let currentUserAgent = '';
      let disallowed = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('user-agent:')) {
          currentUserAgent = trimmed.split(':')[1].trim();
        } else if (trimmed.startsWith('disallow:') && 
                  (currentUserAgent === '*' || currentUserAgent.includes('broker-analysis'))) {
          const disallowPath = trimmed.split(':')[1].trim();
          if (disallowPath === '/' || url.includes(disallowPath)) {
            disallowed = true;
            break;
          }
        }
      }

      return !disallowed;
    } catch (error) {
      // If we can't check robots.txt, assume it's okay
      return true;
    }
  }

  // Private scraper methods for specific sites

  private async scrapeForexPeaceArmy(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    const html = await this.fetchPage(searchResult.link);
    const $ = cheerio.load(html);

    const data: ScrapedBrokerData['data'] = {};
    let confidence = 0.3; // Base confidence for FPA

    try {
      // Extract rating
      const ratingText = $('.rating-value, .broker-rating').first().text().trim();
      if (ratingText) {
        data.rating = parseFloat(ratingText);
        confidence += 0.2;
      }

      // Extract regulation info
      const regulationText = $('.regulation, .regulatory-info').text();
      if (regulationText) {
        data.regulation = this.extractRegulators(regulationText);
        confidence += 0.2;
      }

      // Extract pros and cons
      const prosElements = $('.pros li, .positive-features li');
      if (prosElements.length > 0) {
        data.pros = prosElements.map((i, el) => $(el).text().trim()).get();
        confidence += 0.1;
      }

      const consElements = $('.cons li, .negative-features li');
      if (consElements.length > 0) {
        data.cons = consElements.map((i, el) => $(el).text().trim()).get();
        confidence += 0.1;
      }

      // Extract summary
      const summaryText = $('.review-summary, .broker-overview').first().text().trim();
      if (summaryText && summaryText.length > 50) {
        data.summary = summaryText.substring(0, 500);
        confidence += 0.1;
      }

    } catch (error) {
      console.error('Error parsing FPA page:', error);
    }

    return {
      brokerName,
      source: 'forexpeacearmy.com',
      url: searchResult.link,
      scrapedAt: new Date(),
      data,
      confidence: Math.min(confidence, 1.0)
    };
  }

  private async scrapeFXEmpire(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    const html = await this.fetchPage(searchResult.link);
    const $ = cheerio.load(html);

    const data: ScrapedBrokerData['data'] = {};
    let confidence = 0.4; // Base confidence for FXEmpire

    try {
      // Extract minimum deposit
      const depositText = $('.minimum-deposit, .min-deposit').text();
      const depositMatch = depositText.match(/\$?(\d+(?:,\d{3})*)/);
      if (depositMatch) {
        data.minDeposit = parseInt(depositMatch[1].replace(/,/g, ''));
        confidence += 0.2;
      }

      // Extract spreads information
      const spreadElements = $('.spread-info tr, .trading-costs tr');
      if (spreadElements.length > 0) {
        data.spreads = [];
        spreadElements.each((i, el) => {
          const cells = $(el).find('td');
          if (cells.length >= 2) {
            const pair = $(cells[0]).text().trim();
            const spread = $(cells[1]).text().trim();
            if (pair && spread) {
              data.spreads!.push({ pair, spread });
            }
          }
        });
        if (data.spreads.length > 0) confidence += 0.2;
      }

      // Extract platforms
      const platformsText = $('.platforms, .trading-platforms').text();
      if (platformsText) {
        data.platforms = this.extractPlatforms(platformsText);
        confidence += 0.1;
      }

    } catch (error) {
      console.error('Error parsing FXEmpire page:', error);
    }

    return {
      brokerName,
      source: 'fxempire.com',
      url: searchResult.link,
      scrapedAt: new Date(),
      data,
      confidence: Math.min(confidence, 1.0)
    };
  }

  private async scrapeBabyPips(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    const html = await this.fetchPage(searchResult.link);
    const $ = cheerio.load(html);

    const data: ScrapedBrokerData['data'] = {};
    let confidence = 0.3; // Base confidence for BabyPips

    try {
      // Extract educational content about the broker
      const contentText = $('.post-content, .article-content').text();
      if (contentText && contentText.length > 100) {
        data.summary = this.extractRelevantSentences(contentText, brokerName).substring(0, 500);
        confidence += 0.2;
      }

      // Look for broker features mentioned
      const featuresText = $('.broker-features, .features-list').text();
      if (featuresText) {
        const features = this.extractFeatures(featuresText);
        if (features.length > 0) {
          data.pros = features;
          confidence += 0.2;
        }
      }

    } catch (error) {
      console.error('Error parsing BabyPips page:', error);
    }

    return {
      brokerName,
      source: 'babypips.com',
      url: searchResult.link,
      scrapedAt: new Date(),
      data,
      confidence: Math.min(confidence, 1.0)
    };
  }

  private async scrapeDailyFX(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    const html = await this.fetchPage(searchResult.link);
    const $ = cheerio.load(html);

    const data: ScrapedBrokerData['data'] = {};
    let confidence = 0.3; // Base confidence for DailyFX

    try {
      // Extract analysis content
      const analysisText = $('.article-body, .content-body').text();
      if (analysisText && analysisText.length > 100) {
        data.summary = this.extractRelevantSentences(analysisText, brokerName).substring(0, 500);
        confidence += 0.2;
      }

    } catch (error) {
      console.error('Error parsing DailyFX page:', error);
    }

    return {
      brokerName,
      source: 'dailyfx.com',
      url: searchResult.link,
      scrapedAt: new Date(),
      data,
      confidence: Math.min(confidence, 1.0)
    };
  }

  private async scrapeGeneric(searchResult: SearchResult, brokerName: string): Promise<ScrapedBrokerData> {
    try {
      const html = await this.fetchPage(searchResult.link);
      const $ = cheerio.load(html);

      const data: ScrapedBrokerData['data'] = {};
      let confidence = 0.1; // Low base confidence for generic scraping

      // Extract text content
      const bodyText = $('body').text().toLowerCase();
      const brokerNameLower = brokerName.toLowerCase();

      // Check if the page actually talks about the broker
      const brokerMentions = (bodyText.match(new RegExp(brokerNameLower, 'g')) || []).length;
      if (brokerMentions < 2) {
        confidence = 0; // Not relevant
      } else {
        confidence += Math.min(brokerMentions * 0.05, 0.3);

        // Look for key information in the snippet
        const snippet = searchResult.snippet.toLowerCase();
        
        // Extract potential minimum deposit
        const depositMatch = snippet.match(/\$?(\d+(?:,\d{3})*)\s*(?:minimum|min|deposit)/);
        if (depositMatch) {
          data.minDeposit = parseInt(depositMatch[1].replace(/,/g, ''));
          confidence += 0.1;
        }

        // Look for regulation mentions
        const regulationKeywords = ['regulated', 'fca', 'asic', 'cysec', 'license'];
        const hasRegulation = regulationKeywords.some(keyword => snippet.includes(keyword));
        if (hasRegulation) {
          data.regulation = this.extractRegulators(snippet);
          confidence += 0.1;
        }

        // Use snippet as summary if relevant
        if (snippet.length > 50) {
          data.summary = searchResult.snippet;
          confidence += 0.1;
        }
      }

      return {
        brokerName,
        source: this.extractDomain(searchResult.link),
        url: searchResult.link,
        scrapedAt: new Date(),
        data,
        confidence: Math.min(confidence, 1.0)
      };

    } catch (error) {
      console.error('Generic scraping failed:', error);
      return this.createEmptyResult(searchResult, brokerName);
    }
  }

  // Helper methods

  private async fetchPage(url: string): Promise<string> {
    const response = await axios.get(url, {
      timeout: this.defaultOptions.timeout,
      headers: {
        'User-Agent': this.defaultOptions.userAgent,
        ...this.defaultOptions.headers
      },
      validateStatus: (status) => status < 500 // Accept 4xx errors
    });

    return response.data;
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  }

  private extractRegulators(text: string): string[] {
    const regulators = ['FCA', 'ASIC', 'CySEC', 'ESMA', 'FSA', 'FINRA', 'SEC', 'BaFin', 'AMF', 'CONSOB'];
    const found = regulators.filter(reg => 
      new RegExp(`\\b${reg}\\b`, 'i').test(text)
    );
    return found;
  }

  private extractPlatforms(text: string): string[] {
    const platforms = ['MetaTrader 4', 'MetaTrader 5', 'MT4', 'MT5', 'cTrader', 'TradingView', 'Web Platform'];
    const found = platforms.filter(platform => 
      new RegExp(`\\b${platform}\\b`, 'i').test(text)
    );
    return found;
  }

  private extractFeatures(text: string): string[] {
    const features = [
      'low spreads', 'competitive spreads', 'no commission', 'fast execution',
      '24/7 support', 'demo account', 'educational resources', 'mobile app',
      'API access', 'copy trading', 'social trading', 'automated trading'
    ];
    
    return features.filter(feature => 
      new RegExp(`\\b${feature}\\b`, 'i').test(text)
    );
  }

  private extractRelevantSentences(text: string, brokerName: string): string {
    const sentences = text.split(/[.!?]+/);
    const brokerNameLower = brokerName.toLowerCase();
    
    const relevantSentences = sentences
      .filter(sentence => sentence.toLowerCase().includes(brokerNameLower))
      .slice(0, 3);
    
    return relevantSentences.join('. ').trim();
  }

  private createEmptyResult(searchResult: SearchResult, brokerName: string): ScrapedBrokerData {
    return {
      brokerName,
      source: this.extractDomain(searchResult.link),
      url: searchResult.link,
      scrapedAt: new Date(),
      data: {
        summary: searchResult.snippet
      },
      confidence: 0
    };
  }
}

// Export singleton instance
export const webScrapers = new BrokerWebScrapers();