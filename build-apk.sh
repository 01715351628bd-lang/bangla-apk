#!/bin/bash
set -e

export PATH="/usr/bin:/usr/lib/android-sdk/build-tools/debian:$PATH"

BUILD_DIR="/tmp/android-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/unicodetobijoy/converter"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/assets/www"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/gen"

ANDROID_JAR="/usr/share/java/com.android.android-23.jar"

# 1. Copy icons
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png"
cp public/pwa-512x512.png "$BUILD_DIR/res/mipmap-xxhdpi/ic_launcher.png"

# 2. Build Vite production bundle
npm run build

# 3. Create standalone inlined HTML so no external network or file:/// CORS issues occur in WebView
node -e "
const fs = require('fs');
const path = require('path');

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const files = fs.readdirSync(path.join(distDir, 'assets'));
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js') && !f.includes('workbox') && !f.includes('prod'));

const cssContent = fs.readFileSync(path.join(distDir, 'assets', cssFile), 'utf8');
const jsContent = fs.readFileSync(path.join(distDir, 'assets', jsFile), 'utf8');

// Replace stylesheet with inlined <style>
html = html.replace(/<link rel=\"stylesheet\"[^>]*>/i, '<style>' + cssContent + '</style>');
// Replace module script with classic inlined <script>
html = html.replace(/<script type=\"module\"[^>]*><\/script>/i, '<script type=\"text/javascript\">' + jsContent + '</script>');
html = html.replace(/<link rel=\"manifest\"[^>]*>/gi, '');

fs.writeFileSync('$BUILD_DIR/assets/www/index.html', html);
console.log('Inlined index.html created for APK, size:', html.length);
"

# Also copy raw assets just in case
cp -r dist/assets "$BUILD_DIR/assets/www/" 2>/dev/null || true
cp public/icon.svg "$BUILD_DIR/assets/www/" 2>/dev/null || true

# 4. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.unicodetobijoy.converter"
    android:versionCode="2"
    android:versionName="1.0.1">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 5. strings.xml
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Unicode to Bijoy</string>
</resources>
EOF

# 6. MainActivity.java
cat << 'EOF' > "$BUILD_DIR/src/com/unicodetobijoy/converter/MainActivity.java"
package com.unicodetobijoy.converter;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ConsoleMessage;
import android.view.KeyEvent;
import android.graphics.Color;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#0f172a"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                android.util.Log.d("UnicodeToBijoy", consoleMessage.message() + " [" + consoleMessage.lineNumber() + "]");
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                android.util.Log.d("UnicodeToBijoy", "Loaded: " + url);
            }
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                android.util.Log.e("UnicodeToBijoy", "Error: " + description + " URL: " + failingUrl);
            }
        });

        try {
            InputStream is = getAssets().open("www/index.html");
            BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            reader.close();
            String htmlData = sb.toString();

            // loadDataWithBaseURL provides an https:// origin so ES6, Storage & DOM APIs operate without restriction
            webView.loadDataWithBaseURL(
                "https://converter.local/",
                htmlData,
                "text/html",
                "UTF-8",
                null
            );
        } catch (Exception e) {
            android.util.Log.e("UnicodeToBijoy", "Fallback to loadUrl", e);
            webView.loadUrl("file:///android_asset/www/index.html");
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

echo "==> Step 1: aapt package resources and generate R.java"
aapt package -f -m \
    -J "$BUILD_DIR/gen" \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I "$ANDROID_JAR"

echo "==> Step 2: Compile Java classes using ecj"
mkdir -p "$BUILD_DIR/bin/classes"
ecj -7 -proc:none \
    -d "$BUILD_DIR/bin/classes" \
    -cp "$ANDROID_JAR" \
    "$BUILD_DIR/gen/com/unicodetobijoy/converter/R.java" \
    "$BUILD_DIR/src/com/unicodetobijoy/converter/MainActivity.java"

echo "==> Step 3: Convert classes to dex"
dalvik-exchange --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/bin/classes"

echo "==> Step 4: Package APK with aapt"
aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -A "$BUILD_DIR/assets" \
    -I "$ANDROID_JAR" \
    -F "$BUILD_DIR/bin/unaligned.apk"

# Add classes.dex into unaligned.apk
cd "$BUILD_DIR/bin"
aapt add unaligned.apk classes.dex
cd -

echo "==> Step 5: Zipalign APK"
zipalign -f -p 4 "$BUILD_DIR/bin/unaligned.apk" "$BUILD_DIR/bin/aligned.apk"

echo "==> Step 6: Create keystore and sign APK"
KEYSTORE="$BUILD_DIR/release-key.jks"
keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -alias releasekey \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass android123 \
    -keypass android123 \
    -dname "CN=UnicodeToBijoy, OU=Converter, O=App, L=Dhaka, S=Dhaka, C=BD"

apksigner sign \
    --ks "$KEYSTORE" \
    --ks-key-alias releasekey \
    --ks-pass pass:android123 \
    --key-pass pass:android123 \
    --out "$BUILD_DIR/bin/UnicodeToBijoy.apk" \
    "$BUILD_DIR/bin/aligned.apk"

echo "==> Step 7: Verify APK signature"
apksigner verify "$BUILD_DIR/bin/UnicodeToBijoy.apk"

# Copy the finalized APK to project root and public folder
cp "$BUILD_DIR/bin/UnicodeToBijoy.apk" ./UnicodeToBijoy.apk
cp "$BUILD_DIR/bin/UnicodeToBijoy.apk" ./public/UnicodeToBijoy.apk

# Update embedded base64 in src/utils/apkData.ts
node -e "
const fs = require('fs');
const apk = fs.readFileSync('UnicodeToBijoy.apk');
const b64 = apk.toString('base64');
const content = 'export const APK_BASE64 = \"' + b64 + '\";\n';
fs.writeFileSync('src/utils/apkData.ts', content);
console.log('src/utils/apkData.ts updated with new APK!');
"

echo "SUCCESS! APK created and verified!"
ls -lh ./UnicodeToBijoy.apk ./public/UnicodeToBijoy.apk
