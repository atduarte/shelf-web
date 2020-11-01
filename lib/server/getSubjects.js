import { subjectsCollectionName } from '../data/subjects';
import firebaseAdmin from './firebaseAdmin';

const maximumTime = 10*60*1000 /* 10 minute */
let timeout = null;
let cache = undefined;

const update = async () => {

    const snapshot = await firebaseAdmin
        .firestore()
        .collection(subjectsCollectionName)
        .get()
    
    clearTimeout(timeout)
    cache = snapshot;

    timeout = setTimeout(() => {
        cache = null;
        timeout = null;
    }, maximumTime)
}



export default async () => {
    if (!cache) await update();
    return cache;
}