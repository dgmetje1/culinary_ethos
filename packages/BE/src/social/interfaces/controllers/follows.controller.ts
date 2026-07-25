import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { FollowsService } from '../../application/services/follows.service';
import { Public } from '../../../auth/decorators/public.decorator';
import type { UserAttributes } from '../../../social/domain/models';

@ApiBearerAuth()
@ApiTags('Follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'Followed successfully' })
  @ApiResponse({ status: 409, description: 'Already following' })
  async follow(
    @Param('userId') userId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<{ id: string }> {
    return this.followsService.follow(user.id, userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 204, description: 'Unfollowed successfully' })
  @ApiResponse({ status: 404, description: 'Follow not found' })
  async unfollow(
    @Param('userId') userId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<void> {
    await this.followsService.unfollow(user.id, userId);
  }

  @Get(':userId/status')
  @ApiOperation({ summary: 'Check if current user follows a user' })
  @ApiResponse({ status: 200, description: 'Follow status' })
  async isFollowing(
    @Param('userId') userId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<{ following: boolean }> {
    return this.followsService.isFollowing(user.id, userId);
  }

  @Public()
  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get followers count for a user' })
  @ApiResponse({ status: 200, description: 'Followers count' })
  async getFollowers(
    @Param('userId') userId: string,
  ): Promise<{ count: number }> {
    return this.followsService.getFollowers(userId);
  }

  @Public()
  @Get(':userId/following')
  @ApiOperation({ summary: 'Get following count for a user' })
  @ApiResponse({ status: 200, description: 'Following count' })
  async getFollowing(
    @Param('userId') userId: string,
  ): Promise<{ count: number }> {
    return this.followsService.getFollowing(userId);
  }
}
