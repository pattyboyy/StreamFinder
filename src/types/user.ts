// src/types/user.ts
export interface User {
    id: string;
    email: string;
    watchlist: string[]; // Array of movie IDs
  }