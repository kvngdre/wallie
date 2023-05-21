function formatErrorMessage(errorMessage) {
  //  * Regex to locate the appropriate space for inserting commas in numbers.
  const regex = /(?<!.*ISO \d)\B(?=(\d{3})+(?!\d))/g;

  // * Remove quotation marks and insert comma to number found.
  return `${errorMessage.replaceAll('"', '').replace(regex, ',')}.`;
}

/**
 *
 * @param {*} error
 * @returns
 */
export default function refineError(error) {
  /**
   * This function joins the elements of the error path array.
   * Example: ['name', 'first'] becomes 'name.first'.
   * @param {string} accumulator
   * @param {string} nextValue
   * @returns {string}
   */
  const reducer = (accumulator, nextValue) => {
    if (accumulator === '') return accumulator + nextValue;
    return accumulator + '.' + nextValue;
  };

  const refinedError = {};
  for (const errorDetail of error.details) {
    refinedError[errorDetail.path.reduce(reducer, '')] = formatErrorMessage(
      errorDetail.message,
    );
  }

  return refinedError;
}
