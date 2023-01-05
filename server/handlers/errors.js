module.exports = {
  errors: {
    BAD_REQUEST: {
      code: "E_BAD_REQUEST",
      message: "The request cannot be fulfilled due to bad syntax",
      status: 400,
    },

    CREATED: {
      code: "CREATED",
      message:
        "The request has been fulfilled and resulted in a new resource being created",
      status: 201,
    },

    FORBIDDEN: {
      code: "E_FORBIDDEN",
      message: "User not authorized to perform the operation",
      status: 403,
    },

    NOT_FOUND: {
      code: "E_NOT_FOUND",
      message:
        "The requested resource could not be found but may be available again in the future",
      status: 404,
    },

    OK: {
      response_code: "0",
      message: "Operation is successfully executed",
      status: "success",
    },

    SERVER_ERROR: {
      response_code: "0",
      code: "E_INTERNAL_SERVER_ERROR",
      message: "Something bad happened on the server",
      status: 500,
    },

    UNAUTHORIZED: {
      code: "E_UNAUTHORIZED",
      message: "Missing or invalid authentication",
      status: 401,
    },

    SUCCESS: {
      response_code: "0",
      message: "Data retreived successfully",
      status: 200,
    },

    VERIFICATION_SUCCESS: {
      response_code: "0",
      message: "Congratulation, you verified successfully.",
      status: "success",
    },

    DATA_FOUND: {
      response_code: "0",
      message: "Data retreived successfully.",
      status: "success",
    },

    DB_QUERY_ERROR: {
      response_code: "1",
      message:
        "Something went wrong with database query, please try again later.",
      status: "error",
    },

    MANDATORY_FIELDS: {
      response_code: "1",
      message: "Please provide all mandatory values.",
      status: "error",
    },

    PARAMETER_OR_VALUE_NOT_FOUND: {
      response_code: "1",
      message: "Parameter or value missing",
      status: "error",
    },

    DATA_NOT_FOUND: {
      response_code: "1",
      message: "No Data Found.",
      status: "error",
    },

    WENT_WRONG: {
      response_code: "2",
      message: "Something went wrong, please try again later.",
      status: "error",
    },

    SHOP_NOT_FOUND: {
      response_code: "1",
      message: "Shop you entered is not available.",
      status: "error",
    },

    INVALID_SHOP: {
      response_code: "1",
      message: "Shop can't be blank and name must contain .myshopify.com.",
      status: "error",
    },
    API_KEY_NOT_FOUND: {
      response_code: "1",
      message: "APP_KEY and APP_SECRET not found",
      status: "error",
    },
  },
};
