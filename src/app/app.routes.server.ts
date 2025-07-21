import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'application/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];
    }
  }
];
