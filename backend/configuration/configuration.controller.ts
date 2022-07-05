import { CONFIGURATION_KEYS } from '../../shared/configuration.constants';
import {
  configurationService,
  ConfigurationService,
} from './configuration.service';

export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  async showConfig(key: keyof typeof CONFIGURATION_KEYS, entity?: string) {
    return await this.configurationService.show(key, entity);
  }

  async upsertConfig(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string,
  ) {
    // TODO value needs some kind of data validation
    await this.configurationService.upsert(key, value, entity);
  }
}

export const configurationController = new ConfigurationController(
  configurationService,
);
