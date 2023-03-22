import axios from "axios";
import qs from "qs";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { join } from "path-browserify";
import { useSchemaStore } from "./schema.js";
import {
  API,
  DEFAULT_ID_FIELD,
  NOTICE_TIMEOUT,
  TOKEN_NAME,
  VIEW,
} from "../constants.js";
import { useAppStore } from "./app.js";

const validateStatus = (status) => status >= 200 && status < 500;

const useHttpStore = defineStore("http", {
  state: () => ({
    nload: 0,
    token: null,
    headers: {},
    notices: [],
    currentNoticeId: 0,
  }),

  getters: {
    isLoading() {
      return this.nload > 0;
    },
  },

  actions: {
    // basic
    init() {
      // init token
      this.token = sessionStorage.getItem(TOKEN_NAME);

      // clean notices
      setInterval(() => {
        const now = Date.now();

        do {
          let notice = this.notices[0];
          if (!notice) break;

          if (now - notice.at > NOTICE_TIMEOUT) this.notices.shift();
          else break;
        } while (this.notices.length > 0);
      }, 100);
    },

    createHttp(type) {
      const baseURL = import.meta.env.ADMIN_API;
      const headers = {
        ...this.headers,
      };

      const token = this.token;
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }

      return axios.create({
        baseURL,
        headers,
        validateStatus,
        ...(type
          ? {
              responseType: type,
            }
          : {}),
      });
    },

    startLoad() {
      this.nload++;
    },

    endLoad() {
      this.nload--;
    },

    handleResponse(res) {
      if (res.status === 200) return res.data;

      if (res.data && res.data.error) {
        this.pushNotice({
          ...res.data.error,
          type: "danger",
        });

        throw `${res.data.error.title}: ${res.data.error.detail}`;
      }

      throw new Error(res.data);
    },

    setToken(value) {
      this.token = value;
      if (!value) sessionStorage.removeItem(TOKEN_NAME);
      else sessionStorage.setItem(TOKEN_NAME, value);
    },

    pushNotice(payload) {
      this.notices.push({
        ...payload,
        [DEFAULT_ID_FIELD]: ++this.currentNoticeId,
        at: Date.now(),
      });
    },
  },
});

const useAuthStore = defineStore("auth", () => {
  const http = useHttpStore();

  return {
    async signIn(email, password) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.post(API.signIn, { email, password });
      http.endLoad();

      const { token } = http.handleResponse(res);

      http.pushNotice({
        type: "success",
        title: "Success",
        detail: "Signed in successfully",
      });

      http.setToken(token);
    },
    signUp() {},

    // info
    async getInfo() {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(API.info);
      http.endLoad();

      try {
        return http.handleResponse(res);
      } catch (_) {
        return null;
      }
    },
  };
});

const useTableStore = defineStore("table", () => {
  const http = useHttpStore();

  return {
    // table handlers
    async get(model, id) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(API.table + model + `/${id}`);
      http.endLoad();

      return http.handleResponse(res);
    },

    async create(model, form) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.post(API.table + model, form);
      http.endLoad();

      return http.handleResponse(res);
    },

    async find(model, query) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(
        API.table + model + (query ? `?${qs.stringify(query)}` : "")
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async update(model, id, form) {
      delete form._id;

      const set = {};
      const unset = {};

      for (let key in form) {
        if (form[key] === undefined) {
          unset[key] = true;
        } else {
          set[key] = form[key];
        }
      }

      const req = http.createHttp();

      http.startLoad();
      const res = await req.patch(API.table + model + `/${id}`, { set, unset });
      http.endLoad();

      return http.handleResponse(res);
    },

    async remove(model, id) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.delete(API.table + model + `/${id}`);
      http.endLoad();

      return http.handleResponse(res);
    },
  };
});

const useDriveStore = defineStore("drive", () => {
  const http = useHttpStore();

  return {
    async list(driveName, entryPath) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(
        API.drive + driveName + `?${qs.stringify({ path: entryPath })}`
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async create(driveName, form) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.post(API.drive + driveName, form);
      http.endLoad();

      return http.handleResponse(res);
    },

    async remove(driveName, entryPath) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.delete(
        API.drive + driveName + `?${qs.stringify({ path: entryPath })}`
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async download(driveName, entryPath) {
      const req = http.createHttp("blob");

      http.startLoad();
      const res = await req.get(
        join(
          API.drive,
          driveName,
          `download?${qs.stringify({ path: entryPath })}`
        )
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async move(driveName, from, to) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(
        join(API.drive, driveName, `move?${qs.stringify({ from, to })}`)
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async compress(driveName, from, to) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(
        join(API.drive, driveName, `compress?${qs.stringify({ from, to })}`)
      );
      http.endLoad();

      return http.handleResponse(res);
    },

    async extract(driveName, from, to) {
      const req = http.createHttp();

      http.startLoad();
      const res = await req.get(
        join(API.drive, driveName, `extract?${qs.stringify({ from, to })}`)
      );
      http.endLoad();

      return http.handleResponse(res);
    },
  };
});

export const useApiStore = defineStore("api", () => {
  const http = useHttpStore();
  const auth = useAuthStore();
  const table = useTableStore();
  const drive = useDriveStore();
  const router = useRouter();
  const schemaStore = useSchemaStore();
  const appStore = useAppStore();

  return {
    http,
    auth,
    table,
    drive,
    async load() {
      let data;

      if (http.token) data = await auth.getInfo();

      if (!data) {
        http.pushNotice({
          type: "warn",
          title: "Reminder",
          detail: "Please sign in to access!",
        });
        http.setToken(null);
        return router.push(VIEW.SignInView);
      }

      const { schemas, drives, overviews } = data;
      schemaStore.setSchemas(schemas);
      schemaStore.setDrives(drives);
      schemaStore.setOverviews(overviews);

      appStore.info = data;

      if (location.hash.indexOf("#/dashboard") === -1)
        router.push(VIEW.OverviewView);
    },
  };
});
