# SocialCops challenge

Video demo: [Demo](https://www.youtube.com/watch?v=gmotMKO_5ig)

Currently, the synchronization has been done between two machines.

To set up locally:

Use virtual box or any other hypervisor and install any distribution on it. Preferably, any linux distribution.

- Clone the repo.
- cd socialcops-challenge
- npm install
- npm install -g knex
- Install MySQL
- create a database named `socialcops`
- Run: `knex migrate:latest`
- Run: `node app.js`

Set up environment variables as defined in `.env.default`.

Create/change any file in the data/ directory(set to "data/ by default"), on the other machine, execute:

`node sync.js`

The directories will be synced.
