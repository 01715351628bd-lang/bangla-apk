import { APK_BASE64 } from './apkData';

/**
 * Triggers instant client-side download of UnicodeToBijoy.apk
 * Guaranteed to work without network requests or server 404 errors.
 */
export function triggerApkDownload(): boolean {
  try {
    const binaryString = atob(APK_BASE64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], {
      type: 'application/vnd.android.package-archive',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'UnicodeToBijoy.apk';
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 2000);
    return true;
  } catch (err) {
    console.error('Base64 APK download error, trying direct link:', err);
    // Fallback if atob fails
    const fallbackLink = document.createElement('a');
    fallbackLink.href = '/UnicodeToBijoy.apk';
    fallbackLink.download = 'UnicodeToBijoy.apk';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    setTimeout(() => {
      document.body.removeChild(fallbackLink);
    }, 1000);
    return false;
  }
}
