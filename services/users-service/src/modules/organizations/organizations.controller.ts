import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateOrganizationDto): Promise<Organization> {
    return this.organizationsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    await this.organizationsService.remove(id);
    return { deleted: true };
  }
}
