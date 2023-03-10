import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OperationModule } from '@src/modules/operation/operation.module';
import { ConfigModule } from '@nestjs/config';
import { EntityCaseNamingStrategy } from '@mikro-orm/core';
import {
  Operation,
  OperationItem,
  OperationItemData,
} from '@src/modules/operation/operation.model';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot({
      type: 'postgresql',
      host: 'database',
      port: 5432,
      dbName: 'db',
      user: 'user',
      password: 'password',
      entities: [Operation, OperationItem, OperationItemData],
      driver: PostgreSqlDriver,
      debug: true,
      namingStrategy: EntityCaseNamingStrategy,
    }),
    OperationModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
