'use client';

import dynamic from 'next/dynamic';

export const GhostNotFoundClient = dynamic(
  () => import('./ghost-404-page').then((m) => m.GhostNotFound),
  { ssr: false }
);
