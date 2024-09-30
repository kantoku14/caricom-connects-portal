import { Client, Databases, Account, ID, Models } from 'appwrite';

// Disable ESLint unused variable warnings for these lines, since they're used elsewhere
/* eslint-disable no-unused-vars */
export enum OAuthProvider {
  Google = 'google',
  Github = 'github',
  Facebook = 'facebook',
}
/* eslint-enable no-unused-vars */

// Appwrite client setup
const client = new Client();

// Use process.env instead of import.meta.env for compatibility with Jest
client
  .setEndpoint(
    process.env.VITE_APPWRITE_ENDPOINT ||
      'https://default-appwrite-endpoint.com'
  ) // Load from process.env
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || 'default-project-id'); // Load from process.env

// Exporting services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID }; // ID is a value, so it doesn't need 'export type'
export type { Models }; // Re-export Models as a type
