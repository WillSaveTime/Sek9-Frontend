import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Views from './views'
import './index.css'
import { Route, Switch } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router basename="/admin">
        <Switch>
          <Route path="/" component={Views} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
