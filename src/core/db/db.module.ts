import { DB_CONNECTION_TOKEN } from './db-connection.token';
import { DbProvider } from './db.provider';

const providers = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: () => new DbProvider(new DbConfig({})),
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DbModule {}
