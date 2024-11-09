import * as types from './actionTypes';

export function beginAjaxCall() {
  return { type: types.BEGIN_AJAX_CALL };
}

export function ajaxCallError(data) {
  return { type: types.AJAX_CALL_ERROR, data };
}

export function ajaxClear()
{
  return {type: types.AJAX_CALL_CLEAR};
}