// src/services/watchmode.ts

import axios from 'axios';
import { StreamingInfo, StreamingProvider, StreamingOption } from '../types/streaming';

const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';

/**
 * Interface representing a search result from Watchmode.
 */
interface WatchmodeSearchResult {
  title: string;
  id: number;
  type: 'movie' | 'tv';
  release_year: number;
}

/**
 * Interface representing a streaming source from Watchmode.
 */
interface WatchmodeSource {
  source_id: number;
  name: string;
  type: string; // e.g., 'free', 'sub', etc.
  region: string;
  ios_url: string;
  android_url: string;
  web_url: string;
  url?: string; // Sometimes absent; watchmode typically returns `web_url`.
}

/**
 * Searches for content on Watchmode based on the name, year, and type.
 * @param query - The name to search for.
 * @param year - The release year of the content.
 * @param type - The type of content ('movie' or 'tv').
 * @returns An array of search results.
 */
export const searchContentWatchmode = async (
  query: string,
  year: number,
  type: 'movie' | 'tv'
): Promise<WatchmodeSearchResult[]> => {
  try {
    const response = await axios.get(`${WATCHMODE_BASE_URL}/search/`, {
      params: {
        apiKey: WATCHMODE_API_KEY,
        search_field: 'name',
        search_value: query,
        content_type: type,
        year: year,
      },
    });

    console.log('Watchmode Search API Response:', response.data);

    if (!response.data || !Array.isArray(response.data.title_results)) {
      console.error('No valid `title_results` array found in Watchmode response:', response.data);
      return [];
    }

    return response.data.title_results.map((item: any) => ({
      title: item.name,
      id: item.id,
      type: item.type,
      release_year: item.year,
    }));
  } catch (error: any) {
    console.error('Error searching content on Watchmode:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Retrieves streaming availability information from Watchmode for a specific content ID.
 * @param watchmodeId - The Watchmode ID of the content.
 * @param country - The country code (default is 'US').
 * @returns A StreamingInfo object containing provider details.
 */
export const getStreamingInfoWatchmode = async (
  watchmodeId: number,
  country: string = 'US'
): Promise<StreamingInfo> => {
  try {
    // Get an array of streaming sources directly
    const response = await axios.get(`${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/`, {
      params: {
        apiKey: WATCHMODE_API_KEY,
        country: country,
      },
    });

    console.log('Watchmode sources API Response:', response.data);

    // Watchmode returns an array of sources, not an object containing { sources: [...] }
    const sources: WatchmodeSource[] = response.data;
    console.log('Watchmode sources:', sources);

    if (!Array.isArray(sources)) {
      console.error('No valid `sources` array found in Watchmode response:', response.data);
      return {
        movieId: watchmodeId.toString(),
        providers: {
          stream: [],
          rent: [],
          buy: [],
        },
        lastUpdated: new Date().toISOString(),
        region: country,
      };
    }

    // Initialize provider arrays
    const streamingProviders: StreamingProvider[] = [];
    const rentProviders: StreamingOption[] = [];
    const buyProviders: StreamingOption[] = [];

    // Iterate over each source and categorize based on type
    sources.forEach((source) => {
      // Some sources only provide `web_url`, not `url`
      const link = source.url || source.web_url;

      // Check if we have a valid name and link
      if (source.name && link) {
        const provider: StreamingProvider = {
          id: source.name.toLowerCase().replace(/\s+/g, '-'),
          name: source.name,
          logo: getProviderLogo(source.name),
          requiresSubscription: !isFreeProvider(source.name),
          streamingUrl: link,
        };

        switch (source.type.toLowerCase()) {
          case 'stream':
          case 'free':  // Watchmode uses 'free' for ad-supported (e.g. Tubi)
          case 'sub':   // "sub" means subscription-based
            streamingProviders.push(provider);
            break;
          case 'rent':
            rentProviders.push({ provider, streamingUrl: link });
            break;
          case 'buy':
            buyProviders.push({ provider, streamingUrl: link });
            break;
          default:
            console.warn(`Unknown source type '${source.type}' encountered.`);
        }
      } else {
        console.warn('Invalid source encountered:', source);
      }
    });

    console.log('Streaming Providers:', streamingProviders);
    console.log('Rent Providers:', rentProviders);
    console.log('Buy Providers:', buyProviders);

    return {
      movieId: watchmodeId.toString(),
      providers: {
        stream: streamingProviders,
        rent: rentProviders,
        buy: buyProviders,
      },
      lastUpdated: new Date().toISOString(),
      region: country,
    };
  } catch (error: any) {
    console.error('Error fetching streaming info from Watchmode:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Utility function to map provider names to their respective logo URLs.
 * @param providerName - The name of the streaming provider.
 * @returns The URL of the provider's logo.
 */
const getProviderLogo = (providerName: string): string => {
  const logos: Record<string, string> = {
    'tubi tv': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tubi_Logo.svg',
    kanopy: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Kanopy_logo.svg',
    netflix: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'amazon prime video': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Amazon_icon.svg',
    'disney plus': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    hulu: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
    // Add more providers and their logo URLs as needed
  };

  // Convert the name to a lowercased "key" for lookup
  const key = providerName.toLowerCase().replace(/\s+/g, ' ');
  return logos[key] || 'https://via.placeholder.com/40'; // Fallback if logo not found
};

/**
 * Utility function to determine if a provider is free.
 * Note: This is just a placeholder. Adjust as needed based on your logic.
 * @param providerName - The name of the streaming provider.
 * @returns A boolean indicating if the provider is free.
 */
const isFreeProvider = (providerName: string): boolean => {
  // Example list; Tubi TV and Kanopy are typically free (ad-supported / library card).
  // Netflix, Hulu, Amazon Prime, Disney+ are subscription-based (not free).
  const freeProviders = ['tubi tv', 'kanopy'];
  return freeProviders.includes(providerName.toLowerCase());
};
