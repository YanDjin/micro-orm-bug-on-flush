import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  MikroORM,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  wrap,
} from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { v4 } from "uuid";

@Entity()
export class Operation {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id: string = v4();

  @OneToMany(() => OperationItem, (item) => item.operation)
  items = new Collection<OperationItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

@Entity()
export class OperationItem {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => Operation, { wrappedReference: true })
  operation: IdentifiedReference<Operation>;

  @OneToOne(() => OperationItemData, (data) => data.item, {
    nullable: true,
    wrappedReference: true,
  })
  data?: IdentifiedReference<OperationItemData>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

@Entity()
export class OperationItemData {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id: string = v4();

  @Property()
  startDate: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @OneToOne(() => OperationItem, (item) => item.data, {
    nullable: false,
    owner: true,
    wrappedReference: true,
  })
  item: IdentifiedReference<OperationItem>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

describe("ORM flush update issue", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await MikroORM.init({
      dbName: ":memory:",
      driver: SqliteDriver,
      entities: [Operation, OperationItem, OperationItemData],
      debug: true,
    });

    // same result with sqlite memory or postgresql

    // orm = await MikroORM.init({
    //   type: "postgresql",
    //   dbName: "db",
    //   user: "user",
    //   password: "password",
    //   host: "localhost",
    //   port: 5432,
    //   entities: [Operation, OperationItem, OperationItemData],
    //   driver: PostgreSqlDriver,
    //   debug: true,
    // });
  });

  afterAll(async () => {
    await orm.close(true);
  });

  test(`Test case`, async () => {
    await orm.schema.refreshDatabase();

    const em = orm.em.fork();

    const operation = em.create(Operation, {});
    for (const _ of Array(5)) {
      const item = em.create(OperationItem, {
        operation,
      });
      const data = em.create(OperationItemData, {
        startDate: new Date(),
        endDate: new Date(),
        item,
      });
      item.data = wrap(data).toReference();
      operation.items.add(item);
    }
    await em.persistAndFlush(operation);
    em.clear();

    console.log("------------------------------------");

    // get the items
    const _items = await em.find(OperationItem, {
      id: {
        $ne: "", // added this because find does not seem to work without params
      },
    });

    // this flush will execute an update on operation_item_data
    await em.flush();

    // this loaded data will be missing fields and no request will be done to find it
    const _data = await _items[0].data?.load();

    console.log(_data);
  });
});
