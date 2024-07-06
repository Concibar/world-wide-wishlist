global.chrome = {
  tabs: {
    query: async () => { throw new Error("Unimplemented.") }
  },
  runtime: {
    getManifest: () => {
      return {
        "name": "Mock Mide Midlist",
        "version": "1.1.0",
        "manifest_version": 3,
        "description": "Mock any product from any website to one unified midlist.",
        "author": "Mock Mewa",
        "minimum_chrome_version": "124",

        "action": {
          "default_icon": "images/icon324.png",
          "default_title": "Save to your World Wide Wishlist",
          "default_popup": "html/popup.html"
        },

        "icons": {
          "16": "images/icon16.png",
          "32": "images/icon32.png",
          "48": "images/icon48.png",
          "128": "images/icon128.png"
        },

        "background": { "service_worker": "background.mjs", "type": "module" },

        "permissions": [
          "contextMenus",
          "storage",
          "unlimitedStorage",
          "activeTab",
          "scripting",
          "downloads"
        ]
      }
    }
  },
  storage: {
    local: {
      _mockStorage: {},
      get: async function(keys) {
        if (typeof keys == "string") {keys = [keys]}

        var returnObject = {}
        keys.forEach(key => {
          if (!this._mockStorage[key]) {return undefined}
          returnObject[key] = this._mockStorage[key]
        });
        return Promise.resolve(returnObject)
      },
      set: async function(data) {
        let key = Object.keys(data)[0]
        let value = Object.values(data)[0]
        this._mockStorage[key] = value
        return Promise.resolve()
      }
    }
  }
}
