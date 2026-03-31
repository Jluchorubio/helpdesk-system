import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthAccount } from './entities/auth-account.entity';
import { AuthService } from './auth.service';

@Controller('auth/accounts')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll(): Promise<AuthAccount[]> {
    return this.authService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<AuthAccount> {
    return this.authService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateAccountDto): Promise<AuthAccount> {
    return this.authService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAccountDto,
  ): Promise<AuthAccount> {
    return this.authService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    await this.authService.remove(id);
    return { deleted: true };
  }
}
