import isAuthenticated from '../lib/server/isAuthenticated';
import { subjectsCollectionName } from '../lib/data/subjects';
import firebaseAdmin from '../lib/server/firebaseAdmin';

export const getServerSideProps = isAuthenticated(async ({uid, email}) => {
    const subjects = (await firebaseAdmin
        .firestore()
        .collection(subjectsCollectionName)
        .get())
        .docs
        .map(doc => ({
            key: doc.id,
            text: doc.data().name,
            value: doc.id
        }));
    
    return {props: {subjects}};
});

export default function Test({uid}) {
    return <p>Hi, {uid}</p>;
} 