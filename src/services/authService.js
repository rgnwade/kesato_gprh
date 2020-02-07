import jwt from "jsonwebtoken";

import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiEndPoint + "auth";
const tokenKey = "authToken";

http.setAuthToken(getAuthToken());

export async function signin(email, password, role = "admin") {
  const { data: jwt } = await http.post(apiEndpoint + "/signin", {
    email,
    password,
    role
  });
  localStorage.setItem(tokenKey, jwt);
  return jwt;
}

export function signinAuto(user) {
  const token = jwt.sign(JSON.stringify(user), config.app.key);
  loginWithJwt(token);
  return token;
}

export async function signup(
  email,
  password,
  role = "admin",
  sendEmailNotification = true
) {
  const { data: user } = await http.post(apiEndpoint + "/signup", {
    email,
    password,
    role,
    sendEmailNotification
  });
  return user;
}

export async function signupByAdmin(
  email,
  password,
  role = "admin",
  sendEmailNotification = true,
  author
) {
  const { data: user } = await http.post(apiEndpoint + "/signup-by-admin", {
    email,
    password,
    role,
    sendEmailNotification,
    author
  });
  return user;
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem("createVenueData");
  localStorage.removeItem("studentData");
}

export function getAuthToken() {
  return localStorage.getItem(tokenKey);
}

export function isAuthorizedUser(role = "admin") {
  const user = getAuthUser();
  if (user && user.role.role === role) return true;
  return false;
}

export function getAuthUser() {
  try {
    const token = localStorage.getItem(tokenKey);
    return jwt.verify(token, config.app.key);
  } catch (ex) {
    return null;
  }
}

export async function getConfirmUser(token) {
  const { data: result } = await http.get(
    config.apiEndPoint + "auth/signup/complete/" + token
  );
  return result;
}

export async function userUpdateProfile(data, byAdmin = false) {
  const { data: result } = await http.post(
    config.apiEndPoint + "auth/user/update",
    data
  );
  if (result) {
    const { data: userData } = await http.get(
      config.apiEndPoint + "auth/user/" + data.id
    );
    if (!byAdmin) return signinAuto(userData);
    else return true;
  }
  return null;
}

export default {
  signin,
  signup,
  signupByAdmin,
  loginWithJwt,
  logout,
  getAuthUser,
  getAuthToken,
  getConfirmUser,
  signinAuto,
  userUpdateProfile,
  isAuthorizedUser
};
