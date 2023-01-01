import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

//reviews ------->

//review created
export const reviewCreated = functions.firestore
  .document('reviews/{id}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    try {
      const userID = data.userID;
      const reviewType = data.type;
      const collectionIDs: any[] = data.collections;

      await incrementReviewStatForUser(userID, reviewType);

      //increment to every associated collection doc
      collectionIDs.map(async (colID) => {
        await incrementReviewStatForCollection(colID, reviewType);
      });

      return;
    } catch (error: any) {
      Error(error);
    }
  });

//review updated

export const reviewUpdated = functions.firestore
  .document('reviews/{id}')
  .onUpdate(async (snapshot, context) => {
    const oldData = snapshot.before.data();
    const newData = snapshot.after.data();

    //add old one too

    try {
      let reviewType = newData.type;
      let oldCollectionIDs: any[] = oldData.collections;
      let newCollectionIDs: any[] = newData.collections;

      let differences = compareArrays(oldCollectionIDs, newCollectionIDs);

      if (differences.added.length !== 0) {
        differences.added.map(async (colID) => {
          await incrementReviewStatForCollection(colID, reviewType);
        });
      }

      if (differences.removed.length !== 0) {
        differences.removed.map(async (colID) => {
          await decrementReviewStatForCollection(colID, reviewType);
        });
      }
    } catch (error: any) {
      Error(error);
    }
  });

//review deleted
export const reviewDeleted = functions.firestore
  .document('reviews/{id}')
  .onDelete(async (snapshot, context) => {
    const data = snapshot.data();

    try {
      const userID = data.userID;
      const reviewType = data.type;
      const collectionIDs: any[] = data.collections;

      await decrementReviewStatForUser(userID, reviewType);

      //increment to every associated collection doc
      collectionIDs.map(async (colID) => {
        await decrementReviewStatForCollection(colID, reviewType);
      });

      return;
    } catch (error: any) {
      Error(error);
    }
  });

//collections -------->

//collection created

export const collectionCreated = functions.firestore
  .document('collections/{id}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    try {
      const userID = data.userID;

      return await incrementCollectionStat(userID);
    } catch (error: any) {
      Error(error);
    }
  });

//collection deleted

export const collectionDeleted = functions.firestore
  .document('collections/{id}')
  .onDelete(async (snapshot, context) => {
    const data = snapshot.data();

    try {
      const userID = data.userID;

      return await decrementCollectionStat(userID);
    } catch (error: any) {
      Error(error);
    }
  });

//functions ------>

async function incrementCollectionStat(userID: string) {
  try {
    //update in user

    await db
      .collection('users')
      .doc(userID)
      .set(
        {
          stats: {
            no_collections: admin.firestore.FieldValue.increment(1),
          },
        },
        { merge: true }
      );

    return;
  } catch (error: any) {
    throw Error(error);
  }
}

async function decrementCollectionStat(userID: string) {
  try {
    //update in user
    await db
      .collection('users')
      .doc(userID)
      .set(
        {
          stats: {
            no_collections: admin.firestore.FieldValue.increment(-1),
          },
        },
        { merge: true }
      );
    return;
  } catch (error: any) {
    throw Error(error);
  }
}

async function incrementReviewStatForUser(
  userID: string,
  type: 'video' | 'text'
) {
  try {
    if (type === 'text') {
      await db
        .collection('users')
        .doc(userID)
        .set(
          {
            stats: {
              no_text_reviews: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
      return;
    } else if (type === 'video') {
      await db
        .collection('users')
        .doc(userID)
        .set(
          {
            stats: {
              no_video_reviews: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
    }

    //update in user

    return;
  } catch (error: any) {
    throw Error(error);
  }
}

async function decrementReviewStatForUser(
  userID: string,
  type: 'video' | 'text'
) {
  try {
    if (type === 'text') {
      await db
        .collection('users')
        .doc(userID)
        .set(
          {
            stats: {
              no_text_reviews: admin.firestore.FieldValue.increment(-1),
            },
          },
          { merge: true }
        );
      return;
    } else if (type === 'video') {
      await db
        .collection('users')
        .doc(userID)
        .set(
          {
            stats: {
              no_video_reviews: admin.firestore.FieldValue.increment(-1),
            },
          },
          { merge: true }
        );
    }

    //update in user

    return;
  } catch (error: any) {
    throw Error(error);
  }
}

async function incrementReviewStatForCollection(
  collectionID: string,
  type: 'video' | 'text'
) {
  //check if collectionID exists
  try {
    let doc = await db.collection('collections').doc(collectionID).get();

    if (!doc.exists) {
      return;
    }

    if (type === 'text') {
      await db
        .collection('collections')
        .doc(collectionID)
        .set(
          {
            stats: {
              no_text_reviews: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
    } else if (type === 'video') {
      await db
        .collection('collections')
        .doc(collectionID)
        .set(
          {
            stats: {
              no_video_reviews: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
    }

    return;
  } catch (error: any) {
    throw Error(error);
  }
}

async function decrementReviewStatForCollection(
  collectionID: string,
  type: 'video' | 'text'
) {
  try {
    let doc = await db.collection('collections').doc(collectionID).get();

    if (!doc.exists) {
      return;
    }

    if (type === 'text') {
      await db
        .collection('collections')
        .doc(collectionID)
        .set(
          {
            stats: {
              no_text_reviews: admin.firestore.FieldValue.increment(-1),
            },
          },
          { merge: true }
        );
    } else if (type === 'video') {
      await db
        .collection('collections')
        .doc(collectionID)
        .set(
          {
            stats: {
              no_video_reviews: admin.firestore.FieldValue.increment(-1),
            },
          },
          { merge: true }
        );
    }

    return;
  } catch (error: any) {
    throw Error(error);
  }
}

function compareArrays(oldArray: any[], newArray: any[]) {
  const added = newArray.filter((x) => !oldArray.includes(x));
  const removed = oldArray.filter((x) => !newArray.includes(x));
  return { added, removed };
}
