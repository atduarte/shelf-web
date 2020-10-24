import Firebase from "firebase";
import db from './db';
import {Success, Error, Try} from '../option';
import { sha256 } from 'js-sha256';

export const itemsCollection = db.collection('items');

export const createItem = async ({
    title,
    url,
    points,
    subjects
}) => {
    try {
        const doc = itemsCollection.doc(sha256(url));
        const exists = (await doc.get()).exists;

        if (!exists) {
            doc.set({
                title,
                url,
                subjects,
                points: points,
                created_at: Firebase.firestore.FieldValue.serverTimestamp()
            });
            return Success("Created");
        } else {
            return Success("Item already existed");
        }
    } catch (e) {
        return Error("Failure to create item on database")
    }
};

export const deleteItem = async (id) => {
    try {
        await itemsCollection.doc(id).delete();
        return Success("Deleted")
    } catch (e) {
        return Error("Failed to delete")
    }
};