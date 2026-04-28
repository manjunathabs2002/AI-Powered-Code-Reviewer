import { useState, useEffect, useCallback } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import BACKEND_URL from './config'
import './App.css'
import Toast from './components/Toast'

function App() {
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [ review, setReview ] = useState(``)
  const [ toasts, setToasts ] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter(x => x.id !== id))
  }, [])

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      const response = await axios.post(`${BACKEND_URL}/ai/get-review`, { code })

      // backend returns { success, review } or { success, error }
      if (response.data && response.data.success) {
        setReview(response.data.review)
      } else {
        const errMsg = (response.data && response.data.error) || 'AI failed to provide a review'
        // Show toast for quota-like messages
        if (/quota|rate limit|exceeded/i.test(errMsg)) {
          addToast(errMsg, 'error')
        } else {
          addToast(errMsg, 'warning')
        }
      }
    } catch (err) {
      // axios error handling
      const serverMsg = err?.response?.data?.error || err.message || 'Unknown error'
      if (/quota|rate limit|exceeded|429/i.test(serverMsg)) {
        addToast(serverMsg, 'error')
      } else {
        addToast('Failed to contact AI service', 'error')
      }
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown

            rehypePlugins={[ rehypeHighlight ]}

          >{review}</Markdown>
        </div>
      </main>
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
        ))}
      </div>
    </>
  )
}



export default App