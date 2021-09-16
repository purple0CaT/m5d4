export const badreqFoundErrHandl = (err, req, res, next) => {
  if (err.status == 400) {
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};
export const forbiddenFoundErrHandl = (err, req, res, next) => {
  if (err.status == 402) {
    res.status(402).send(err.message);
  } else {
    next(err);
  }
};
export const notFoundErrHandl = (err, req, res, next) => {
  if (err.status == 404) {
    res.status(404).send(err.message);
  } else {
    next(err);
  }
};
export const genericErrHandl = (err, req, res, next) => {
  res.status(500).send("Generic Server Error");
};
