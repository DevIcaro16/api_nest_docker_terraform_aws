import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './controller/shared/public-decorator';

@Controller()
@ApiTags('app')
export class AppController {
  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get API status' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): string {
    return 'Hello World!';
  }
}
