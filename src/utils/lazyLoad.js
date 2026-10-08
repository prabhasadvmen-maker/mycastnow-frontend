import { lazy, Suspense } from 'react';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export const lazyLoad = (importFunc) => {
  const Component = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

export const preloadComponent = (importFunc) => {
  importFunc();
};
