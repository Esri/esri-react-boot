// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// ACTION TYPES //
export const types = {
  AUTH_START: "AUTH_START",
  AUTH_COMPLETE: "AUTH_COMPLETE",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  AUTH_CHECK: "AUTH_CHECK",
  LOGOUT: "LOGOUT"
};

// REDUCERS //
export const initialState = {
  user: null,
  portal: null,
  token: null,
  loggedIn: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      const { user, portal, token } = action.payload;

      return {
        user,
        portal,
        token,
        loggedIn: true
      };

    case types.AUTH_FAIL:
      return {
        user: null,
        portal: null,
        token: null,
        loggedIn: false
      };

    default:
      return state;
  }
};

// ACTIONS //
export const checkAuth = options => ({
  type: types.AUTH_CHECK,
  payload: options
});

export const startAuth = options => ({
  type: types.AUTH_START,
  payload: options
});

export const completeAuth = options => ({
  type: types.AUTH_COMPLETE,
  payload: options
});

export const logout = sessionId => ({
  type: types.LOGOUT,
  payload: {
    sessionId: sessionId
  }
});
