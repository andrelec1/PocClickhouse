-- # create table on each slave...
CREATE TABLE default.rawData
(
    EventDateTime  DateTime default now(),
    insert         String,
    uuid           String default generateUUIDv4(),
    datetime_value DateTime,
    probe_id       Int32,
    value          Float64
)
ENGINE = ReplacingMergeTree()
        PARTITION BY (probe_id)
        ORDER BY (datetime_value, probe_id)
        PRIMARY KEY (datetime_value, probe_id);

OPTIMIZE TABLE default.rawData FINAL;

-- # Create distributed table on master
CREATE TABLE IF NOT EXISTS default.rawData_cluster
(
    EventDateTime  DateTime default now(),
    insert         String,
    uuid           String default generateUUIDv4(),
    datetime_value DateTime,
    probe_id       Int32,
    value          Float64
)
ENGINE = Distributed(time_cluster, default, rawData, rand());