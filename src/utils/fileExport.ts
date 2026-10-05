/**
 * File export utilities for Text (.txt) and Rich Text Format (.rtf)
 * Optimized for Microsoft Word, WordPad, Illustrator, and InDesign workflows.
 */

/**
 * Escapes characters for RTF specification
 */
function escapeRtfText(text: string, isBijoy: boolean): string {
  if (isBijoy) {
    // Bijoy is ANSI 8-bit text (SutonnyMJ).
    // Escape RTF control characters: \, {, }
    // Convert newlines to \par
    // Non-ASCII characters (code >= 128) should be escaped as \'xx in RTF
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (char === '\\') {
        result += '\\\\';
      } else if (char === '{') {
        result += '\\{';
      } else if (char === '}') {
        result += '\\}';
      } else if (char === '\n') {
        result += '\\par\n';
      } else if (char === '\r') {
        // Skip carriage returns, \n will handle paragraphs
        continue;
      } else if (char === '\t') {
        result += '\\tab ';
      } else if (code >= 128 && code <= 255) {
        // ANSI hex escape for RTF, e.g. \'e0
        result += `\\\'${code.toString(16).padStart(2, '0')}`;
      } else if (code > 255) {
        // Unicode fallback if any character outside 8-bit
        const signedCode = code > 32767 ? code - 65536 : code;
        result += `\\u${signedCode}?`;
      } else {
        result += char;
      }
    }
    return result;
  } else {
    // Unicode text: escape \uXXXX for RTF
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (char === '\\') {
        result += '\\\\';
      } else if (char === '{') {
        result += '\\{';
      } else if (char === '}') {
        result += '\\}';
      } else if (char === '\n') {
        result += '\\par\n';
      } else if (char === '\r') {
        continue;
      } else if (char === '\t') {
        result += '\\tab ';
      } else if (code > 127) {
        // RTF signed 16-bit integer for unicode
        const signedCode = code > 32767 ? code - 65536 : code;
        result += `\\u${signedCode}?`;
      } else {
        result += char;
      }
    }
    return result;
  }
}

/**
 * Generates valid Rich Text Format (.rtf) content with font assignment
 */
export function generateRtf(text: string, isBijoy: boolean): string {
  const escapedContent = escapeRtfText(text, isBijoy);

  if (isBijoy) {
    // SutonnyMJ ANSI font preset
    return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033
{\\fonttbl
{\\f0\\fnil\\fcharset0 SutonnyMJ;}
{\\f1\\fnil\\fcharset0 Arial;}
}
{\\colortbl ;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\lang1093\\f0\\fs26
${escapedContent}\\par
}`;
  } else {
    // Unicode Bengali font preset (Vrinda, Kalpurush, Noto Sans Bengali)
    return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033
{\\fonttbl
{\\f0\\fnil\\fcharset0 Vrinda;}
{\\f1\\fnil\\fcharset0 Kalpurush;}
{\\f2\\fnil\\fcharset0 Noto Sans Bengali;}
{\\f3\\fnil\\fcharset0 Arial;}
}
{\\colortbl ;\\red0\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\lang1093\\f0\\fs24
${escapedContent}\\par
}`;
  }
}

/**
 * Triggers browser download of a generated blob
 */
function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Export converted text as a plain text file (.txt)
 */
export function downloadAsTxt(text: string, isBijoy: boolean, baseName?: string): void {
  const prefix = isBijoy ? 'bijoy_sutonnymj' : 'unicode_bengali';
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const filename = baseName ? `${baseName}.txt` : `${prefix}_${timestamp}.txt`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerFileDownload(blob, filename);
}

/**
 * Export converted text as a Rich Text Format file (.rtf) ready for Microsoft Word
 */
export function downloadAsRtf(text: string, isBijoy: boolean, baseName?: string): void {
  const prefix = isBijoy ? 'bijoy_sutonnymj' : 'unicode_bengali';
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const filename = baseName ? `${baseName}.rtf` : `${prefix}_${timestamp}.rtf`;

  const rtfContent = generateRtf(text, isBijoy);
  const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
  triggerFileDownload(blob, filename);
}
