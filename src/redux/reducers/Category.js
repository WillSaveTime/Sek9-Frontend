import {
	SET_CATEGORIES,
	DELETE_CATEGORIES,
	SHOW_CATEGORY_LOADING
} from '../constants/Category';

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  categories: [],
};

const category = (state = initState, action) => {
	switch (action.type) {
		case SET_CATEGORIES:
			return {
				...state,
				loading: false,
				categories: action.categories
			}
		case DELETE_CATEGORIES: 
			return {
				...state,
				loading: false,
				categories: [],
			}
		case SHOW_CATEGORY_LOADING: {
			return {
				...state,
				loading: true
			}
		}
		default:
			return state;
	}
};

export default category;