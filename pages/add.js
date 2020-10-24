import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Message, Input, Dropdown, Button } from 'semantic-ui-react'

const mapStateToProps = state => ({
    subjects: state.subjects
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

function Add({ query, subjectOptionss }) {
    const [title, setTitle] = useState(query.title || "");
    const [url, setUrl] = useState(query.url || "");
    const [points, setPoints] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    const [error, setError] = useState(null);

    const subjectOptions = [
        {key: 'k0', text: 't0', value: 0},
        {key: 'k1', text: 't1', value: 1},
        {key: 'k2', text: 't2', value: 2}
    ];

    function handleSubmit(ev) {
        ev.preventDefault();
        setSubmitting(true);
        setError(null);
        setSubmitted(null);

        fetch('/api/add', {
            method: 'POST',
            body: JSON.stringify({title, url, points, subjects}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            setSubmitting(false);

            if (res.status == 200) {
                const body = await res.json();
                console.log(body);
                setSubmitted({title, message: body.message});
                if (window.opener) window.opener.postMessage("submitted");
            } else {
                setError("Error");
            }
/*
            setTitle("");
            setUrl("");
            setPoints(0);
            setSubjects([]); */
        })
        .catch((error) => {
            console.log(error);
            setError(error.message);
        })
    }

    const handleChange = (setState) => (e, { value }) => setState(value)

    return <div>
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
            <Button type='submit'>Submit</Button>
    </Form>
    </div>
}

export default connect(mapStateToProps)(Add)