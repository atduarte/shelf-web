import nookies from 'nookies';
import firebaseAdmin from './firebaseAdmin'

export default (fn) => async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const { uid, email } = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        return fn(ctx, { uid, email });
    } catch (err) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end();
        return;
    }
}

