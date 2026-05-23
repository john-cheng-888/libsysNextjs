// src/lib/requestCounter.ts
// PostgreSQL atomic counter — safe across restarts + multi-instance
// C# equivalent: Interlocked.Increment() but persistent
import  db from '@/lib/db';
export type CounterKey='total'|'unauthorized'|'auth_ok';
export async function incrementCounter(key:CounterKey):Promise<void> {
    //v0.5
    // await db("request_stats")
    // .where({key})
    // .increment('count',1)
    // .update({update_at:db.fn.now()});

    //v1.0 也可以寫作---如果你想多個欄位一起變更的話
    await db("request_stats").where({key})
    .update(
        {
            count:  db.raw('count +1 '),
            updated_at:  db.fn.now()
        }
    );
    //相當於....        
    // UPDATE request_stats 
    //   SET count = count + 1, updated_at = NOW()
    //   WHERE key = 'total'    
    //這比先 increase 再 設定update_at比較有完整性,故採用之.
}
export async function getStats():Promise<Record<string,number>> {
     const rows=await db('request_stats').select('key','count');
     return Object.fromEntries(
        rows.map((r)=>[r.key,Number(r.count)])
     );
/**
 * c#
 var stats = rows.ToDictionary(
  r => r.Key,           // key selector
  r => (int)r.Count     // value selector
);
// stats["total"]        = 150
// stats["unauthorized"] = 12
// stats["auth_ok"]      = 138
 
// Record<string, number> is a single object, with multiple KEY-VALUE pairs.

//by in js ...
// rows from DB — array of row objects:
const rows = [
  { key: 'total',        count: 150 },
  { key: 'unauthorized', count: 12  },
  { key: 'auth_ok',      count: 138 }
]

// .map() converts each row to [key, value] pair:
rows.map(r => [r.key, Number(r.count)])
// → [
//     ['total',        150],
//     ['unauthorized', 12 ],
//     ['auth_ok',      138]
//   ]

// Object.fromEntries() converts pairs to object:
Object.fromEntries([...])
// → { total: 150, unauthorized: 12, auth_ok: 138 }
//   ↑ this is Record<string, number>
 */
//由於js不像c#的ToDictionary遇到key duplicate會throws exception
//最嚴謹的寫法可以用以下方式
/*
const stats = rows.reduce((acc, r) => {
  if (acc[r.key] !== undefined) {
    logger.warn('DUPLICATE_KEY_DETECTED', { key: r.key })
  }
  acc[r.key] = Number(r.count)
  return acc
}, {} as Record<string, number>)
// "DB should be fine, but let me log if not"
 */
}