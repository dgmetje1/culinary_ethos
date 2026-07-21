export class UserUpdatedEvent {
  constructor(
    public readonly accountId: string,
    public readonly changes: { nickname?: string; picture?: string },
  ) {}
}
