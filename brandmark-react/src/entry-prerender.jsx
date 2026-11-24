// Build-time only: renders one route to static HTML (used by scripts/prerender-seo.cjs).
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';

export async function render(url) {
  const errors = [];
  const { prelude } = await prerenderToNodeStream(
    <QueryClientProvider client={new QueryClient()}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </QueryClientProvider>,
    // Infinity keeps lazy page content inline instead of in hidden, script-revealed chunks
    { progressiveChunkSize: Infinity, onError: (e) => { errors.push(e); } }
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return { html, errors };
}
