
# Repository
```js
Repository is a mechanism that encapsulates all database operations related to a specific model. 
It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.

** The Repository check always type Type Safety if model is used the type of schema 

```
## Select Statements
```js
import { Repository, OP , type T } from 'tspace-mysql'
import { User } from '../Models/User'

const userRepository = Repository(User)
const needPhone = true
const user = await userRepository.findOne({
  select : {
    id : true,
    name : true,
    username : true,
    phone : {
      id : true,
      name : true,
      user_id : true,
    }
  },
  where : {
    id: 1
  },
  when : {
    condition : needPhone,
    query: () => ({
      relations : {
        phone : true
        /** 
         You can also specify the phone with any methods of the repository
        phone : {
          where : {
            id : 41
          },
          select : {
            id : true,
            user_id : true
          }
        }
        */
      }
    })
  }
})

const users = await userRepository.findMany({
  select : {
    id : true,
    name : true,
    username : true,
  },
  limit : 3,
  orderBy : {
    id : 'ASC',
    name : 'DESC'
  }
  groupBy : ['id'],
  where : {
    id: OP.in([1,2,3])
  }
})

const userPaginate = await userRepository.pagination({
  select : {
    id : true,
    name : true,
    username : true,
  },
  page : 1,
  limit : 3,
  where : {
    id:  OP.in([1,2,3])
  }
})

const findFullName = await userRepository.findOne({
  select : {
    name : true,
    [`${DB.raw('CONCAT(firstName," ",lastName) as fullName')}`]: true
  }
  whereRaw : [
    `CONCAT(firstName," ",lastName) LIKE '%${search}%'`
  ]
})
```
## Insert Statements
```js

const userRepository = Repository(User)

const created = await userRepository.create({
  data : {
    name : "repository-name",
    // ....
  }
})

const createdMultiple = await u.createMultiple({
  data : [
    {
      name: "tspace4",
      // ....
    },
    {
      name: "tspace5",
      // ....
    },
    {
      name: "tspace6",
      // ....
    }
    // ....
  ]
})

const createdNotExists = await userRepository.createNotExists({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})

const createdOrSelected = await userRepository.createOrSelect({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})


```
## Update Statements
```js

const userRepository = Repository(User)

const updated = await userRepository.update({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})

```
## Delete Statements
```js

const userRepository = Repository(User)

const deleted = await userRepository.delete({
  where : {
    id : 1
  }
})

```

## Transactions

```js
import { DB , Repository } from 'tspace-mysql'
import { User } from '../Models/User'
const userRepository = Repository(User)

const transaction = await DB.beginTransaction()

try {
  await transaction.startTransaction()

  const created = await userRepository.create({
    data : {
      name : "repository-name",
      // ....
    },
    transaction // add this for the transaction
  })

  const updated = await userRepository.update({
    data : {
      name : "repository-name",
      // ....
    },
    where : {
      id : created.id
    },
    transaction
  })

  // after your use commit if use same transction for actions this transction will auto commit
  await transaction.commit()

  // ensure the nothing with transction just use end of transction
  await transaction.end();

} catch (err) {

  await transaction.rollback()
}

```

## Relations
```js
import { Repository , OP } from 'tspace-mysql'
import { User } from '../Models/User'
import { Phone } from '../Models/Phone'

const userRepository = Repository(User)

const userHasPhones = await userRepository.findOne({
  select : {
    id : true,
    name : true,
    username : true,
    phone : {
      id : true,
      user_id : true,
      name: true
    }
  },
  where : {
    id: 1
  },
  relations: {
    phone: {
      user : true
    }
  }
});

const phoneRepository = Repository(Phone)

const phoneBelongUser = await phoneRepository.findOne({
  select : '*',
  where : {
    id: 1
  },
  relations : {
    user : true
  }
})

```

<div class="page-nav-cards">
  <a href="#/repository" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> Repository </div>
  </a>

  <a href="#/view" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title"> View </div>
  </a>
</div>