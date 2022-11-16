import axios from "axios";
import qs from "qs";
import { defineStore } from "pinia";
import {
  API,
  DEFAULT_ID_FIELD,
  NOTICE_TIMEOUT,
  TOKEN_NAME,
} from "../constants.js";

const validateStatus = (status) => status >= 200 && status < 500;

export const useApiStore = defineStore("api", {
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

    createHttp() {
      const baseURL = import.meta.env.ADMIN_API;
      const headers = {
        ...this.headers,
      };

      const token = this.token;
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }

      return axios.create({ baseURL, headers, validateStatus });
    },

    startLoad() {
      this.nload++;
    },

    endLoad() {
      this.nload--;
    },

    handleResponse(res) {
      if (res.status === 200) return res.data;

      if (res.data && res.data.errors) {
        for (let err of res.data.errors) {
          this.pushNotice({
            ...err,
            type: "danger",
          });
        }

        throw res.data.errors.map((i) => `${i.title}: ${i.detail}`).join("\n");
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

    // auth
    async signIn(email, password) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.post(API.signIn, { email, password });
      this.endLoad();

      const { data: token } = this.handleResponse(res);

      this.pushNotice({
        type: "success",
        title: "Success",
        detail: "Signed in successfully",
      });

      this.setToken(token);
    },
    signUp() {},

    // info
    async getInfo() {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.get(API.info);
      this.endLoad();

      try {
        return this.handleResponse(res);
      } catch (_) {
        return null;
      }
    },

    // model
    async get(model, id) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.get(API.base + model + `/${id}`);
      this.endLoad();

      return this.handleResponse(res);
    },

    async create(model, form) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.post(API.base + model, form);
      this.endLoad();

      return this.handleResponse(res);
    },

    async find(model, query) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.get(
        API.base + model + (query ? `?${qs.stringify(query)}` : "")
      );
      this.endLoad();

      return this.handleResponse(res);
    },

    async update(model, id, form) {
      delete form._id;

      const set = {};
      const unset = {};

      for (let key in form){
        if (form[key] === undefined) {
          unset[key] = true;
        } else {
          set[key] = form[key];
        }
      }

      const http = this.createHttp();

      this.startLoad();
      const res = await http.patch(API.base + model + `/${id}`, { set, unset });
      this.endLoad();

      return this.handleResponse(res);
    },

    async remove(model, id) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.delete(API.base + model + `/${id}`);
      this.endLoad();

      return this.handleResponse(res);
    },

    async x(action, model, id) {
      const http = this.createHttp();

      this.startLoad();
      const res = await http.get(API.basex + `${action}/` + model + `/${id}`);
      this.endLoad();

      return this.handleResponse(res);
    }
  },
});
