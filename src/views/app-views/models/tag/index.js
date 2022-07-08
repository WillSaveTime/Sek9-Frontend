import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import TagList from './tag-list'
import AddTag from './add-tag'
import EditTag from './edit-tag'

const Tag = props => {
  const { match } = props
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/tag-list`} />
      <Route path={`${match.url}/add-tag`} component={AddTag} />
      <Route path={`${match.url}/edit-tag/:id`} component={EditTag} />
      <Route path={`${match.url}/tag-list`} component={TagList} />
    </Switch>
  )
}

export default Tag
