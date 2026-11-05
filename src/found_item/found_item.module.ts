
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FoundItemService } from './found_item.service';
import { FoundItemController } from './found_item.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FoundItemController],
  providers: [FoundItemService],
  exports: [FoundItemService],
})
export class FoundItemModule {}
