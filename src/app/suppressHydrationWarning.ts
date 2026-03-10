// Suppress hydration warnings in development
// The CSS applies inline styles to background images which causes harmless hydration mismatches

if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Hydration failed') ||
        args[0].includes('hydrated but some attributes') ||
        args[0].includes("didn't match"))
    ) {
      // Suppress hydration warnings - they're caused by CSS adding inline styles
      return;
    }
    originalError.apply(console, args);
  };
}

export {};

