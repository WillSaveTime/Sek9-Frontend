import {
  SIGNIN,
  AUTHENTICATED,
  SIGNOUT,
  SIGNOUT_SUCCESS,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNUP,
  SIGNUP_SUCCESS,
  SET_ERROR,
  SHOW_LOADING,
  SIGNIN_WITH_GOOGLE,
  SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
  SET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE
} from '../constants/Auth'

export const signIn = user => {
  return {
    type: SIGNIN,
    payload: user
  }
}

export const authenticated = (token, member) => {
  return {
    type: AUTHENTICATED,
    token,
    member
  }
}

export const signOut = () => {
  return {
    type: SIGNOUT
  }
}

export const signOutSuccess = () => {
  return {
    type: SIGNOUT_SUCCESS
  }
}

export const signUp = user => {
  return {
    type: SIGNUP,
    payload: user
  }
}

export const signUpSuccess = token => {
  return {
    type: SIGNUP_SUCCESS,
    token
  }
}

export const signInWithGoogle = () => {
  return {
    type: SIGNIN_WITH_GOOGLE
  }
}

export const signInWithGoogleAuthenticated = token => {
  return {
    type: SIGNIN_WITH_GOOGLE_AUTHENTICATED,
    token
  }
}

export const signInWithFacebook = () => {
  return {
    type: SIGNIN_WITH_FACEBOOK
  }
}

export const signInWithFacebookAuthenticated = token => {
  return {
    type: SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
    token
  }
}

export const showAuthMessage = message => {
  return {
    type: SHOW_AUTH_MESSAGE,
    message
  }
}

export const setError = error => {
  return {
    type: SET_ERROR,
    error
  }
}
export const setFavorites = favorites => {
  return {
    type: SET_FAVORITES,
    favorites
  }
}
export const addFavorite = favorite => {
  return {
    type: ADD_FAVORITE,
    favorite
  }
}
export const removeFavorite = favorite => {
  return {
    type: REMOVE_FAVORITE,
    favorite
  }
}

export const hideAuthMessage = () => {
  return {
    type: HIDE_AUTH_MESSAGE
  }
}

export const showLoading = () => {
  return {
    type: SHOW_LOADING
  }
}
