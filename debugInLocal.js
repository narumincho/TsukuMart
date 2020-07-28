const parcel = require("parcel");

new parcel(["./source/index.html"], {
  outDir: "debugDistribution",
}).serve(2520);
