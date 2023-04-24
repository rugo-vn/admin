export const DELAY_INPUT = 500;

export const DEFAULT_ID_FIELD = "id";

export const TOKEN_NAME = "token";
export const CUSTOMIZE_NAME = "customize";

export const NOTICE_TIMEOUT = 2000;

export const DIRECTORY_MIME = "inode/directory";
export const EDITABLE_MIMES = [
  "application/json",
  "application/javascript",
  "text/plain",
];

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
  s3: "/api/s3/default",
};

export const VIEW = new Proxy(
  {},
  {
    get(_, prop) {
      return { name: prop };
    },
  }
);

export const API_DOCS = [
  { type: "heading", title: "Common" },
  {
    type: "endpoint",
    method: "post",
    url: "/api/register",
    payload: { email: "", password: "" },
    detail: "Register a new user",
  },
  {
    type: "endpoint",
    method: "post",
    url: "/api/login",
    payload: { email: "", password: "" },
    detail: "Authenticate and get token for private API access.",
  },
  {
    type: "endpoint",
    method: "post",
    url: "/api/change-password",
    payload: { email: "", currentPassword: "", nextPassword: "" },
    detail: "Change password for specific user.",
  },
  {
    type: "endpoint",
    method: "get",
    url: "/api/info",
    headers: {
      Authorization: "_.token",
    },
    detail: "Get current session information",
  },
];
