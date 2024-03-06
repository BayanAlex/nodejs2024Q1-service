import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DBError } from 'src/database/database.service';
import { DBErrors } from 'src/database/database.models';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.usersService.create(createUserDto);
    if (result instanceof DBError) {
      this.processError(result);
    }
    return result;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const result = this.usersService.findOne(id);
    if (result instanceof DBError) {
      this.processError(result, id);
    }
    return result;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const result = this.usersService.update(id, updatePasswordDto);
    if (result instanceof DBError) {
      this.processError(result, id);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const result = this.usersService.remove(id);
    if (result instanceof DBError) {
      this.processError(result, id);
    }
  }

  processError(error: DBError, id?: string) {
    if (error.code === DBErrors.NOT_FOUND) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (error.code === DBErrors.UUID) {
      throw new HttpException(
        `${id} is not valid UUID`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (error.code === DBErrors.PASSWORD) {
      throw new HttpException('Invalid old password', HttpStatus.FORBIDDEN);
    }
  }
}
