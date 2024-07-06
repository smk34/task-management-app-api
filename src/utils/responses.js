const successResponse = (res, data) => res.status(200).json(data);
const serverErrorResponse = (res, data) => res.status(500).json(data);
const badRequestResponse = (res, data) => res.status(400).json(data);
const unauthorizedResponse = (res, data) => res.status(401).json(data);
const forbiddenResponse = (res, data) => res.status(403).json(data);
const notFoundResponse = (res, data) => res.status(404).json(data);

const handle304 = (error, res) => {
  if (error.message.includes("304")) {
    console.log("304 error received from DB server");
    return res.status(304).send(`Request failed with status code: 304`);
  }
};

export {
  successResponse,
  serverErrorResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handle304,
};
