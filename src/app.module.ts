import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mssql',

        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 1433),

        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),

        database: configService.get<string>('DB_DATABASE'),

        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        synchronize: false,

        options: {
          encrypt: false,
          trustServerCertificate: true,
        },

        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    // Tus demás módulos
    // UsersModule,
    // PromotionsModule,
    // etc.
  ],
})
export class AppModule {}