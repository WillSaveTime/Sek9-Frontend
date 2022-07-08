import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import FeedbackList from './feedback-list'
import AddFeedback from './add-feedback'
import EditFeedback from './edit-feedback'

const Feedback = ({ match }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/feedback-list`} />
      <Route path={`${match.url}/add-feedback`} component={AddFeedback} />
      <Route path={`${match.url}/edit-feedback/:id`} component={EditFeedback} />
      <Route path={`${match.url}/feedback-list`} component={FeedbackList} />
    </Switch>
  )
}

export default Feedback
