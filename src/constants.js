export const DELAY_INPUT = 500;

export const DEFAULT_ID_FIELD = "id";

export const TOKEN_NAME = "token";
export const CUSTOMIZE_NAME = "customize";

export const NOTICE_TIMEOUT = 2000;

export const DIRECTORY_MIME = "inode/directory";

export const SELECT_MODE = {
  none: "none",
  single: "single",
  multi: "multi",
};

export const API = {
  base: "/api/",
  table: "/api/tables/",
  drive: "/api/drives/",
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
