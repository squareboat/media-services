import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { invert } from 'lodash';

@Injectable()
export class App implements OnModuleInit {
  static config: Config;
  static env: Environment;
  constructor(private ref: ModuleRef) {}

  onModuleInit() {
    App.config = new Config(this.ref.get(ConfigService, { strict: false }));
    App.env = new Environment(App.config);
  }
}

export class Config {
  constructor(private config: ConfigService) {}

  get<T = any>(key: string): T {
    return this.config.get(key);
  }

  getKeyOfVal(key: string, value: any): string {
    const invertedObj = invert(this.config.get(key));
    return invertedObj[value];
  }
}

export class Environment {
  constructor(private config: Config) {}

  isLocal(): boolean {
    const env = this.config.get('app.env');
    return env == 'local' || env == 'dev';
  }

  isStaging(): boolean {
    const env = this.config.get('app.env');
    return env == 'staging' || env == 'testing' || env == 'development';
  }

  isProd(): boolean {
    const env = this.config.get('app.env');
    return env == 'production' || env == 'prod';
  }
}
