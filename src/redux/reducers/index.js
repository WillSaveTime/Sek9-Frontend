import { combineReducers } from 'redux'
import Auth from './Auth'
import Theme from './Theme'
import Category from './Category'
import Tag from './Tag'
import Domain from './Domain'

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  category: Category,
  tag: Tag,
  domain: Domain
})

export default reducers
