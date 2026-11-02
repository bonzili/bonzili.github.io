CREATE TABLE IF NOT EXISTS progress (
  account TEXT NOT NULL,
  device TEXT NOT NULL,
  envelope TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (account, device)
);
