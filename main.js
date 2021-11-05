import connection from  './database.js';
import { ObjectId } from 'mongodb';

const user = ['Herminia', 'Bertoldo', 'Aniceto'];


const transaction = async () => {
  const session = connection.client.startSession();
  await session.startTransaction();

  try {
    user.forEach( async (user) => {
        const objectId = new ObjectId();
        
        await connection.db.collection('usuarios').insertOne({
            _id: objectId,
            nombre: user
        }, { session });

        await connection.db.collection('sesiones').findOneAndUpdate(
            {nombre: user},
            {$set: {userId: objectId}},
            {$unset: {nombre:""}}, 
            { session });

        await connection.db.collection('gustos').findOneAndUpdate(
            {nombre: user},
            {$set: {userId: objectId}},
            {$unset: {nombre:""}},
            { session });
    });

    await session.commitTransaction();
    // return {"result": 'ok'};
    console.log("ok");

  } catch (error) {
      await session.abortTransaction();
      throw error;

  } finally {
    await session.endSession();
    await connection.close();
  }

  transaction();
}