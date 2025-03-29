## Cors plgin for @luban/framework

## Simple Usage

```typescript
import Hook from '@luban/framework/core/Hook.ts';
import Cors from '@luban/plugin-cors';

Hook.use(Cors());
Hook.use(async (_req: Request, hook: Hook) => {
    console.log('hook2 run');
    return await hook.next();
});
```

## Configuring CORS

```typescript
Hook.use(Cors({
    // origins: ['*'],
    origins: ['https://www.mydomain.com'],
    allowMethods: ['GET', 'POST'],
    allowHeaders: [],
    allowCredentials: false,
    maxAge: '86400',
    exposeHeaders: [],
}));
```
