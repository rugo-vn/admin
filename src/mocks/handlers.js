import { rest } from "msw";

export const handlers = [
  rest.post("/api/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: "this-is-a-fake-token",
      })
    );
  }),

  rest.get("/api/info", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: [
          {
            __name: "users",
            __type: "mem",
            __icon: "person",

            email: { type: "text", required: true, maxlength: 60 },
            password: { type: "password", maxlength: 60 },
            apikey: { type: "text", maxlength: 60 },
          },
          {
            __name: "posts",
            __type: "mem",
            __icon: "document-text",

            name: { type: "text", required: true, maxlength: 60 },
            slug: {
              type: "text",
              required: true,
              maxlength: 60,
              regex: "^[a-z0-9-_.]+$",
              default: "%unislug:name%",
              hidden: true,
            },
            desc: { type: "text", maxlength: 160 },
            image: {
              type: "upload",
              ref: "resources",
              root: "/public",
              preview: false,
            },
            category: { type: "relation", ref: "categories", str: "name" },
            content: {
              type: "text",
              editor: "rich",
              upload: { ref: "resources", root: "/public" },
              preview: false,
            },
            status: {
              type: "text",
              choice: ["draft", "public"],
              default: "draft",
            },
            pin: { type: "boolean", default: false },
          },
          {
            __name: "categories",
            __type: "mem",
            __icon: "copy",

            name: { type: "text", required: true, maxlength: 60 },
            slug: {
              type: "text",
              required: true,
              maxlength: 60,
              regex: "^[a-z0-9-_.]+$",
              default: "%unislug:name%",
              hidden: true,
            },
          },
          {
            __name: "resources",
            __type: "fs",
            __icon: "folder-open",
          },
        ],
      })
    );
  }),

  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: {
          total: 0,
          limit: 10,
          skip: 0,
          data: [],
        },
      })
    );
  }),

  rest.get("/api/posts", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: {
          total: 0,
          limit: 10,
          skip: 0,
          data: [],
        },
      })
    );
  }),

  rest.get("/api/categories", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: {
          total: 0,
          limit: 10,
          skip: 0,
          data: [],
        },
      })
    );
  }),

  rest.get("/api/resources", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: {
          total: 0,
          limit: 10,
          skip: 0,
          data: [],
        },
      })
    );
  }),
];
