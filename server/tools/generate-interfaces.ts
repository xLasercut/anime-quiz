import { convertFromDirectory } from 'joi-to-typescript';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  const projectRoot = path.join(__dirname, '..');
  const schemaDir = path.join(projectRoot, 'src', 'schemas');
  const interfaceDir = path.join(projectRoot, 'src', 'shared', 'interfaces');

  fs.rmSync(interfaceDir, { force: true, recursive: true });

  await convertFromDirectory({
    schemaDirectory: schemaDir,
    typeOutputDirectory: interfaceDir,
    debug: true,
    useLabelAsInterfaceName: false
  });
}

generate()
  .then(() => {
    console.log('GENERATED');
  })
  .catch((e) => {
    console.log('ERROR');
    console.log(e);
  });
