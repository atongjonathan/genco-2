import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
       auth: undefined!
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}