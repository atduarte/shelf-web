import { useEffect } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {itemsCollection} from '../lib/data/items'

import { connect } from 'react-redux';

const Feed = ({ items }) => {
  if (!items) return <h3>Loading...</h3>;

  return <div className={styles.grid}>
    {items.docs.map(doc => <FeedItem key={doc.id} doc={doc} />)}
  </div>
}

const FeedItem = ({ doc }) => {
  const data = doc.data();
  return <a href={data.href} className={styles.card}>
    <h3>{data.url}</h3>
  </a>;
};

function Home({ error, items, filters, dispatch }) {
  useEffect(() => {
    console.log('one')
    itemsCollection
      .limit(100)
      .orderBy('points', 'desc')
      .orderBy('created_at', 'desc')
      .onSnapshot(
        snapshot => dispatch({ type: 'ITEMS_FETCH_SUCCESS', payload: snapshot }),
        e => dispatch({ type: 'ITEMS_FETCH_ERROR', error: e })
      );
  }, [filters]);

  console.log(items);

  return (
    <div className={styles.container}>
      <Head>
        <title>Shelf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Shelf</a>
        </h1>
        <Feed items={items} error={error} />
      </main>
    </div>
  )
}

const mapStateToProps = state => ({
  error: state.error,
  items: state.itemsSnapshot,
  filters: null
});

export default connect(mapStateToProps)(Home)