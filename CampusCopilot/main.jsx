import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      {/* <h1 style={{color: 'red'}}>TEST RENDER</h1> */}
      <App />
    </React.StrictMode>
  )
} else {
  console.error("Root element not found!")
}