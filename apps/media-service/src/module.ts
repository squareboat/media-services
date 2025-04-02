import { Module } from "@nestjs/common";
import { MediaCompressHandler } from "./eventListener";
import { BoatModule } from "@libs/boat";
import { MediaWorkerModule } from "@libs/media-worker";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConsoleModule } from "@squareboat/nest-console";

@Module({
  imports: [
    BoatModule,
    ConsoleModule,
    MediaWorkerModule.registerAsync({
      imports: [ConfigModule, ConsoleModule],
      useFactory: (config: ConfigService) => config.get("media"),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MediaCompressHandler],
})
export class MediaModule {}
