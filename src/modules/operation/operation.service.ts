import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Operation,
  OperationItem,
  OperationItemData,
  OperationItemType,
} from '@src/modules/operation/operation.model';
import { MikroORM, wrap } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Injectable()
export class OperationService {
  constructor(private orm: MikroORM, private readonly em: EntityManager) {}

  async test() {
    // await this.prepareData();
    const em = this.em.fork();
    try {
      const operation = await em.findOne(Operation, {
        updatedAt: {
          $lt: new Date(),
        },
      });

      // load the items
      const items = await em.find(OperationItem, {
        operation,
      });

      // flush (you should see a log of the strange update)
      await em.flush();

      for (const item of items) {
        if (!item.data) continue;
        // this will not load all the needed data because of the update it seems
        const data = await item.data.load();
        console.log(data);
      }

      return true;
    } catch {
      return false;
    }
  }

  async prepareData() {
    await this.orm.schema.dropSchema();
    await this.orm.schema.createSchema();

    const em = this.orm.em.fork();

    const operationId = v4();
    const operation = em.create(Operation, {
      id: operationId,
    });
    for (const _ of Array(5).fill(null)) {
      const item = em.create(OperationItem, {
        operation,
        type: OperationItemType.CREATION,
      });
      const data = em.create(OperationItemData, {
        startDate: new Date(),
        item,
        startTime: '08:00',
        endTime: '12:00',
        fridays: true,
        mondays: true,
        saturdays: true,
        sundays: true,
        thursdays: true,
        tuesdays: true,
        wednesdays: true,
      });
      item.data = wrap(data).toReference();
      operation.items.add(item);
    }
    await em.persistAndFlush(operation);
    em.clear();
  }
}
