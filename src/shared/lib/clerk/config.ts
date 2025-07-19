export const clerkConfig = {
  appearance: {
    variables: {
      colorPrimary: '#3B82F6', // Blue accent
      borderRadius: '0.5rem',
    },
    elements: {
      card: 'shadow-lg border border-gray-200 dark:border-gray-800',
      headerTitle: 'text-lg font-semibold',
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  },
  // Configure social providers
  signIn: {
    routing: 'path',
    path: '/sign-in',
  },
  signUp: {
    routing: 'path',
    path: '/sign-up',
  },
}