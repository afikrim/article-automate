/**
 * @param {Number} ms
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} prompt
 */
export function parsePrompt(prompt) {
  const splittedPrompt = prompt.split("\n");
  return splittedPrompt
    .map(function mapSplittedPrompt(p) {
      if (p.length == 0) {
        return `<p><br class="ProseMirror-trailingBreak"></p>`;
      }
      return `<p>${p}</p>`;
    })
    .join("");
}
