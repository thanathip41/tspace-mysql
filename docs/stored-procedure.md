# Stored Procedure
StoredProcedure is a predefined set of SQL statements stored in the database that you can call (execute) by name.
```js
import {  StoredProcedure } from 'tspace-mysql'

type T = {
  AddUser: {
      params: {
          name : string;
          email: string;
      } | [string,string];
      result: {
          fieldCount: number;
          affectedRows: number;
          insertId: number;
          info: string;
          serverStatus: number;
          warningStatus: number;
          changedRows: number;
      }
  };
    GetUser: {
      params: [number];
      result: any[]
  },
  GetUsers: {
      params: [];
      result: any[]
  }
};

class MyStoreProcedure extends StoredProcedure<T> {
  protected boot(): void {

    this.createProcedure({
      name: 'AddUser',
      expression: `
          CREATE PROCEDURE AddUser(IN name VARCHAR(255), IN email VARCHAR(255))
          BEGIN
            INSERT INTO users (name, email) VALUES (name, email);
          END;
      `,
      synchronize: true
    });

    this.createProcedure({
      name: 'GetUsers',
      expression: `
          CREATE PROCEDURE GetUsers()
          BEGIN
            SELECT * FROM users LIMIT 5;
          END;
      `,
      synchronize: true
    });

    this.createProcedure({
      name: 'GetUser',
      expression: `
          CREATE PROCEDURE GetUser(IN userId INT)
          BEGIN
            SELECT * FROM users WHERE id = userId LIMIT 1;
          END;
      `,
      synchronize: true
    })
  }
}

const storeProcedure = new MyStoreProcedure()

storeProcedure.call('AddUser', { name : 'tspace-mysql' , email : 'tspace-mysql@example.com'})
.then(r => console.log(r))
.catch(e => console.log(e))

storeProcedure.call('GetUser',[1])
.then(r => console.log(r))
.catch(e => console.log(e))

storeProcedure.call('GetUsers',[])
.then(r => console.log(r))
.catch(e => console.log(e))

```

<div class="page-nav-cards">
  <a href="#/view" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> View </div>
  </a>

  <a href="#/blueprint" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Blueprint </div>
  </a>
</div>