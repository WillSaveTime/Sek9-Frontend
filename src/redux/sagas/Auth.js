import { all, takeEvery, put, fork, call } from 'redux-saga/effects'
import {
  AUTH_TOKEN,
  SIGNIN,
  SIGNOUT,
  SIGNUP,
  SIGNIN_WITH_GOOGLE,
  SIGNIN_WITH_FACEBOOK,
  AUTH_MEMBER
} from '../constants/Auth'
import {
  showAuthMessage,
  authenticated,
  signOutSuccess,
  signUpSuccess,
  setError,
  signInWithGoogleAuthenticated,
  signInWithFacebookAuthenticated
} from '../actions/Auth'

import FirebaseService from 'services/FirebaseService'
import { apiLogin, apiLogout, apiSignup } from 'api/rest/auth'
import { keys } from 'lodash-es'
import { removeLocalToken, setLocalToken } from 'api/rest/localStorage'

export function* signInWithFBEmail() {
  yield takeEvery(SIGNIN, function*({ payload }) {
    try {
      const user = yield call(apiLogin, payload)
      if (user.error) {
        yield put(setError(user.error))
        yield typeof user.error === 'string' && put(showAuthMessage(user.error))
      } else {
        setLocalToken(user)
        yield put(authenticated(user.token, user.member))
      }
    } catch (err) {
      yield put(showAuthMessage(err))
    }
  })
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function*() {
    try {
      const signOutUser = yield call(apiLogout)
      if (!keys(signOutUser).length) {
        removeLocalToken()
        yield put(signOutSuccess(signOutUser))
      } else {
        yield put(showAuthMessage(signOutUser.message))
      }
    } catch (err) {
      yield put(showAuthMessage(err))
    }
  })
}

export function* signUpWithFBEmail() {
  yield takeEvery(SIGNUP, function*({ payload }) {
    try {
      const user = yield call(apiSignup, payload)
      if (user.error) {
        yield put(setError(user.error))
      } else {
        // localStorage.setItem(AUTH_TOKEN, user.token);
        yield put(showAuthMessage('Signup successed'))
        // yield put(signUpSuccess(user.token));
      }
    } catch (error) {
      yield put(showAuthMessage(error))
    }
  })
}

export function* signInWithFBGoogle() {
  yield takeEvery(SIGNIN_WITH_GOOGLE, function*() {
    try {
      const user = yield call(FirebaseService.signInGoogleRequest)
      if (user.message) {
        yield put(showAuthMessage(user.message))
      } else {
        localStorage.setItem(AUTH_TOKEN, user.user.uid)
        yield put(signInWithGoogleAuthenticated(user.user.uid))
      }
    } catch (error) {
      yield put(showAuthMessage(error))
    }
  })
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_WITH_FACEBOOK, function*() {
    try {
      const user = yield call(FirebaseService.signInFacebookRequest)
      if (user.message) {
        yield put(showAuthMessage(user.message))
      } else {
        localStorage.setItem(AUTH_TOKEN, user.user.uid)
        yield put(signInWithFacebookAuthenticated(user.user.uid))
      }
    } catch (error) {
      yield put(showAuthMessage(error))
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(signInWithFBEmail),
    fork(signOut),
    fork(signUpWithFBEmail),
    fork(signInWithFBGoogle),
    fork(signInWithFacebook)
  ])
}
