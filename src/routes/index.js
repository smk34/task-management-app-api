import fs from 'fs';
import path from 'path';

const basename = path.basename(__filename);

const router = [];

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    router.push(require(path.join(__dirname, file)));
  });

export default router;
