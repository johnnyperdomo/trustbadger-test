import * as functions from 'firebase-functions';
import * as aws from 'aws-sdk';
import * as mime from 'mime-types';

const config = functions.config();

import * as admin from 'firebase-admin';
const db = admin.firestore();

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');

//LATER: have option to delete as well

//upload images/videos to s3
export const uploadToSpaces = functions.https.onCall(async (data, context) => {
  try {
    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      credentials: {
        accessKeyId: config.do_spaces.access,
        secretAccessKey: config.do_spaces.secret,
      },
    });

    //convert base64 images(data uri), into buffers => upload
    const converted = _convertDataUriToBuffer(data.body);

    await s3
      .putObject({
        Body: converted.buffer,
        Bucket: config.do_spaces.bucket,
        Key: converted.fileName,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: converted.contentType,
      })
      .promise();

    let assetURL = `https://${config.do_spaces.bucket}.${spacesEndpoint.hostname}/${converted.fileName}`;

    await updateFirebaseDocWithAsset(data.firebase_id, assetURL);

    return { url: assetURL, firebaseID: data.firebase_id };
  } catch (error: any) {
    throw Error(error);
  }
});

function _convertDataUriToBuffer(dataUri: string) {
  //only get base 64 string => Buffer; https://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js?rq=1
  const buffer = Buffer.from(
    dataUri.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const contentType = dataUri.split(',')[0].split(':')[1].split(';')[0];
  const fileExt = mime.extension(contentType);
  const fileName = _uuidv4() + '.' + fileExt;

  return {
    buffer: buffer,
    fileName: fileName,
    contentType: contentType,
    fileExt: fileExt,
  };
}

function _uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function updateFirebaseDocWithAsset(docID: string, assetURL: string) {
  try {
    await db.collection('reviews').doc(docID).update({
      client_pic_url: assetURL,
    });

    return;
  } catch (error: any) {
    throw Error(error);
  }
}
