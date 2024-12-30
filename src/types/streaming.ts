// src/types/streaming.ts

export interface StreamingProvider {
    id: string;
    name: string;
    logo: string;
    requiresSubscription: boolean;
    streamingUrl?: string;
  }
  
  export interface StreamingOption {
    provider: StreamingProvider;
    price?: number; // Made optional to accommodate missing price data
    qualities?: StreamingQuality[];
    streamingUrl?: string;
  }
  
  export interface StreamingInfo {
    movieId: string;
    providers: {
      stream: StreamingProvider[]; // Made non-optional
      rent: StreamingOption[];     // Made non-optional
      buy: StreamingOption[];      // Made non-optional
    };
    lastUpdated?: string; // ISO date string
    region?: string;
  }
  
  /**
   * Represents pricing information for different streaming qualities.
   */
  export interface StreamingQuality {
    type: 'SD' | 'HD' | '4K';
    available: boolean;
    price?: number;
  }
  
  /**
   * Represents metadata for a streaming provider.
   */
  export interface ProviderMetadata {
    id: string;
    name: string;
    technicalName: string; // Used for API calls
    baseUrl: string;
    logoUrl: string;
    pricing?: {
      subscription?: ProviderPricing;
      rental?: ProviderPricing;
      purchase?: ProviderPricing;
    };
  }
  
  export interface ProviderPricing {
    SD?: number;
    HD?: number;
    '4K'?: number;
  }
  