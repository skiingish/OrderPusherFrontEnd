const endPoint = 'https://web-pager-backend.herokuapp.com';
//const endPoint = 'http://localhost:3000';

var publicVapidKey =
  'BJKfugtSRPwIUr9P6wqFa0jmB_d9TmRR7W0Yquxulf0rCpQPe3KStrZ0vLIca39LQtphUobaV3c2lmqzS3Q2ey4';

var orderID = null;

window.addEventListener('DOMContentLoaded', async (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // ?orderID=623b0ce289a9691d23fe787b
  const queryOrderID = urlParams.get('orderID');
  orderID = queryOrderID;
  const res = await fetch(`${endPoint}/api/order/${orderID}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });

  const data = await res.json();

  console.log(data);

  // Set the fields
  document.getElementById('orderIDField').innerText = `Order No: ${orderID}`;

  // Items
  document.getElementById('itemsIDfield').innerText = `Items: ${data.items}`;

  // Status
  document.getElementById('statusIDField').innerText = `Status: ${
    data.fulfilled ? 'Ready to collect' : 'Prepping'
  }`;
});

if ('serviceWorker' in navigator) {
  // Set the order ID from the query params.
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryOrderID = urlParams.get('orderID');
  orderID = queryOrderID;

  remoteSend().catch((err) => console.error(err));
}

async function remoteSend() {
  console.log('reg SW');

  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/',
  });

  const res = await fetch(`${endPoint}/api/subscribe/order/${orderID}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });

  const data = await res.json();

  publicVapidKey = data.publicVapid;

  console.log('Pub Vapid Set');

  console.log(publicVapidKey);

  const subscription = await register.pushManager.getSubscription();

  // If the serviceworker is already subbed then unsubscribe.
  if (subscription != null) {
    await subscription.unsubscribe();
  }

  // register.pushManager.getSubscription().then( (subscription) => {
  //   subscription.unsubscribe().then(function(successful) {

  //     // You've successfully unsubscribed
  //   }).catch(function(e) {
  //     // Unsubscribing failed
  //   })
  // });

  await register.pushManager.getSubscription();

  // Create new sub.
  const subscripton = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey,
  });

  console.log(subscripton);

  console.log('SW Reged');

  // // Send a push
  console.log('Sending sub to backend');

  await fetch(`${endPoint}/api/subscribe/order/${orderID}`, {
    method: 'POST',
    body: JSON.stringify(subscripton),
    headers: {
      'content-type': 'application/json',
    },
  });
}
