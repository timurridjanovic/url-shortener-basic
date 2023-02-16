import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [url, setUrl] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const onInputChange = e => {
    const value = e.target.value
    // if (!value.match(/^(https:\/\/|http:\/\/)/)) {
    //   if ('http://'.indexOf(value) < 0 && 'https://'.indexOf(value) < 0) {
    //     setUrl(`http://${value}`)
    //     return false
    //   }
    // }

    setUrl(value)
    // return false
  }

  const createUrl = async (url) => {
    try {
      const response = await fetch('/api/create-shortened-url', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const body = await response.json();
        setNewUrl(body.shortUrl)
      } else {
        const err = await response.text();
        throw new Error(err)
      }
    } catch (err) {
      console.log('ERR: ', err)
    }
  }

  const onCreate = () => {
    const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    if (regex.test(url)) {
      console.log('IS VALID')
      createUrl(url)
    } else {
      console.log('IS NOT VALID')
    }
  }

  return (
    <div>
      <h1>Welcome to url shortener app</h1>
      <input value={url} onChange={onInputChange} />
      <button onClick={onCreate}>Create shortened url</button>
      {!!newUrl && (
        <div>
          New url is: {newUrl}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
)
