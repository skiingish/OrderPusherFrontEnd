console.log('Service Worker Loaded');

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('push recived');
  self.registration.showNotification(data.title, {
    body: data.body,
  });
});
