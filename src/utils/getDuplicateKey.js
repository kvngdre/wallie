const regex = /(?<=_)\w+(?=_)/;

function getDuplicateKey(exception) {
    const constraint = exception.constraint;
    const fieldName = constraint.match(regex)[0];
    return fieldName
        .charAt(0)
        .toUpperCase()
        .concat(fieldName.slice(1))
        .replace('_', ' ');
}

module.exports = getDuplicateKey;
