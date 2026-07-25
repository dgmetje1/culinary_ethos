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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../../../auth/decorators/public.decorator';
import { UserQueriesService } from '../../application/services';
import {
  UserAccountResponseDto,
  UserAdminResponseDto,
  UserSummaryResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from '../../application/dto';

@ApiBearerAuth()
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

  @Get('all')
  @ApiOperation({ summary: 'Get all users (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [UserAdminResponseDto],
  })
  async findAll(): Promise<UserAdminResponseDto[]> {
    return this.userQueriesService.getAllUsers();
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

  @Public()
  @Get(':id/summary')
  @ApiOperation({ summary: 'Get public user summary by ID' })
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
  @ApiResponse({ status: 204, description: 'The user has been deleted.' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userQueriesService.deleteUser(id);
  }

  @Put(':id/suspend')
  @ApiOperation({ summary: 'Suspend a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been suspended.',
    type: UserAdminResponseDto,
  })
  async suspendUser(@Param('id') id: string): Promise<UserAdminResponseDto> {
    return this.userQueriesService.suspendUser(id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been activated.',
    type: UserAdminResponseDto,
  })
  async activateUser(@Param('id') id: string): Promise<UserAdminResponseDto> {
    return this.userQueriesService.activateUser(id);
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({
    status: 200,
    description: 'The user role has been changed.',
    type: UserAdminResponseDto,
  })
  @ApiBody({ schema: { properties: { role: { type: 'string' } } } })
  async changeUserRole(
    @Param('id') id: string,
    @Body() data: { role: string },
  ): Promise<UserAdminResponseDto> {
    return this.userQueriesService.changeUserRole(id, data.role);
  }
}