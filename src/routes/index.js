import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

async function loadRouters() {
  const router = [];

  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of files) {
    const modulePath = path.join(__dirname, file);
    const moduleUrl = pathToFileURL(modulePath).href; // Convert to file URL
    const module = await import(moduleUrl);
    router.push(module.default);
  }

  return router;
}

const router = await loadRouters();
export default router;
