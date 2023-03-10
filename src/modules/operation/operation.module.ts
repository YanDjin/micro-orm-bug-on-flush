import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  Operation,
  OperationItem,
  OperationItemData,
} from '@src/modules/operation/operation.model';
import { OperationService } from '@src/modules/operation/operation.service';
import { OperationController } from '@src/modules/operation/operation.controller';

@Module({
  providers: [OperationService],
  controllers: [OperationController],
  imports: [
    MikroOrmModule.forFeature({
      entities: [Operation, OperationItem, OperationItemData],
    }),
  ],
  exports: [OperationService],
})
export class OperationModule {}
