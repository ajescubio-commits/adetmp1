
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LostItemService } from './lost_item.service';
import { LostItemController } from './lost_item.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LostItemController],
  providers: [LostItemService],
  exports: [LostItemService],
})
export class LostItemModule {}
