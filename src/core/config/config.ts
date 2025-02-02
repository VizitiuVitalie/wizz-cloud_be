import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ConfigType } from './config_type.interface';

const YAML_CONFIG_FILENAME = 'config.yaml';

export function Config() {
  const filePath = join(process.cwd(), YAML_CONFIG_FILENAME);
  return yaml.load(readFileSync(filePath, 'utf8')) as ConfigType;
}
