const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: '192.168.5.1',
  database: 'test',
  password: 'raspberry',
  port: 5432
});

pool.query("CREATE TABLE IF NOT EXISTS people2 (\
                id SERIAL,\
                name varchar(15) NOT NULL,\
                company varchar(15) NOT NULL,\
                PRIMARY KEY (id)\
            )", (error, result) => {
                if(error) {
                    console.log(error);
                }
            });

getAllPeople = () => { return new Promise(function(resolve, reject) {
    pool.query("SELECT * FROM people2", (error, result) => {
        if(error) {
            reject(error);
        }
        else {
            resolve(result.rows);
        }
    }
)}); 
}

module.exports = {
    getAllPeople
}
