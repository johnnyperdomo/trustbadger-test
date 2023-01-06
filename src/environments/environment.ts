// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'trustbadger-dev',
    appId: '1:646066223104:web:1ada481ac07dbdeb7540e5',
    storageBucket: 'trustbadger-dev.appspot.com',
    apiKey: 'AIzaSyAcUh_xFxY4sx9uAWP5vbpluuUrP_GZ1nA',
    authDomain: 'trustbadger-dev.firebaseapp.com',
    messagingSenderId: '646066223104',
  },
  production: false,
  stripe: {
    starterPriceID: 'price_1MLZMgBbTwqiwTLEABqmzMF6',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
