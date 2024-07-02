global.chrome = {
  tabs: {
    query: async () => { throw new Error("Unimplemented.") }
  },
  runtime: {
    getManifest: async () => { {version: "1.1.0"} }
  }
};
