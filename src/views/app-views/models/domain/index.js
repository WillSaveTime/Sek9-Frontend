import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import DomainList from './domain-list'
import AddDomain from './add-domain'
import EditDomain from './edit-domain'

const Domain = ({ match }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/domain-list`} />
      <Route path={`${match.url}/add-domain`} component={AddDomain} />
      <Route path={`${match.url}/view-domain/:id`} component={EditDomain} />
      <Route path={`${match.url}/domain-list`} component={DomainList} />
    </Switch>
  )
}

export default Domain
