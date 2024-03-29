export type Group = {
  name: string;
  memberIds: [];
  owner: string;
  createdAt: number;
  setupCompleted: boolean;
  useMode: UseMode;
};

export enum UseMode {
  NotSet = 0,
  SingleUser,
  Group,
}

export type GroupWithId = Group & { id: string };

export class GroupFactory {
  create(data: Partial<Group>): Group {
    return Object.assign<Group, typeof data>(
      { name: '', memberIds: [], owner: '', createdAt: Date.now(), setupCompleted: false, useMode: UseMode.NotSet },
      data,
    );
  }
}
