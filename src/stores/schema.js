import { defineStore } from "pinia";
import objectPath from "object-path";
import { clone } from "ramda";

export const useSchemaStore = defineStore("schema", {
  state: () => ({
    schemas: {},
    drives: {},
    overviews: [],
  }),

  actions: {
    setSchemas(schemas) {
      this.schemas = {};

      for (const schema of schemas) this.schemas[schema.name] = clone(schema);
    },

    getSchema(tableName, path = "") {
      const ps = path.split(".").filter((i) => i);
      let schemaPath = tableName;

      for (let name of ps) {
        let numberName = parseInt(name);
        if (!isNaN(numberName)) name = numberName;

        let currentSchema = objectPath.get(this.schemas, schemaPath);

        if (!currentSchema)
          throw new Error(`Could not find schema for "${schemaPath}"`);

        if (!currentSchema.type || currentSchema.type === "Object") {
          schemaPath += `.properties.${name}`;
        } else if (currentSchema.type === "Array") {
          schemaPath += `.items`;
        } else if (currentSchema.type === "Rich") {
          schemaPath += `.image`;
        } else {
          throw new Error(`Could not find schema for "${schemaPath}.${name}"`);
        }
      }

      return objectPath.get(this.schemas, schemaPath);
    },

    setDrives(drives) {
      this.drives = {
        ...drives,
      };
    },

    getDrive(driveName) {
      return this.drives[driveName];
    },

    setOverviews(overviews) {
      this.overviews = [...overviews];
    },
  },
});
