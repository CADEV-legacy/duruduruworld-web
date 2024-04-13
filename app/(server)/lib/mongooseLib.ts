import { ConnectOptions, Types, connect } from 'mongoose';

import { InternalServerError, NotFound } from '@/(error)';

import { SERVER_SETTINGS } from '@/setting';

let cachedMongoose = global.mongoose;

if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { createConnectionPromise: null, connection: null };
}

export const getConnection = async () => {
  if (!SERVER_SETTINGS.DATABASE_URL)
    throw new NotFound({ type: 'NotFound', code: 404, detail: 'DATABASE_URL' });

  const options: ConnectOptions = {
    maxPoolSize: 10,
    bufferCommands: false,
  };

  if (SERVER_SETTINGS.ENVIRONMENT !== 'product') {
    // NOTE: If the environment is not production, using cached connection

    if (cachedMongoose.connection) {
      return cachedMongoose.connection;
    }

    if (!cachedMongoose.createConnectionPromise) {
      cachedMongoose.createConnectionPromise = connect(SERVER_SETTINGS.DATABASE_URL, options);
    }

    try {
      cachedMongoose.connection = await cachedMongoose.createConnectionPromise;

      return cachedMongoose.connection;
    } catch (error) {
      cachedMongoose.createConnectionPromise = null;

      throw new InternalServerError({ type: 'InternalServerError', code: 500, detail: error });
    }
  }

  return await connect(SERVER_SETTINGS.DATABASE_URL, options);
};

export const getObjectId = (id: string) => {
  return new Types.ObjectId(id);
};
