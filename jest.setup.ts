import '@testing-library/jest-dom'; // For extended DOM matchers
import 'dotenv/config'; // Load environment variables from .env (optional)

// Mock process.env globally for all tests
process.env.VITE_APPWRITE_ENDPOINT = 'https://mocked-appwrite-endpoint.test'; // Mocked Appwrite endpoint
process.env.VITE_APPWRITE_PROJECT_ID = 'mocked-project-id'; // Mocked Project ID
