export const DELAY_SEARCH = 1000;

export const DEFAULT_ID_FIELD = "_id";

export const TOKEN_NAME = "token";
export const NOTICE_TIMEOUT = 2000;

export const DIRECTORY_MIME = "inode/directory";

export const SELECT_MODE = {
  none: "none",
  single: "single",
  multi: "multi",
};

export const API = {
  base: "/api/",
  data: "/api/data/",
  signIn: "/api/login",
  signUp: "/api/register",
  info: "/api/info",
};

export const VIEW = new Proxy(
  {},
  {
    get(_, prop) {
      return { name: prop };
    },
  }
);
