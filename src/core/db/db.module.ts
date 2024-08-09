import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnums } from '../config/config.enums';
import { DatabaseConfig } from '../config/db.config';
import { DB_CONNECTION_TOKEN } from './db-connection.token';
import { DbConfig } from './db.config';
import { DbProvider } from './db.provider';

const providers: Provider[] = [
  {
    provide: DB_CONNECTION_TOKEN,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const config = configService.get<DatabaseConfig>(ConfigEnums.DATABASE);

      return new DbProvider(new DbConfig(config));
    },
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DbModule {}
