import knex from 'knex'
const db=knex(
{
    client:'pg',
    connection:process.env.DATABASE_URL,
    //debug is very important in dev mode.
    debug:true,
    pool:{
        min:2
        ,max:10
    }
}
);
export default db;