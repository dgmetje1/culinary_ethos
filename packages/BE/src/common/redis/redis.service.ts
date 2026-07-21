import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface CacheEntry {
  value: string;
  expiry: number | null;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private fallback = new Map<string, CacheEntry>();
  private connected = false;
  private reconnectTimer: ReturnType<typeof setInterval> | null = null;
  private readonly host: string;
  private readonly port: number;
  private readonly password: string | undefined;

  constructor(configService: ConfigService) {
    this.host = configService.get<string>('REDIS_HOST', 'localhost');
    this.port = configService.get<number>('REDIS_PORT', 6379);
    this.password = configService.get<string>('REDIS_PASSWORD') || undefined;
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.client = new Redis({
        host: this.host,
        port: this.port,
        password: this.password,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
      });

      this.client.on('connect', () => {
        this.connected = true;
        this.clearReconnectTimer();
      });

      this.client.on('error', (err) => {
        if (this.connected) {
          this.logger.warn(`Redis error: ${err.message}. Falling back to in-memory cache.`);
        }
        this.connected = false;
        this.scheduleReconnect();
      });

      this.client.on('close', () => {
        if (this.connected) {
          this.logger.warn('Redis connection closed. Falling back to in-memory cache.');
        }
        this.connected = false;
        this.scheduleReconnect();
      });

      await this.client.connect();
      this.connected = true;
      this.logger.log('Connected to Redis');
    } catch (err) {
      this.connected = false;
      this.logger.warn(`Redis unavailable: ${(err as Error).message}. Using in-memory fallback.`);
      this.client = null;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setInterval(async () => {
      this.logger.log('Attempting Redis reconnect...');
      await this.connect();
    }, 30000);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return entry.expiry !== null && Date.now() > entry.expiry;
  }

  private prune(): void {
    for (const [key, entry] of this.fallback) {
      if (this.isExpired(entry)) this.fallback.delete(key);
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.connected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        this.connected = false;
      }
    }
    const entry = this.fallback.get(key);
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.fallback.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlMs?: number): Promise<'OK'> {
    if (this.connected && this.client) {
      try {
        if (ttlMs) {
          await this.client.set(key, value, 'PX', ttlMs);
        } else {
          await this.client.set(key, value);
        }
        return 'OK';
      } catch {
        this.connected = false;
      }
    }
    this.fallback.set(key, {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null,
    });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    if (this.connected && this.client) {
      try {
        return await this.client.del(key);
      } catch {
        this.connected = false;
      }
    }
    this.prune();
    return this.fallback.delete(key) ? 1 : 0;
  }

  async exists(key: string): Promise<boolean> {
    if (this.connected && this.client) {
      try {
        const result = await this.client.exists(key);
        return result === 1;
      } catch {
        this.connected = false;
      }
    }
    const entry = this.fallback.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.fallback.delete(key);
      return false;
    }
    return true;
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (this.connected && this.client) {
      try {
        const result = await this.client.expire(key, seconds);
        return result === 1;
      } catch {
        this.connected = false;
      }
    }
    const entry = this.fallback.get(key);
    if (!entry) return false;
    entry.expiry = Date.now() + seconds * 1000;
    return true;
  }

  async onModuleDestroy() {
    this.clearReconnectTimer();
    this.fallback.clear();
    if (this.client) {
      await this.client.quit();
    }
  }
}
