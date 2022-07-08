import React, { Fragment, lazy, useEffect } from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { useQuery } from '@apollo/client'
import 'antd/dist/antd.css'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import { THEME_CONFIG } from './configs/AppConfig'
import { Provider } from 'react-redux'
import store from 'redux/store'

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`
}

const TestRegistrar = lazy(() =>
  import(
    /* webpackChunkName: "TestRegistrar", webpackPrefetch:true */
    './routes/TestRegistrar'
  )
)

const Home = lazy(() =>
  import(
    /* webpackChunkName: "Home", webpackPrefetch:true */
    './routes/Home'
  )
)

const SearchResults = lazy(() =>
  import(
    /* webpackChunkName: "SearchResults", webpackPrefetch:true */
    './routes/SearchResults'
  )
)

const SingleName = lazy(() =>
  import(
    /* webpackChunkName: "SingleName", webpackPrefetch:true */
    './routes/SingleName'
  )
)

const Category = lazy(() =>
  import(
    /* webpackChunkName: "SingleName", webpackPrefetch:true */
    './routes/Category'
  )
)

const SingleCategory = lazy(() =>
  import(
    /* webpackChunkName: "SingleName", webpackPrefetch:true */
    './routes/SingleCategory'
  )
)

const Favourites = lazy(() =>
  import(
    /* webpackChunkName: "Favourites", webpackPrefetch:true */
    './routes/Favourites'
  )
)

const Faq = lazy(() =>
  import(
    /* webpackChunkName: "Faq", webpackPrefetch:true */
    './routes/Faq'
  )
)

const About = lazy(() =>
  import(
    /* webpackChunkName: "Faq", webpackPrefetch:true */
    './routes/About'
  )
)

const Address = lazy(() =>
  import(
    /* webpackChunkName: "Address", webpackPrefetch:true */
    './routes/AddressPage'
  )
)

const Renew = lazy(() =>
  import(
    /* webpackChunkName: "Renew", webpackPrefetch:true */
    './routes/Renew'
  )
)

const Login = lazy(() =>
  import(
    /* webpackChunkName: "Renew", webpackPrefetch:true */
    './routes/Login'
  )
)

const Signup = lazy(() =>
  import(
    /* webpackChunkName: "Renew", webpackPrefetch:true */
    './routes/Signup'
  )
)

const Admin = lazy(() =>
  import(
    /* webpackChunkName: "Renew", webpackPrefetch:true */
    './Admin'
  )
)

// import TestRegistrar from './routes/TestRegistrar'
// import Home from './routes/Home'
// import SearchResults from './routes/SearchResults'
// import SingleName from './routes/SingleName'
// import Favourites from './routes/Favourites'
// import Faq from './routes/Faq'
// import Address from './routes/AddressPage'
// import Renew from './routes/Renew'

import { NetworkError, Error404 } from './components/Error/Errors'
import DefaultLayout from './components/Layout/DefaultLayout'
import AuthLayout from './components/Layout/AuthLayout'
import { pageview, setupAnalytics } from './utils/analytics'
import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { GET_ERRORS } from './graphql/queries'

//If we are targeting an IPFS build we need to use HashRouter
const Router =
  process.env.REACT_APP_IPFS === 'True' ? HashRouter : BrowserRouter

const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  pageview()
  return (
    <DefaultRoute
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

const App = () => {
  useReactiveVarListeners()
  const {
    data: { globalError }
  } = useQuery(GET_ERRORS)

  useEffect(() => {
    setupAnalytics()
  }, [])

  if (globalError.network) {
    return <NetworkError message={globalError.network} />
  }

  return (
    <Provider store={store}>
      <ThemeSwitcherProvider
        themeMap={themes}
        defaultTheme={THEME_CONFIG.currentTheme}
        insertionPoint="styles-insertion-point"
      >
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/test-registrar" component={TestRegistrar} />
            <Route path="/favourites" component={Favourites} />
            <Route path="/categories" component={Category} />
            <Route path="/category/:category" component={SingleCategory} />
            <Route path="/faq" component={Faq} />
            <Route path="/about" component={About} />
            <Route path="/my-bids" component={SearchResults} />
            <Route path="/how-it-works" component={SearchResults} />
            <Route path="/search/:searchTerm" component={SearchResults} />
            <Route path="/name/:name" component={SingleName} />
            <Route path="/address/:address/:domainType" component={Address} />
            <Route path="/address/:address" component={Address} />
            <Route path="/renew" component={Renew} />
            <Route path="/login" component={Login} layout={AuthLayout} />
            <Route path="/signup" component={Signup} layout={AuthLayout} />
            <DefaultRoute path="/admin" component={Admin} />
            <Route path="*" component={Error404} />
          </Switch>
        </Router>
      </ThemeSwitcherProvider>
    </Provider>
  )
}
export default App
