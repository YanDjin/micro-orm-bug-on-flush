import {
  Collection,
  Entity,
  Enum,
  IdentifiedReference,
  ManyToOne,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

export enum OperationItemType {
  CREATION = 'creation',
  DELETION = 'deletion',
  UPDATE = 'update',
}

@Entity({ tableName: 'operations' })
export class Operation {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: string = v4();

  @OneToMany(() => OperationItem, (item) => item.operation)
  items = new Collection<OperationItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

@Entity({ tableName: 'operationItems' })
export class OperationItem {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => Operation, { wrappedReference: true })
  operation: IdentifiedReference<Operation>;

  @Enum({ items: () => OperationItemType })
  type: OperationItemType;

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

@Entity({ tableName: 'operationItemsData' })
export class OperationItemData {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: string = v4();

  @Property()
  startDate: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @Property()
  startTime: string;

  @Property()
  endTime: string;

  @Property()
  mondays: boolean;

  @Property()
  tuesdays: boolean;

  @Property()
  wednesdays: boolean;

  @Property()
  thursdays: boolean;

  @Property()
  fridays: boolean;

  @Property()
  saturdays: boolean;

  @Property()
  sundays: boolean;

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
