/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as OnboardImport } from './routes/onboard'
import { Route as AppImport } from './routes/_app'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as AppNotificationsImport } from './routes/_app/notifications'
import { Route as AppHandleIndexImport } from './routes/_app/$handle/index'
import { Route as AppListsListIdIndexImport } from './routes/_app/lists/$listId/index'
import { Route as AppArtistsArtistIdIndexImport } from './routes/_app/artists/$artistId/index'
import { Route as AppAlbumsAlbumIdIndexImport } from './routes/_app/albums/$albumId/index'
import { Route as AppHandleRatingsResourceIdIndexImport } from './routes/_app/$handle/ratings/$resourceId/index'
import { Route as AppAlbumsAlbumIdSongsSongIdIndexImport } from './routes/_app/albums/$albumId/songs/$songId/index'

// Create Virtual Routes

const AppTermsLazyImport = createFileRoute('/_app/terms')()
const AppRoadmapLazyImport = createFileRoute('/_app/roadmap')()
const AppPrivacyPolicyLazyImport = createFileRoute('/_app/privacy-policy')()

// Create/Update Routes

const OnboardRoute = OnboardImport.update({
  path: '/onboard',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AppTermsLazyRoute = AppTermsLazyImport.update({
  path: '/terms',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/terms.lazy').then((d) => d.Route))

const AppRoadmapLazyRoute = AppRoadmapLazyImport.update({
  path: '/roadmap',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/_app/roadmap.lazy').then((d) => d.Route))

const AppPrivacyPolicyLazyRoute = AppPrivacyPolicyLazyImport.update({
  path: '/privacy-policy',
  getParentRoute: () => AppRoute,
} as any).lazy(() =>
  import('./routes/_app/privacy-policy.lazy').then((d) => d.Route),
)

const AppNotificationsRoute = AppNotificationsImport.update({
  path: '/notifications',
  getParentRoute: () => AppRoute,
} as any)

const AppHandleIndexRoute = AppHandleIndexImport.update({
  path: '/$handle/',
  getParentRoute: () => AppRoute,
} as any)

const AppListsListIdIndexRoute = AppListsListIdIndexImport.update({
  path: '/lists/$listId/',
  getParentRoute: () => AppRoute,
} as any)

const AppArtistsArtistIdIndexRoute = AppArtistsArtistIdIndexImport.update({
  path: '/artists/$artistId/',
  getParentRoute: () => AppRoute,
} as any)

const AppAlbumsAlbumIdIndexRoute = AppAlbumsAlbumIdIndexImport.update({
  path: '/albums/$albumId/',
  getParentRoute: () => AppRoute,
} as any)

const AppHandleRatingsResourceIdIndexRoute =
  AppHandleRatingsResourceIdIndexImport.update({
    path: '/$handle/ratings/$resourceId/',
    getParentRoute: () => AppRoute,
  } as any)

const AppAlbumsAlbumIdSongsSongIdIndexRoute =
  AppAlbumsAlbumIdSongsSongIdIndexImport.update({
    path: '/albums/$albumId/songs/$songId/',
    getParentRoute: () => AppRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/onboard': {
      preLoaderRoute: typeof OnboardImport
      parentRoute: typeof rootRoute
    }
    '/_app/notifications': {
      preLoaderRoute: typeof AppNotificationsImport
      parentRoute: typeof AppImport
    }
    '/_app/privacy-policy': {
      preLoaderRoute: typeof AppPrivacyPolicyLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/roadmap': {
      preLoaderRoute: typeof AppRoadmapLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/terms': {
      preLoaderRoute: typeof AppTermsLazyImport
      parentRoute: typeof AppImport
    }
    '/_app/': {
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/$handle/': {
      preLoaderRoute: typeof AppHandleIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/albums/$albumId/': {
      preLoaderRoute: typeof AppAlbumsAlbumIdIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/artists/$artistId/': {
      preLoaderRoute: typeof AppArtistsArtistIdIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/lists/$listId/': {
      preLoaderRoute: typeof AppListsListIdIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/$handle/ratings/$resourceId/': {
      preLoaderRoute: typeof AppHandleRatingsResourceIdIndexImport
      parentRoute: typeof AppImport
    }
    '/_app/albums/$albumId/songs/$songId/': {
      preLoaderRoute: typeof AppAlbumsAlbumIdSongsSongIdIndexImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AppRoute.addChildren([
    AppNotificationsRoute,
    AppPrivacyPolicyLazyRoute,
    AppRoadmapLazyRoute,
    AppTermsLazyRoute,
    AppIndexRoute,
    AppHandleIndexRoute,
    AppAlbumsAlbumIdIndexRoute,
    AppArtistsArtistIdIndexRoute,
    AppListsListIdIndexRoute,
    AppHandleRatingsResourceIdIndexRoute,
    AppAlbumsAlbumIdSongsSongIdIndexRoute,
  ]),
  OnboardRoute,
])

/* prettier-ignore-end */
