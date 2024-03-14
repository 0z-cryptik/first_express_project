"use strict";

module.exports = {
  noResourceFound: (req, res) => {
    res.status(404).render("error", { errorType: 404 });
  },
  internalError: (error, req, res, next) => {
    console.log(`error occured: ${error}`);
    res.status(500).sendFile(`./public/${500}.html`, { root: "./" });
  },
  errorJSON: (error, req, res, next) => {
    let errorObjext;

    if (error) {
      errorObjext = {
        status: 500,
        message: error.message
      };
    } else {
      errorObjext = {
        status: 500,
        message: "unknown error"
      };
    }

    res.status(500).json(errorObjext);
  }
};
