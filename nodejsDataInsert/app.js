const { ClickHouse } = require('clickhouse');
const prompt = require('prompt-sync')();
const clickhouse = new ClickHouse(
  {
    url: 'http://localhost',
    port: 8123,
    debug: false,
    basicAuth: null,
  },
);

function to2(i) {
  return ('0' + i).slice(-2);
}

function dateGen(date) {
  const y = date.getFullYear();
  const m = to2(date.getMonth() + 1);
  const d = to2(date.getDay());
  const h = to2(date.getHours());
  const i = to2(date.getMinutes());
  const s = to2(date.getSeconds());

  return `${y}-${m}-${d} ${h}:${i}:${s}`;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const probeId = prompt('Probe id:');
const nbBulk = prompt('Nombre de bulk:');
const nbInsert = prompt('Nombre d\'insert id:');


/*
INSERT INTO default.rawData_cluster
(insert, datetime_value, probe_id, value) VALUES
('1977-04-22T01:00:00', '2021-06-11 13:46:00', 1, rand()),
 */
(async ()=> {
  let date = new Date();
  for (let j = 0; j < nbBulk; j++) {
    const values = [];
    for (let i = 0; i < nbInsert; i++) {
      const dateValue = dateGen(date);
      const value = getRandomInt(10000);
      const input = `('1977-04-22T01:00:00', '${dateValue}', ${probeId}, ${value})`;
      values.push(input);
      date = new Date(date.getTime() + 1000);
    }
    const query = `
    INSERT INTO default.rawData_cluster
      (insert, datetime_value, probe_id, value) VALUES
      ${values.join(',')}
      ;`;

      const r = await clickhouse.query(query).toPromise();
      console.log(query, r);
  }
})();
