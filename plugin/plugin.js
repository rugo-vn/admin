import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { curryN } from 'ramda';
import Router from '@koa/router';
import send from 'koa-send';
import { BasePlugin, KoaComposer, wrapComposer } from 'rugo-common';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createStatic = async ({ root }, ctx, next) => {
  const opts = {
    root: resolve(root),
    index: 'index.html'
  };

  if (ctx.path === '/admin')
    return ctx.redirect('/admin/');

  if (ctx.path.indexOf('/admin/') !== 0)
    return await next();

  const urlPath = ctx.path.replace('/admin', '') || '/';
  let done = false

  if (ctx.method === 'HEAD' || ctx.method === 'GET') {
    try {
      done = await send(ctx, urlPath, opts)
    } catch (err) {
      if (err.status !== 404) {
        throw err
      }
    }
  }

  if (!done) {
    await next()
  }
}

export default {
  ...BasePlugin,

  name: 'admin',
  priority: 5,
  depends: ['server', 'schemas', 'auth'],

  async start (context) {
    const auth = context.auth(KoaComposer);
    const adminApi = wrapComposer(async () => {
      return {
        status: 200,
        data: context.schemas
      };
    })(KoaComposer);

    const router = new Router();

    router.get('/api/info', auth.gate('.disableAuthGate', '.headers.authorization', '.'), adminApi());

    context.server.use(router.routes());
    context.server.use(curryN(2, createStatic)({ root: join(__dirname, '../dist') }) );
  }
};
