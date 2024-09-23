import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Load endpoint from .env
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Load project ID from .env

export const account = new Account(client);
export const databases = new Databases(client);
