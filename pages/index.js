import { useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {extractHostname} from '../lib/utils'

import {itemsCollection, incrementItemPoints, deleteItem} from '../lib/data/items'

import { connect } from 'react-redux';
import { Item, Container, Button } from 'semantic-ui-react';

const Feed = ({ items, subjects }) => {
  if (!items) return <h3>Loading...</h3>;

  return (
    <Item.Group>
      {items.docs.map(doc => <FeedItem key={doc.id} doc={doc} subjects={subjects} />)}
    </Item.Group>
  )
}

const FeedItem = ({ doc, subjects }) => {
  const data = doc.data();
  const processedSubjects = (subjects || {docs: []}).docs.filter((doc) => data.subjects.map(s => s.id).includes(doc.id));

  return (
    <div className={styles.item} dbid={doc.id}>
      <div className={styles.itemIncrements}>
        <div className={styles.invertedArrow} onClick={handleIncrement(doc.id, 1)}></div>
        <div className={styles.points}>{data.points}</div>
        <div className={styles.arrow}  onClick={handleIncrement(doc.id, -1)}></div>
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <a href={data.url}>{data.title}</a>
          <img className={styles.trash} src="/trash.svg" onClick={handleDelete(doc.id)} />
        </div>
        <div className={styles.itemMeta}>
          {processedSubjects.map(doc => <div className={styles.itemSubject}>{doc.data().name}</div>)}
          {extractHostname(data.url)} — <a target="_blank" href={`https://console.firebase.google.com/u/0/project/andreduarte-shelf/firestore/data~2Fitems~2F${doc.id}`}>edit</a>
        </div>
      </div>
    </div>
  )
};

const handleIncrement = (id, value) => async () => {
  const result = await incrementItemPoints(id, value);
  if (result.successful == false) {
    alert("Error:" + result.value);
  }
}

const handleDelete = (id) => async () => {
  const result = await deleteItem(id);
  if (result.successful == false) {
    alert("Error:" + result.value);
  }
}

function Home({ error, items, subjects, filters, dispatch }) {
  useEffect(() => {
    const unsubscribe = itemsCollection
      .limit(1000)
      .orderBy('points', 'desc')
      .orderBy('created_at', 'desc')
      .onSnapshot(
        snapshot => dispatch({ type: 'ITEMS_FETCH_SUCCESS', payload: snapshot }),
        e => dispatch({ type: 'ITEMS_FETCH_ERROR', error: e })
      );

    return () => unsubscribe();
  }, [filters]);

  return (
    <Container text>
      <Head>
        <title>Shelf</title>
      </Head>

      <main className={styles.main}>
        <Feed items={items} subjects={subjects} error={error} />
      </main>

      <div className="right cornerButton">
        <a href="/add">
          <Button color='purple' size='tiny'>Add</Button>
        </a>
      </div>
    </Container>
  )
}

const mapStateToProps = state => ({
  error: state.itemsError && state.subjectsError,
  items: state.items,
  subjects: state.subjects,
  filters: null
});

export default connect(mapStateToProps)(Home)