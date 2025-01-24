## Cors plgin for @candy/framework

## Simple Usage

```typescript
import Hook from '@candy/framework/core/Hook.ts';
import Cors from '@candy/plugin-cors';

Hook.use(Cors());
Hook.use(async (_req: Request, hook: Hook) => {
    console.log('hook2 run');
    return await hook.next();
});
```

## Configuring CORS

```typescript
Hook.use(Cors({
    // allowOrigins: ['*'],
    allowOrigins: ['https://www.mydomain.com'],
    allowMethods: ['GET', 'POST'],
    allowHeaders: [],
    allowCredentials: false,
    AccessControlMaxAge: '86400',
    AccessControlExposeHeaders: [],
}));
```
