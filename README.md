## Cors plgin for @candy/framework

## Usage

```typescript
import Hook from '@candy/framework/core/Hook.ts';
import Cors from '@candy/plugin-cors';

Hook.use(Cors());
Hook.use(async (_req: Request, hook: Hook) => {
    console.log('hook2 run');
    return await hook.next();
});
```
