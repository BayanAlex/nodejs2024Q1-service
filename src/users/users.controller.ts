import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DBError } from 'src/database/database.service';
import { processError } from 'src/utils/errors';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.usersService.create(createUserDto);
    if (result instanceof DBError) {
      processError(result, 'User');
    }
    return result;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    const result = this.usersService.findOne(id);
    if (result instanceof DBError) {
      processError(result, 'User', id);
    }
    return result;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const result = this.usersService.update(id, updatePasswordDto);
    if (result instanceof DBError) {
      processError(result, 'User', id);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const result = this.usersService.remove(id);
    if (result instanceof DBError) {
      processError(result, 'User', id);
    }
  }
}
