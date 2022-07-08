import {
	SET_CATEGORIES,
	DELETE_CATEGORIES,
	SHOW_CATEGORY_LOADING
} from '../constants/Category';

export function setCategories(categories) {
  return {
    type: SET_CATEGORIES,
    categories
  };
}

export function deleteCategories() {
  return {
    type: DELETE_CATEGORIES
  };
}

export function showCategoryLoading() {
  return {
    type: SHOW_CATEGORY_LOADING
  };
}
