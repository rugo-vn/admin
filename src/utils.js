import { path } from "ramda";
import { join } from "path-browserify";
import { Buffer } from "buffer";

const INVALID_PATH_REGEX = /[<>:"\\|?*\u0000-\u001F]/g; // eslint-disable-line

export const formatLabel = (label) => {
  label = label.replace(/([A-Z])/g, " $1");
  label = label.charAt(0).toUpperCase() + label.slice(1);
  return label;
};

// base64url
function padString(input) {
  var segmentLength = 4;
  var stringLength = input.length;
  var diff = stringLength % segmentLength;

  if (!diff) {
    return input;
  }

  var position = stringLength;
  var padLength = segmentLength - diff;
  var paddedStringLength = stringLength + padLength;
  var buffer = Buffer.alloc(paddedStringLength);
  buffer.write(input);

  while (padLength--) {
    buffer.write("=", position++);
  }

  return buffer.toString();
}

function encode(input, encoding) {
  if (encoding === void 0) {
    encoding = "utf8";
  }

  if (Buffer.isBuffer(input)) {
    return fromBase64(input.toString("base64"));
  }

  return fromBase64(Buffer.from(input, encoding).toString("base64"));
}

function decode(base64url, encoding) {
  if (encoding === void 0) {
    encoding = "utf8";
  }

  return Buffer.from(toBase64(base64url), "base64").toString(encoding);
}

function toBase64(base64url) {
  base64url = base64url.toString();

  return padString(base64url).replace(/\-/g, "+").replace(/_/g, "/");
}

function fromBase64(base64) {
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function toBuffer(base64url) {
  return Buffer.from(toBase64(base64url), "base64");
}

export const base64url = {
  encode,
  decode,
  toBase64,
  fromBase64,
  toBuffer,
};

/**
 *
 * @param inputId
 */
export function FsId(inputId) {
  if (!(this instanceof FsId)) {
    return new FsId(inputId);
  }

  let workingId;

  // clone id from object
  if (typeof path(["id"], inputId) === "string") {
    workingId = inputId.id;
  }

  // create from string
  if (typeof inputId === "string") {
    workingId = inputId;
  }

  if (typeof workingId !== "string") {
    workingId = "";
  }

  // try decode path
  const decodedId = base64url.decode(workingId);
  if (INVALID_PATH_REGEX.test(decodedId)) {
    throw new RugoException("Wrong input id");
  }

  // assign id
  this.id = workingId;
}

FsId.fromPath = function (originPath) {
  const formattedPath = join("/", originPath).substring(1);
  return new FsId(base64url.encode(formattedPath));
};

// output
FsId.prototype.toPath = function () {
  return base64url.decode(this.id);
};

FsId.prototype.toString = function (format) {
  return this.id.toString(format);
};

FsId.prototype.toJSON = function () {
  return this.id;
};

FsId.prototype[Symbol.for("nodejs.util.inspect.custom")] = function () {
  return this.inspect();
};

FsId.prototype.inspect = function () {
  return 'new FsId("'.concat(this.id, '")');
};
