import { Client, Databases, Account, ID, Models } from 'appwrite';

// Define an enum for the supported OAuth providers
export enum OAuthProvider {
  Google = 'google',
  Github = 'github',
  Facebook = 'facebook',
  // Add any other providers you need here
}

// Appwrite client setup
const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Load endpoint from .env
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Load project ID from .env

// Exporting services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID }; // ID is a value, so it doesn't need 'export type'
export type { Models }; // Re-export Models as a type
