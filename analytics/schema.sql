CREATE TABLE IF NOT EXISTS visits (
  visit_id TEXT NOT NULL,
  day TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(visit_id,day)
);
CREATE INDEX IF NOT EXISTS visits_by_day ON visits(day);
