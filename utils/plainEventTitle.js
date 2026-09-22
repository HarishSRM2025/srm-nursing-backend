// Event names are plain text, including when pasted from a rich-text editor.
module.exports = function plainEventTitle(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/<!--[^]*?-->/g, '')
        .replace(/<(script|style)\b[^>]*>[^]*?<\/\1\s*>/gi, '')
        .replace(/<\/?[a-z][a-z0-9:-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, '')
        .trim();
};
