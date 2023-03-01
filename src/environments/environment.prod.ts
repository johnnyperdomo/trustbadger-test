export const environment = {
  firebase: {
    projectId: 'trustbadger-prod',
    apiKey: 'AIzaSyCqd5ne7Zkvor-UZGCDS8XuAL5Keqf5smM',
    authDomain: 'trustbadger-prod.firebaseapp.com',
    storageBucket: 'trustbadger-prod.appspot.com',
    messagingSenderId: '608421562834',
    appId: '1:608421562834:web:9a40749e008a67e70b200b',
  },
  production: true,
  stripe: {
    starterPriceID: 'price_1MLZJtBbTwqiwTLE4h0jIhVe',
    publishableKey:
      'pk_live_51MLUx0BbTwqiwTLERcqEaGlgtoOcqPehvrpQpadO5EgI2T0XbR89AnZ1TwRe6m81YzfVtEKQeLaNKFm5IoBwEoN700vVvAeQg4',
  },
  do_spaces: {
    bucket: 'https://us-central1-trustbadger-prod.cloudfunctions.net',
  },
};
