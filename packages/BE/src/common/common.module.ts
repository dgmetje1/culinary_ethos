import { Module, Global } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { LoggingInterceptor } from "./interceptors";
import { AllExceptionsFilter } from "./filters";
import { RedisModule } from "./redis/redis.module";

@Global()
@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [RedisModule],
})
export class CommonModule {}
