import React, { useState } from 'react';
import Router from 'next/router'
import {auth} from '../lib/firebase'
import { Container, Header, Form, Message, Input, Button } from 'semantic-ui-react'
import Head from 'next/head'

// TODO: If logged in redirect to homepage

function Login({ }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSubmitting(true);
        setError(null);

        await auth.signInWithEmailAndPassword(email, password)
            .then(() => Router.push('/'))
            .catch((error) => setError(error.message))
            
        setSubmitting(false);
    }

    const handleChange = (setState) => (e, { value }) => setState(value)

    return (
        <Container text style={{marginTop: '3em'}}>
            <Head>
                <title>Login — Shelf</title>
            </Head>

            <main>
                <Header as="h1">Login</Header>
                {error != null &&
                    <Message
                        error
                        header='Error occured'
                        content={`"${error}"`}
                    />
                }
                <Form onSubmit={handleSubmit} loading={submitting}>
                    <Form.Field>
                        <label>Email</label>
                        <Input value={email} onChange={handleChange(setEmail)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Input type="password" value={password} onChange={handleChange(setPassword)} />
                    </Form.Field>
                    <Button type='submit' color='purple' floated="right">Login</Button>
                </Form>
            </main>            
        </Container>
    )
}

export default Login