import Firebase from "firebase";
import {db} from '../firebase';
import {Success, Error} from '../option';
import { sha256 } from 'js-sha256';
import { subjectsCollection } from "./subjects";

export const itemsCollection = db.collection('items');

export const createItem = async ({
    title,
    url,
    points,
    subjects
}) => {
    try {
        console.log(subjects);
        const doc = itemsCollection.doc(sha256(url));
        const exists = (await doc.get()).exists;

        if (!exists) {
            doc.set({
                title,
                url,
                subjects: subjects.map(id => subjectsCollection.doc(id)),
                points: Number(points),
                created_at: Firebase.firestore.FieldValue.serverTimestamp()
            });
            return Success("Created");
        } else {
            return Success("Item already existed");
        }
    } catch (e) {
        return Error(e/*"Failure to create item on database"*/)
    }
};

export const incrementItemPoints = async (id, value) => {
    try {
        const doc = itemsCollection.doc(id);
        doc.update({ points: Firebase.firestore.FieldValue.increment(value) });
        return Success("Incremented");
    } catch (e) {
        return Error(e)
    }
}

export const deleteItem = async (id) => {
    try {
        await itemsCollection.doc(id).delete();
        return Success("Deleted")
    } catch (e) {
        return Error("Failed to delete")
    }
};