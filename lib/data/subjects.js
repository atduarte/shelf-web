import {db} from '../firebase';

export const subjectsCollectionName = 'subjects';
export const subjectsCollection = db.collection(subjectsCollectionName);