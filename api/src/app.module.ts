import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ProjectsModule } from './projects/projects.module';
import { PodcastsModule } from './podcasts/podcasts.module';


@Module({
  imports: [BlogsModule, DatabaseModule, ConfigModule.forRoot({isGlobal:true}), AuthModule, UsersModule, PassportModule, ProjectsModule, PodcastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
