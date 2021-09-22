import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, host, password, port, user } = configService.postgres;
        return {
          port,
          type: 'postgres',
          username: user,
          host, //'172.19.0.3',
          database: dbName,
          password,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        // const { dbName, host, password, port, user } = configService.postgres;
        // const client = new Client({
        //   user,
        //   host, //'172.19.0.3',
        //   database: dbName,
        //   password,
        //   port,
        // })

        // client.connect().catch(e => console.log('Error connecting db PG', e));
        // return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: [/* 'PG', */ TypeOrmModule],
})
export class DatabaseModule { }
