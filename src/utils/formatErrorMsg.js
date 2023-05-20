const regex = /\B(?=(\d{3})+(?!\d))/g;

export default (msg) => {
  // Remove quotation marks.
  let formattedMsg = `${msg.replaceAll('"', "'")}.`;

  // Insert comma to number if a number is present in the error message.
  formattedMsg = formattedMsg.replace(regex, ',');

  return formattedMsg;
};
