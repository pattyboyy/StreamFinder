// src/services/api.ts
import axios from 'axios';
import { Movie } from '../types/movie';
import { StreamingInfo } from '../types/streaming';
import { searchContentWatchmode, getStreamingInfoWatchmode } from './watchmode';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

/**
 * Searches for movies or TV shows using TMDb API.
 * @param query - The search query.
 * @returns An array of Movie objects.
 */
export const searchContent = async (query: string): Promise<Movie[]> => {
  try {
    const response = await api.get('/search/multi', {
      params: {
        query,
        include_adult: false,
      },
    });

    return response.data.results.map((item: any) => ({
      id: item.id.toString(),
      title: item.title || item.name,
      overview: item.overview,
      posterPath: item.poster_path,
      releaseDate: item.release_date || item.first_air_date,
      type: item.media_type,
      rating: item.vote_average,
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

/**
 * Retrieves detailed information about a specific movie or TV show.
 * @param id - The TMDb ID of the content.
 * @param type - The type of content ('movie' or 'tv').
 * @returns A Movie object with detailed information.
 */
export const getContentDetails = async (id: string, type: string): Promise<Movie> => {
  try {
    const response = await api.get(`/${type}/${id}`);
    const data = response.data;

    return {
      id: data.id.toString(),
      title: data.title || data.name,
      overview: data.overview,
      posterPath: data.poster_path,
      releaseDate: data.release_date || data.first_air_date,
      type: type as 'movie' | 'tv',
      rating: data.vote_average,
    };
  } catch (error) {
    console.error('Error getting content details:', error);
    throw error;
  }
};

/**
 * Retrieves streaming availability information using Watchmode API.
 * @param movieId - The TMDb ID of the content.
 * @param type - The type of content ('movie' or 'tv').
 * @returns StreamingInfo object containing provider details.
 */
export const getStreamingInfo = async (movieId: string, type: string): Promise<StreamingInfo> => {
  try {
    const contentDetails = await getContentDetails(movieId, type);
    const title = contentDetails.title;
    const year = new Date(contentDetails.releaseDate).getFullYear();
    const country = 'US'; // Modify as needed or make dynamic based on user location

    // Fetch streaming info from Watchmode with additional parameters
    const searchResults = await searchContentWatchmode(title, year, type as 'movie' | 'tv');
    if (searchResults.length === 0) {
      throw new Error('No streaming information found');
    }

    // Use the first result or implement better matching logic
    const watchmodeId = searchResults[0].id;

    const streamingInfo: StreamingInfo = await getStreamingInfoWatchmode(watchmodeId, country);

    // Check if all provider arrays are empty
    if (
      streamingInfo.providers.stream.length === 0 &&
      streamingInfo.providers.rent.length === 0 &&
      streamingInfo.providers.buy.length === 0
    ) {
      throw new Error('No streaming information found');
    }

    return streamingInfo;
  } catch (error: any) {
    console.error('Error getting streaming info:', error.message);
    throw error;
  }
};
