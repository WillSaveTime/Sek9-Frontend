import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Loading from 'components/shared-components/Loading'

const Models = ({ match }) => (
  <Suspense fallback={<Loading cover="content" />}>
    <Switch>
      <Route
        path={`${match.url}/category`}
        component={lazy(() => import(`./category`))}
      />
      <Route
        path={`${match.url}/tag`}
        component={lazy(() => import(`./tag`))}
      />
      <Route
        path={`${match.url}/domain`}
        component={lazy(() => import(`./domain`))}
      />
      <Redirect from={`${match.url}`} to={`${match.url}/category`} />
    </Switch>
  </Suspense>
)

export default Models
