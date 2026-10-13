import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.js';

// Serialize requests against the single-process state cache. Commit to SQL
// before returning success so SQL failures cannot acknowledge unsaved changes.
let queue: Promise<void> = Promise.resolve();
export async function persistApi(req: Request, res: Response, next: NextFunction) {
  let release!: () => void;
  const previous = queue;
  queue = new Promise<void>(resolve => { release = resolve; });
  await previous;
  if (res.destroyed) { release(); return; }
  let released = false;
  let committing = false;
  const finish = () => { if (!released) { released = true; release(); } };
  res.once('finish', finish);
  res.once('close', () => { if (!committing) finish(); });
  const sendJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    committing = true;
    void db.flush().then(() => { if (!res.destroyed) sendJson(body); }).catch(error => {
      console.error('SQL persistence failed:', error);
      res.status(503);
      if (!res.destroyed) sendJson({ success: false, message: 'Không thể lưu dữ liệu SQL. Vui lòng thử lại.' });
    }).finally(() => { committing = false; if (res.destroyed) finish(); });
    return res;
  }) as Response['json'];
  next();
}
