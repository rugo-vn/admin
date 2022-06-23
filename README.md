# Rugo Admin

## Schema Additions

```json
{
  "__icon": "ion-icon-name", // icon for collection in admin dashboard, do not have outline
}
```

## Field Schema Additions

Any field:

```json
{
  "hidden": true, // hidden from preview and form, but visible in view
  "preview": false, // hidden from preview, but visible in form and view
}
```

Text field:

```json
{
  "type": "text",
  "editor": "rich", // rich text editor
  "upload": { "ref": "resources", "root": "/public" }, // upload image for rich text editor
}
```

Upload field:

```json
{
  "type": "upload",
  "ref": "resources", // model to upload
  "root": "/public", // directory to upload
}
```

Relation field:

```json
{
  "type": "relation",
  "ref": "categories", // model to relation
  "str": "name", // name to show in select box
}
```