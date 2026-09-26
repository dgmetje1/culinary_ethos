import { Controller, Get, Put, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import {
  NotificationsService,
  NotificationListItem,
} from "../../application/services/notifications.service";
import type { UserAttributes } from "../../domain/models";

@ApiBearerAuth()
@ApiTags("Notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get all notifications for the current user" })
  @ApiResponse({ status: 200, type: [Object] })
  async getNotifications(@CurrentUser() user: UserAttributes): Promise<NotificationListItem[]> {
    return this.notificationsService.getNotifications(user.id);
  }

  @Get("unread/count")
  @ApiOperation({ summary: "Get unread notification count" })
  @ApiResponse({ status: 200 })
  async getUnreadCount(@CurrentUser() user: UserAttributes): Promise<{ count: number }> {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Put(":id/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark a notification as read" })
  @ApiResponse({ status: 204 })
  async markAsRead(@Param("id") id: string, @CurrentUser() user: UserAttributes): Promise<void> {
    await this.notificationsService.markAsRead(user.id, id);
  }

  @Put("read/all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark all notifications as read" })
  @ApiResponse({ status: 204 })
  async markAllAsRead(@CurrentUser() user: UserAttributes): Promise<void> {
    await this.notificationsService.markAllAsRead(user.id);
  }
}
