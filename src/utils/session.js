import { UserSession } from "@esri/arcgis-rest-auth";
import { getPortal } from "@esri/arcgis-rest-portal";
import * as Cookies from "js-cookie";

/**
 * sign in using OAuth pop up
 */
export function signIn(options) {
  const {
    portalUrl = "https://www.arcgis.com/",
    clientId,
    sessionId = `${portalUrl}_session`,
    popup
  } = options;

  // if (!sessionId) {
  //   sessionId = `${portalUrl}_session`;
  // }

  console.log("signIn: ", portalUrl, clientId, sessionId, popup);
  // TODO !! errors here right before sign in redirect !!
  const session = UserSession.beginOAuth2({
    clientId,
    portalUrl,
    popup,
    redirectUri: `${window.location.origin}/auth`
  });
  // .then(session => {
  //   // save session for next time the user loads the app
  //   saveSession(session, sessionId);
  //   return session;
  // });
  return session.getUser();
}

/**
 * sign in using OAuth pop up
 */
export async function completeSignIn(options) {
  const {
    portalUrl = "https://www.arcgis.com/",
    clientId,
    sessionId = `${portalUrl}_session`,
    popup
  } = options;
  // if (!sessionId) {
  //   sessionId = `${portalUrl}_session`;
  // }

  console.log("COMPLETE signIn: ", portalUrl, clientId, sessionId, popup);

  const session = UserSession.completeOAuth2({ clientId, portalUrl });

  const token = session.token;

  saveSession(session, sessionId);

  const user = await session.getUser();

  console.log("complete usersession: ", session, user);
  const portal = await getPortal(null, {
    portal: session.portal,
    authentication: session
  });

  return { user, portal, token };
}

/**
 * make sure the user is not logged in the next time they load the app
 */
export function signOut(sessionId) {
  deleteSession(sessionId);
}

/**
 * restore a previously saved session
 */
export async function restoreSession(sessionId) {
  let authInfos = null;

  const serializedSession = Cookies.get(sessionId);
  const session =
    serializedSession && UserSession.deserialize(serializedSession);

  if (session) {
    const user = await session.getUser();

    const portal = await getPortal(null, {
      portal: session.portal,
      authentication: session
    });

    const token = session.token;

    authInfos = {
      user,
      portal,
      token
    };
  }

  return authInfos;
}

// save session & user for next time the user loads the app
function saveSession(session, sessionId) {
  // get expiration from session
  const expires = session.tokenExpires;
  Cookies.set(sessionId, session.serialize(), {
    expires,
    secure: true,
    SameSite: "None"
  });
}

// delete a previously saved session
function deleteSession(sessionId) {
  Cookies.remove(sessionId);
}
