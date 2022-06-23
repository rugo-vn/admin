import { MHttpPlugin } from '../../lib';
import { API_INFO, API_SIGN_IN, TOKEN_NAME } from '../constants';
import qs from 'qs';

export default {
  install: (app) => {
    let http;
    const baseURL = import.meta.env.ADMIN_API_BASE_URL;

    const handleResponse = ({ data }) => {
      if (data.status !== 'success')
        throw new Error(data.data);

      return data.data;
    }

    // http
    MHttpPlugin.install({
      provide(_, obj){
        http = obj;
      }
    });

    http.token = sessionStorage.getItem(TOKEN_NAME);

    // loader
    const loader = {
      _isLoading: false,
      count: 0,
      fn: () => {},

      get isLoading(){
        return this._isLoading
      },

      set isLoading(v){
        this._isLoading = v;
        this.fn(v);
      },

      inc(){
        this.count++;
        this.isLoading = true;
      },

      dec(){
        this.count--;

        if (this.count === 0)
          this.isLoading = false;
      },

      onChange(fn){
        this.fn = fn;
      }

    }
    app.provide("loader", loader);

    // api
    const api = {
      http,

      get token(){
        return this.http.token;
      },

      set token(value){
        this.http.token = value;

        if (!value)
          sessionStorage.removeItem(TOKEN_NAME)
        else
          sessionStorage.setItem(TOKEN_NAME, value);
      },

      async signIn(payload){
        const token = await this.post(API_SIGN_IN, payload);
        this.token = token;
        return token;
      },

      async getInfo(){
        return await this.get(API_INFO);
      }
    };

    const methods = [ 'post', 'get', 'patch', 'delete' ];

    for (let method of methods){
      api[method] = async function(url, ...args){
        const http = this.http.createHttpClient(baseURL);
        loader.inc();

        let res, error;
        try {
          res = await http[method](url, ...args);
        } catch(err){
          error = err;
        }
        
        loader.dec();

        if (error)
          throw error;

        return handleResponse(res);
      }
    }

    app.provide("api", api);

    // model
    const model = name => ({
      async list(query){
        return await api.get(`/api/${name}?${qs.stringify(query)}`);
      },

      async create(doc){
        return await api.post(`/api/${name}`, doc);
      },

      async patch(id, doc){
        return await api.patch(`/api/${name}/${id}`, doc);
      },

      async remove(id){
        return await api.delete(`/api/${name}/${id}`);
      }
    });

    app.provide("model", model);
  },
};
