import { htmlToText } from "html-to-text";

export function extractPlainText(html){
  return htmlToText(html, { wordwrap: 130, ignoreImage: true });
}
