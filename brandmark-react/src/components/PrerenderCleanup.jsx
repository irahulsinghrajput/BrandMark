import { useLayoutEffect } from 'react';

// Pages are pre-rendered into #prerendered so crawlers and visitors get content before JavaScript runs.
// This sits inside the page <Suspense>, so it fires once the live page is ready and swaps it in.
export const PrerenderCleanup = () => {
  useLayoutEffect(() => {
    document.getElementById('prerendered')?.remove();
    document.getElementById('root')?.removeAttribute('hidden');
    document.querySelectorAll('head [data-prerender]').forEach((el) => el.remove());
  }, []);
  return null;
};
