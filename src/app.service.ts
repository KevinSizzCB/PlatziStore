import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
// import { Client } from 'pg';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private _configService: ConfigType<typeof config>,
    // @Inject('PG') private _pgService: Client,
  ) { }
  getHello(): string {
    const apiKey = this._configService.apiKey;
    const databaseName = this._configService.database.name;
    return `Hello World! ${apiKey} - ${databaseName}`;
  }

  getTasks() {
    // return new Promise((resolve, reject) => {
    //   this._pgService.query('SELECT * FROM tasks', (err, res) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(res.rows);
    //     }
    //   });
    // })
  }
}
