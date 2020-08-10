///@ts-check
const fileSystem = require("fs-extra");
const parcel = require("parcel");

new parcel(["./source/call.ts"], {
  watch: false,
  sourceMaps: true,
  production: true,
}).bundle();

fileSystem.outputFile(
  "./dist/robot.txt",
  `User-Agent: *
Disallow:

Sitemap: https://tsukumart.com/sitemap
`
);

fileSystem.outputFile(
  "./dist/manifest.json",
  JSON.stringify({
    name: "つくマート",
    short_name: "つくマート",
    icons: [
      {
        src: "./assets/icon512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#733fa7",
    theme_color: "#733fa7",
  })
);

fileSystem.copy("./source/assets/", "./dist/assets/");
fileSystem.copy("./source/signup.html", "./dist/signup");
