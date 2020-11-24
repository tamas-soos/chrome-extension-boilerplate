module.exports = {
  name: "TS/R/WP Chrome Extension",
  version: "0.0.1",
  manifest_version: 2,
  description:
    "Boilerplate for a Chrome extension with TypeScript, React, and Webpack.",
  homepage_url: "https://duo.com/labs",
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },
  browser_action: {
    default_title: "TSRWPCX",
    default_popup: "popup.html",
  },
  default_locale: "en",
  background: {
    scripts: [
      // WEB
      "js/background.js",
      // PDFJS_STATIC
      "options/migration.js",
      "preserve-referer.js",
      "pdfHandler.js",
      "extension-router.js",
      "pdfHandler-vcros.js",
      "suppress-update.js",
    ],
  },
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["js/content.js"],
    },
    {
      matches: ["http://*/*", "https://*/*", "ftp://*/*", "file://*/*"],
      run_at: "document_start",
      all_frames: true,
      css: ["contentstyle.css"],
      js: ["contentscript.js"],
    },
  ],
  storage: {
    managed_schema: "preferences_schema.json",
  },
  file_browser_handlers: [
    {
      id: "open-as-pdf",
      default_title: "Open with PDF Viewer",
      file_filters: ["filesystem:*.pdf"],
    },
  ],
  permissions: [
    "fileBrowserHandler",
    "webRequest",
    "webRequestBlocking",
    "<all_urls>",
    "tabs",
    "tabCapture",
    "activeTab",
    "webNavigation",
    "storage",
  ],
  web_accessible_resources: [
    "content/web/viewer.html",
    "http:/*",
    "https:/*",
    "ftp:/*",
    "file:/*",
    "chrome-extension:/*",
    "blob:*",
    "data:*",
    "filesystem:/*",
    "drive:*",
  ],
};
