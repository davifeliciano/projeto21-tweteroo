import { Body, Post, Controller, HttpStatus, HttpCode } from '@nestjs/common';
import { InsertUserDto } from './dto/insert-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  insert(@Body() insertUserDto: InsertUserDto) {
    this.userService.insert(insertUserDto);
  }
}
