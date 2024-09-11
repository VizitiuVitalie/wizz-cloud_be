import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnums } from '../config/config.enums';
import { DatabaseConfig } from '../config/db.config';
import { DbConfig } from './db.config';
import { DbProvider } from './db.provider';

const providers: Provider[] = [
  {
    provide: DbProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const config = configService.get<DatabaseConfig>(ConfigEnums.DATABASE);

      return new DbProvider(new DbConfig(config));
    },
  },
];

@Module({
  imports: [],
  providers: [ConfigService, ...providers],
  exports: [...providers],
})
export class DbModule {}
