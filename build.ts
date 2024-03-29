/* eslint-disable camelcase */
import * as fileSystem from "fs-extra";

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
fileSystem.remove("./dist/index.html");
