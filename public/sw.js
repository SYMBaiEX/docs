// Empty service worker to prevent 404 errors
// This file exists to handle browser requests for service workers
// without any actual service worker functionality

self.addEventListener('install', function(event) {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
}); 