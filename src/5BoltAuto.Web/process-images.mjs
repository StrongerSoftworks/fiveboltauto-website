import sharp from "sharp";
import fs from "fs";

const defaultSizes = [240, 360, 480];

function processImagesInDir(dir) {
  let dirSizes = defaultSizes;
  if (fs.existsSync(`${dir}/image-settings.json`)) {
    const data = fs.readFileSync(`${dir}/image-settings.json`);
    dirSizes = JSON.parse(data);
  }

  let responsiveSizes = [];
  while (dirSizes.length) {
    const size = dirSizes.pop();
    responsiveSizes.push(size);
    responsiveSizes.push(size * 1.5);
    responsiveSizes.push(size * 2);
  }
  dirSizes = responsiveSizes;

  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      processImagesInDir(name);
    } else {
      const newDir = `${dir}`.replace("assets", "wwwroot/bundle");
      const newFile = file.slice(0, file.lastIndexOf("."));
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
      }
      if (file.endsWith(".json")) {
        continue;
      }

      // keep original SVGs
      if (file.endsWith(".svg")) {
        fs.copyFile(name, `${newDir}/${file}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      // AVIF
      sharp(name)
        .avif({
          quality: 70,
          lossless: false,
          speed: 5,
          effort: 3,
        })
        .toFile(`${newDir}/${newFile}.avif`, (err) => {
          if (err) {
            console.error(err);
          } else {
            const resize = (size) =>
              sharp(`${newDir}/${newFile}.avif`)
                .resize(size, null, { fit: "inside" })
                .toFile(`${newDir}/${newFile}-${size}.avif`);

            Promise.all(dirSizes.map(resize));
          }
        });
    }
  }
}

console.log("Processing images");

if (!fs.existsSync("wwwroot/bundle")) {
  fs.mkdirSync("wwwroot/bundle");
}
if (!fs.existsSync("wwwroot/bundle/img")) {
  fs.mkdirSync("wwwroot/bundle/img");
}
processImagesInDir("assets/img");
