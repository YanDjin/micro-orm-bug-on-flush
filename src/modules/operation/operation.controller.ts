import { Controller, Get } from '@nestjs/common';
import { OperationService } from '@src/modules/operation/operation.service';

@Controller('test')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Get()
  test() {
    return this.operationService.test();
  }
}
