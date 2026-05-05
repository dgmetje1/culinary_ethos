import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserQueriesService } from '../../application/services';
import {
  UserAccountResponseDto,
  UserSummaryResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from '../../application/dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly userQueriesService: UserQueriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserAccountResponseDto,
  })
  @ApiBody({ type: CreateUserRequestDto })
  async createUser(
    @Body() data: CreateUserRequestDto,
  ): Promise<UserAccountResponseDto> {
    return this.userQueriesService.createUser(data);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get user by account ID' })
  @ApiParam({ name: 'accountId', type: String })
  async getUserByAccountId(
    @Param('accountId') accountId: string,
  ): Promise<UserAccountResponseDto> {
    return this.userQueriesService.getDataByAccountId(accountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String })
  async getUserById(@Param('id') id: string): Promise<UserAccountResponseDto> {
    return this.userQueriesService.getDataById(id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get user summary by ID' })
  @ApiParam({ name: 'id', type: String })
  async getUserSummaryById(
    @Param('id') id: string,
  ): Promise<UserSummaryResponseDto> {
    return this.userQueriesService.getDataSummaryById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserAccountResponseDto,
  })
  @ApiBody({ type: UpdateUserRequestDto })
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserRequestDto,
  ): Promise<UserAccountResponseDto> {
    return this.userQueriesService.updateUser(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'The user has been deleted.' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userQueriesService.deleteUser(id);
  }
}