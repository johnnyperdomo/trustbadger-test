import * as admin from 'firebase-admin';
admin.initializeApp();

//stat triggers ---->

//reviews
export { reviewCreated } from './triggers/statTriggers';
export { reviewUpdated } from './triggers/statTriggers';
export { reviewDeleted } from './triggers/statTriggers';

//collections
export { collectionCreated } from './triggers/statTriggers';
export { collectionDeleted } from './triggers/statTriggers';

export { createCheckoutSession } from './stripe';
