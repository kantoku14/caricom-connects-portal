import { Client, Databases, Account, ID, Models, Locale } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Set endpoint and project ID from environment variables
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Endpoint from .env
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID from .env

// Exporting services
export const account = new Account(client);
export const databases = new Databases(client);
export const locale = new Locale(client); // Initialize and export Locale service
export { ID }; // Export ID for unique identifiers
export type { Models }; // Export Models type if needed.
