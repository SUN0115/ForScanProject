import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: '完成 NestJS 與 Vue 串接', description: '任務標題' })
  title!: string;

  @ApiPropertyOptional({ example: '輸入詳細內容', description: '任務描述' })
  description?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: '任務標題' })
  title?: string;

  @ApiPropertyOptional({ description: '任務描述' })
  description?: string;

  @ApiPropertyOptional({ description: '是否已完成' })
  isCompleted?: boolean;
}
