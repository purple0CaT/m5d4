export const badreqFoundErrHandl = (err, req, res, next) => {
  if (err.status == 400) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
};

export const genericErrHandl = (err, req, res, next) => {
  res.status(500).send(err.message);
};
