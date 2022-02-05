import { makeUserStore } from "../models/user";

const userStore = makeUserStore();

function index() {
  return userStore.index();
}

function show(userName: string) {
  return userStore.show(userName);
}

export function makeUserService() {
  return { index, show };
}
