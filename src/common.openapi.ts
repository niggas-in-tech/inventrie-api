import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorSchema {
  @ApiProperty({ example: 'Resource validation failed' })
  message: string;
  @ApiProperty({ example: '2022-09-17T12:59:19+00:00' })
  timestamp: string;
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  code: string;
  @ApiProperty()
  meta: Record<string, string>;
  @ApiProperty({
    example: [
      {
        field: 'email',
        message: 'email must be an email',
      },
    ],
  })
  errors: { field: string; message: string }[];
}
