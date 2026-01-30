CREATE INDEX idx_tasks_pagination
ON tasks(created_at DESC, id DESC);
