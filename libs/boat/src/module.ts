import { Global, Module } from "@nestjs/common";
import config from "@config/index";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { BaseValidator, IsValueFromConfigConstraint } from "./validator";
import { App } from "./utils";
import { RestController } from "./rest";
import { EventModule } from "@squareboat/nest-events";
import { ConsoleModule } from "@squareboat/nest-console";
import { StorageModule } from "@squareboat/nest-storage";

const getFactory = (key: string) => ({
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => config.get(key),
});

@Global()
@Module({
  imports: [
    EventModule,
    DiscoveryModule,
    StorageModule.registerAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get("storage");
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    // ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    ConsoleModule.register(),
  ],
  controllers: [RestController],
  providers: [
    BaseValidator,
    IsValueFromConfigConstraint,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    App,
  ],
  exports: [BaseValidator],
})
export class BoatModule {}
