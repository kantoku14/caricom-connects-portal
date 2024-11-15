import { Client, Databases, Account, ID, Locale, Models } from 'appwrite';

// Enumeration for OAuth providers if needed in the login flow
export enum OAuthProvider {
  Google = 'google',
  Github = 'github',
  Facebook = 'facebook',
}

// Initialize the Appwrite client
const client = new Client();

// Configure client endpoint and project ID using environment variables
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // API Endpoint from .env
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID from .env

// Exporting Appwrite services for use throughout the application
export const account = new Account(client); // Account service for user authentication
export const databases = new Databases(client); // Database service for data storage and retrieval
export const locale = new Locale(client); // Locale service for location-based user information
export { ID }; // Export ID for document creation and unique identifiers
export type { Models }; // Export Models type if needed in type definitions
