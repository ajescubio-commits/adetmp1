import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
