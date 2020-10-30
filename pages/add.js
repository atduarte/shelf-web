import React, { useEffect, useState } from 'react';
import Router from 'next/router'
import { connect } from 'react-redux';
import { Container, Header, Form, Message, Input, Dropdown, Button } from 'semantic-ui-react'
import Head from 'next/head'
import Link from 'next/link'
import { createItem } from '../lib/data/items'

const mapStateToProps = state => ({
    subjectsError: state.subjectsError,
    allSubjects: state.subjects
});

export function getServerSideProps(context) {
    return {props: {query: context.query}};
}

const status = {
    editing: 0,
    submitting: 1,
}

// TODO: Check field requirements
// TODO: Handle failure to connect

function Add({ query, subjectsError, allSubjects }) {
    // Form date
    const [title, setTitle] = useState(query.title || "");
    const [url, setUrl] = useState(query.url || "");
    const [points, setPoints] = useState(0);
    const [subjects, setSubjects] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    const [error, setError] = useState(null);

    const subjectOptions = (allSubjects || {docs: []}).docs.map(doc => ({
        key: doc.id,
        text: doc.data().name,
        value: doc.id
    }));

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSubmitting(true);
        setError(null);
        setSubmitted(null);

        const result = await createItem({title, url, points, subjects: subjects || []})
        setSubmitting(false);

        if (result.successful) {
            setSubmitted({title, message: result.value});
            Router.push('/');
        } else {
            console.log(result.value);
            setError(result.value);
        }
    }

    const handleChange = (setState) => (e, { value }) => setState(value)

    return (
        <Container text style={{marginTop: '3em'}}>
            <Head>
                <title>Add — Shelf</title>
            </Head>

            <main>
                <Header as="h1">Add item</Header>
                {submitted != null &&
                    <Message
                        success
                        header={`"${submitted.title}" submitted`}
                        content={submitted.message}
                    />
                }
                {error != null &&
                    <Message
                        error
                        header='Error occured'
                        content={`"${error}"`}
                    />
                }
                {subjectsError === true &&
                    <Message
                        error
                        header="Couldn't load subjects"
                    />
                }
                <Form onSubmit={handleSubmit} loading={submitting}>
                    <Form.Field>
                        <label>Title</label>
                        <Input value={title} onChange={handleChange(setTitle)} />
                    </Form.Field>
                    <Form.Field>
                        <label>URL</label>
                        <Input value={url} onChange={handleChange(setUrl)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Subjects</label>
                        <Dropdown
                            fluid
                            multiple
                            search
                            selection
                            loading={false}
                            options={subjectOptions}
                            onChange={handleChange(setSubjects)}
                            value={subjects}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Points</label>
                        <Input type="number" value={points} onChange={handleChange(setPoints)} />
                    </Form.Field>
                    <Button type='submit' color='purple' floated="right">Submit</Button>
                </Form>
            </main>

            <div className="cornerButton left">
                <Link href="/">
                    <Button color='grey' size='tiny'>Go Back</Button>
                </Link>
            </div>
            
        </Container>
    )
}

export default connect(mapStateToProps)(Add)