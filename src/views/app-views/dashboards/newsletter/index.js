import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import NewsletterList from './newsletter-list'
import AddNewsletter from './add-newsletter'
import EditNewsletter from './edit-newsletter'

const Newsletter = ({ match }) => {
  return (
    <Switch>
      <Redirect
        exact
        from={`${match.url}`}
        to={`${match.url}/newsletter-list`}
      />
      <Route path={`${match.url}/add-newsletter`} component={AddNewsletter} />
      <Route
        path={`${match.url}/edit-newsletter/:id`}
        component={EditNewsletter}
      />
      <Route path={`${match.url}/newsletter-list`} component={NewsletterList} />
    </Switch>
  )
}

export default Newsletter
