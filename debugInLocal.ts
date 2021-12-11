/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const parcel = require("parcel");

new parcel(["./source/index.html"], {
  outDir: "debugDistribution",
}).serve(2520);
