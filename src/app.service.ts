import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private _configService: ConfigType<typeof config>,
  ) {}
  getHello(): string {
    const apiKey = this._configService.apiKey;
    const databaseName = this._configService.database.name;
    return `Hello World! ${apiKey} - ${databaseName}`;
  }
}
