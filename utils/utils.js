exports.validateString = (str, maxLength) => {
    return typeof str === 'string' && str.trim().length > 0 && str.length <= maxLength;
  };
  
  exports.getErrorMessage = (error) => {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };
  