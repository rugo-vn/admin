import { defineStore } from "pinia";
import objectPath from "object-path";

export const useSchemaStore = defineStore("schema", {
  state: () => ({
    schemas: {},
  }),

  actions: {
    setSchemas(schemas) {
      for (let schema of schemas) {
        this.schemas[schema.name] = schema;
      }
    },

    getSchema(model, path = "") {
      const ps = path.split(".").filter((i) => i);
      let schemaPath = model;

      for (let name of ps) {
        let numberName = parseInt(name);
        if (!isNaN(numberName)) name = numberName;

        let currentSchema = objectPath.get(this.schemas, schemaPath);

        if (!currentSchema)
          throw new Error(`Could not find schema for "${schemaPath}"`);

        if (!currentSchema.type || currentSchema.type === "object") {
          schemaPath += `.properties.${name}`;
        } else if (currentSchema.type === "array") {
          schemaPath += `.items`;
        } else if (currentSchema.type === "rich") {
          schemaPath += `.image`;
        } else {
          throw new Error(`Could not find schema for "${schemaPath}.${name}"`);
        }
      }

      return objectPath.get(this.schemas, schemaPath);
    },
  },
});
