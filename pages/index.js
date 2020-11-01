import { useEffect, useState } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import nookies from 'nookies'
import firebaseAdmin from '../lib/server/firebaseAdmin'
import styles from '../styles/Home.module.css'
import getSubjects from '../lib/server/getSubjects'
import {extractHostname} from '../lib/utils'

import {itemsCollection, incrementItemPoints, deleteItem} from '../lib/data/items'

import { Item, Container, Button, Checkbox } from 'semantic-ui-react';
import { subjectsCollection } from '../lib/data/subjects';


export const getServerSideProps = async (ctx) => {
  try {
      const cookies = nookies.get(ctx);
      await firebaseAdmin.auth().verifyIdToken(cookies.token);
  } catch (err) {
      ctx.res.writeHead(302, { Location: '/login' })
      ctx.res.end();
      return {props: {}};
  }

  const subjects = (await getSubjects())
      .docs
      .map(doc => ({
          key: doc.id,
          text: doc.data().name,
          value: doc.id
      }));
  
  return {props: {subjects}};
};


const Feed = ({ items, subjects }) => {
  if (!items) return <h3>Loading...</h3>;
  if (items.docs.length == 0) return <h3>No items</h3>;

  return (
    <Item.Group>
      {items.docs.map(doc => <FeedItem key={doc.id} doc={doc} subjects={subjects} />)}
    </Item.Group>
  )
}

const FeedItem = ({ doc, subjects }) => {
  const data = doc.data();
  const filteredSubjects =  subjects
    .filter((subject) => data.subjects.map(s => s.id).includes(subject.value));

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
          {filteredSubjects.map(({text}) => <div className={styles.itemSubject}>{text}</div>)}
          {extractHostname(data.url)} — <a target="_blank" href={`https://console.firebase.google.com/u/0/project/andreduarte-shelf/firestore/data~2Fitems~2F${doc.id}`}>edit</a>
        </div>
      </div>
    </div>
  )
};

const SubjectList = ({options, set}) => {
  return options.map(option => <SubjectListItem key={option.value} option={option} set={set}/>)
}

const SubjectListItem = ({option, set}) => {
  return (
    <div key={option.value}>
      <Checkbox
        name={option.value}
        label={option.text}
        checked={option.checked}
        onChange={set}
      />
    </div>
  )
}

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

function Home({ subjects }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});

  const handleSubjectSelection = (ev, {name, checked}) => {
    setSelected({...selected, [name]: checked})
  }

  useEffect(() => {
    setError(null);
    setItems(null);

    const baseQuery = Object.values(selected).includes(true) ?
      itemsCollection.where(
        'subjects', 
        'array-contains-any', 
        Object.entries(selected)
          .filter(([_, checked]) => checked)
          .map(([name, _]) => subjectsCollection.doc(name))
      ) :
      itemsCollection;

    const unsubscribe = baseQuery
      .limit(1000)
      .orderBy('created_at', 'desc')
      .orderBy('points', 'desc')
      .onSnapshot(
        snapshot => {
          console.log('update')
          setItems(snapshot)
        },
        e => setError(e)
      );

    return () => unsubscribe();
  }, [selected]);

  return (
    <Container>
      <Head>
        <title>Shelf</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.feed}>
          <Feed items={items} subjects={subjects} error={error} />
        </div>
        <div className={styles.subjects}>
          <SubjectList 
              options={subjects.map(s => ({...s, checked: selected[s.value]}))} 
              set={handleSubjectSelection}
            />
        </div>
      </main>

      <div className="right cornerButton">
        <Link href="/add">
          <Button color='purple' size='tiny'>Add</Button>
        </Link>
      </div>
    </Container>
  )
}

export default Home