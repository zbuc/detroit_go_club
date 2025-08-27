// IMPORTANT: You need to replace these values with your actual Sanity project details
// Get these from: https://sanity.io/manage
// For production, you can also read from environment variables:
export const sanityConfig = {
  // Sanity Project ID is not a secret value and is visible to anyone
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qipp2pwx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
}