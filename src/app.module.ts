
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClaimsModule } from './claims/claims.module';
import { LostItemModule } from './lost_item/lost_item.module';
import { FoundItemModule } from './found_item/found_item.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ClaimsModule,
    LostItemModule,
    FoundItemModule,
  ],
})
export class AppModule {}
