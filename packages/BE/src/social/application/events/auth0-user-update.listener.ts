import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Auth0ManagementService } from "../services/auth0-management.service";
import { UserUpdatedEvent } from "./user-updated.event";

@Injectable()
export class Auth0UserUpdateListener {
  private readonly logger = new Logger(Auth0UserUpdateListener.name);

  constructor(private readonly auth0ManagementService: Auth0ManagementService) {}

  @OnEvent("user.updated")
  async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    try {
      await this.auth0ManagementService.updateUser(event.accountId, event.changes);
    } catch (error) {
      this.logger.error(`Failed to propagate user update to Auth0 for ${event.accountId}`, error);
    }
  }
}
