import chai, { expect } from "chai";
import { describe, it } from "mocha";
import chaiJsonSchema from "chai-json-schema";
import {
  Post,
  PostUser,
  User,
  postSchemaArray,
  postSchemaObject,
  userSchemaArray,
  userSchemaObject,
} from "./default-spec";
import {
  postDataArray,
  postDataObject,
  userDataArray,
  userDataObject,
} from "./mock-data-spec";
import { DB, Repository } from "../src/lib";
import { OP } from "../src/lib/core/Operator";

chai.use(chaiJsonSchema);

describe("Testing Repository", function () {
  /* ##################################################### */

  it(`Repository: Start to test Schema 
    - Drop Table : new User().drop()
    - Create Table
    - Sync Schema
    - Sync Index
    - Sync Fk
  `, async function () {
    await new DB("user_post_counts")
      .drop({ force: true, view: true })
      .catch((err) => {
        return false;
      });

    const dropPostUser = await new PostUser()
      .drop({ force: true })
      .catch((err) => {
        return false;
      });

    expect(dropPostUser).to.be.equal(true);

    const dropPost = await new Post().drop({ force: true }).catch((err) => {
      return false;
    });

    expect(dropPost).to.be.equal(true);

    const dropUser = await new User().drop({ force: true }).catch((err) => {
      return false;
    });

    expect(dropUser).to.be.equal(true);

    await new User()
      .sync({
        force: true,
        changed: true,
        foreign: true,
        index: true,
      })
      .catch((err) => console.log(err));

    await new Post()
      .sync({
        force: true,
        changed: true,
        foreign: true,
        index: true,
      })
      .catch((err) => console.log(err));

    await new PostUser()
      .sync({
        force: true,
        changed: true,
        foreign: true,
        index: true,
      })
      .catch((err) => console.log(err));
  });

  it(`Repository: Start to mock up the data in table 'users' for testing CRUD
    - Repo   : const userRepo = Repository(User);
    - Create : Repository(User).create({data: userDataObject })
    - Select : new User().first()
    - CreateMultiple : Repository(User).createMultiple({ data: userDataArray })
    - Update : Repository(User).update({where: { id: 6 }, data: { name: "was update"} })
    - Delete : Repository(User).delete({where: {id: 6} })
  `, async function () {
    const userRepo = Repository(User);

    const created = await Repository(User).create({ data: userDataObject });
    expect(created).to.be.an("object");
    expect(created).to.be.jsonSchema(userSchemaObject);

    const selectd = await Repository(User).first();
    expect(selectd).to.be.an("object");
    expect(selectd).to.be.jsonSchema(userSchemaObject);

    const createds = await Repository(User).createMultiple({
      data: userDataArray,
    });

    expect(createds).to.be.an("array");
    expect(createds).to.be.jsonSchema(userSchemaArray);

    const updated = await Repository(User).update({
      where: { id: 6 },
      data: { name: "was update" },
    });

    expect(updated).to.be.an("object");
    expect(updated).to.be.jsonSchema(userSchemaObject);
    expect(updated.name).to.be.equal("was update");

    const deleted = await Repository(User).delete({ where: { id: 6 } });
    expect(deleted).to.be.an("boolean");
    expect(deleted).to.be.equal(true);
  });

  it(`Repository: Start to mock up the data in table 'posts' for testing CRUD
    - Repo   : const Repository(Post) = Repository(Post);
    - Create : Repository(Post).create({ data: postDataObject })
    - Select : Repository(Post).first()
    - CreateMultiple : Repository(Post).createMultiple({ data: postDataArray })
    - Update : Repository(Post).update({where: { id: 6 }, data: { title: "was update"} })
    - Delete : Repository(Post).delete({where: {id: 6} })
  `, async function () {
    const created = await Repository(Post).create({ data: postDataObject });
    expect(created).to.be.an("object");
    expect(created).to.be.jsonSchema(postSchemaObject);

    const selectd = await Repository(Post).first();
    expect(selectd).to.be.an("object");
    expect(selectd).to.be.jsonSchema(postSchemaObject);

    const createds = await Repository(Post).createMultiple({
      data: postDataArray,
    });
    expect(createds).to.be.an("array");
    expect(createds).to.be.jsonSchema(postSchemaArray);

    const updated = await Repository(Post).update({
      where: { id: 6 },
      data: { title: "was update" },
    });

    expect(updated).to.be.an("object");
    expect(updated).to.be.jsonSchema(postSchemaObject);
    expect(updated.title).to.be.equal("was update");

    const deleted = await Repository(Post).delete({ where: { id: 6 } });
    expect(deleted).to.be.an("boolean");
    expect(deleted).to.be.equal(true);
  });

  it(`Repository: Start to mock up the data in table 'postUser' for testing CRUD
    - CreateMultiple : Repository(Post)sitory(User).createMultiple({ data: [1, 2, 3, 4, 5].map((v) => ({ user_id: v, post_id: v }))})
  `, async function () {
    const createds = await Repository(PostUser).createMultiple({
      data: [1, 2, 3, 4, 5].map((v) => ({ user_id: v, post_id: v })),
    });

    expect(createds).to.be.an("array");
  });

  it(`Repository: User using all where conditions
    - where 
    - whereObject
    - whereIn
    - whereNotIn
    - whereBetween
    - whereNotBetween
    - whereNull
    - whereNotNull
    - whereSubQuery
    - whereNotSubQuery
    - whereQuery
  `, async function () {
    const whereEq = await Repository(User).first({
      where: { id: 1 },
    });
    expect(whereEq).to.be.an("object");
    expect(whereEq).to.be.jsonSchema(userSchemaObject);
    expect(whereEq?.id).to.be.equal(1);

    const whereNotEq = await Repository(User).get({
      where: { id: OP.notEq(1) },
    });
    expect(whereNotEq).to.be.an("array");
    expect(whereNotEq).to.be.jsonSchema(userSchemaArray);
    expect(whereNotEq.every((v) => v?.id !== 1)).to.be.equal(true);

    const whereMoreThanOne = await Repository(User).get({
      where: { id: OP.more(1) },
    });

    expect(whereMoreThanOne).to.be.an("array");
    expect(whereMoreThanOne).to.be.jsonSchema(userSchemaArray);
    expect(whereMoreThanOne.every((v) => v?.id > 1)).to.be.equal(true);

    const whereLessThanOne = await Repository(User).get({
      where: { id: OP.less(1) },
    });
    expect(whereLessThanOne).to.be.an("array");
    expect(whereLessThanOne).to.be.jsonSchema(userSchemaArray);
    expect(whereLessThanOne.every((v) => v?.id < 1)).to.be.equal(true);

    const whereIn = await Repository(User).get({
      where: { id: OP.in([2, 3, 4, 5]) },
    });
    expect(whereIn).to.be.an("array");
    expect(whereIn).to.be.jsonSchema(userSchemaArray);
    expect(whereIn.every((v) => [2, 3, 4, 5].includes(v.id))).to.be.equal(true);

    const whereSubQuery = await Repository(User).get({
      where: { id: OP.subQuery(new User().select("id").whereIn("id", [7, 8])) },
    });

    expect(whereSubQuery).to.be.an("array");
    expect(whereSubQuery).to.be.jsonSchema(userSchemaArray);
    expect(whereSubQuery.every((v, i) => [7, 8].includes(v.id))).to.be.equal(
      true
    );
  });

  it(`Repository : 1:1 'user' hasOne 'post' ?`, async function () {
    const result = await Repository(User).first({
      relations: {
        post: true,
      },
    });

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(userSchemaObject);
    expect(result).to.have.property("post");
    expect(result?.post).to.be.jsonSchema(postSchemaObject);

    const results = await Repository(User).get({
      relations: {
        post: true,
      },
    });
    expect(results).to.be.jsonSchema(userSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("post");
      if (result?.post == null) continue;
      expect(result?.post).to.be.jsonSchema(postSchemaObject);
    }

    const pagination = await Repository(User).paginate({
      relations: {
        post: true,
      },
    });

    expect(pagination.meta).to.be.an("object");
    expect(pagination.meta).to.have.property("total");
    expect(pagination.meta).to.have.property("limit");
    expect(pagination.meta).to.have.property("count");
    expect(pagination.meta).to.have.property("current_page");
    expect(pagination.meta).to.have.property("last_page");
    expect(pagination.meta).to.have.property("next_page");
    expect(pagination.meta).to.have.property("prev_page");

    expect(pagination.data).to.be.jsonSchema(userSchemaArray);

    for (const result of pagination.data) {
      expect(result).to.have.property("post");
      if (result?.post == null) continue;
      expect(result?.post).to.be.jsonSchema(postSchemaObject);
    }
  });

  it(`Repository : 1:M 'user' hasMany 'posts' ?`, async function () {
    const result = await Repository(User).first({
      relations: {
        posts: true,
      },
    });

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(userSchemaObject);
    expect(result).to.have.property("posts");
    expect(result?.posts).to.be.an("array");
    expect(result?.posts).to.be.jsonSchema(postSchemaArray);

    const results = await Repository(User).get({
      relations: {
        posts: true,
      },
    });

    expect(results).to.be.an("array");
    expect(results).to.be.jsonSchema(userSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("posts");
      expect(result?.posts).to.be.an("array");
      expect(result?.posts).to.be.jsonSchema(postSchemaArray);
      for (const post of result?.posts ?? []) {
        expect(post).to.be.jsonSchema(postSchemaObject);
      }
    }

    const pagination = await Repository(User).paginate({
      relations: {
        posts: true,
      },
    });

    expect(pagination.meta).to.be.an("object");
    expect(pagination.meta).to.have.property("total");
    expect(pagination.meta).to.have.property("limit");
    expect(pagination.meta).to.have.property("count");
    expect(pagination.meta).to.have.property("current_page");
    expect(pagination.meta).to.have.property("last_page");
    expect(pagination.meta).to.have.property("next_page");
    expect(pagination.meta).to.have.property("prev_page");

    expect(pagination.data).to.be.an("array");
    expect(pagination.data).to.be.jsonSchema(userSchemaArray);

    for (const result of pagination.data) {
      expect(result).to.have.property("posts");
      expect(result?.posts).to.be.an("array");
      expect(result?.posts).to.be.jsonSchema(postSchemaArray);

      for (const post of result?.posts ?? []) {
        expect(post).to.be.jsonSchema(postSchemaObject);
      }
    }
  });

  it(`Repository : 1:1 'post' belongsTo 'user'   ?`, async function () {
    const result = await Repository(Post).first({
      relations: {
        user: true,
      },
    });

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(postSchemaObject);
    expect(result).to.have.property("user");
    expect(result?.user).to.be.an("object");
    expect(result?.user).to.be.jsonSchema(userSchemaObject);

    const results = await Repository(Post).get({
      relations: {
        user: true,
      },
    });

    expect(results).to.be.an("array");
    expect(results).to.be.jsonSchema(postSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("user");
      if (result.user_id == null && result.user == null) continue;
      expect(result.user).to.be.an("object");
      expect(result.user).to.be.jsonSchema(userSchemaObject);
    }

    const pagination = await Repository(Post).paginate({
      relations: {
        user: true,
      },
    });

    expect(pagination.meta).to.be.an("object");
    expect(pagination.meta).to.have.property("total");
    expect(pagination.meta).to.have.property("limit");
    expect(pagination.meta).to.have.property("count");
    expect(pagination.meta).to.have.property("current_page");
    expect(pagination.meta).to.have.property("last_page");
    expect(pagination.meta).to.have.property("next_page");
    expect(pagination.meta).to.have.property("prev_page");

    expect(pagination.data).to.be.an("array");
    expect(pagination.data).to.be.jsonSchema(postSchemaArray);

    for (const result of pagination.data) {
      expect(result).to.have.property("user");
      if (result.user_id == null && result.user == null) continue;
      expect(result.user).to.be.an("object");
      expect(result.user).to.be.jsonSchema(userSchemaObject);
    }
  });

  it(`Repository : M:M 'posts' belongsToMany 'users' ?`, async function () {
    const result = await Repository(Post).first({
      relations: {
        subscribers: true,
      },
    });

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(postSchemaObject);
    expect(result).to.have.property("subscribers");
    expect(result?.subscribers).to.be.an("array");
    expect(result?.subscribers).to.be.jsonSchema(userSchemaArray);

    const results = await Repository(Post).get({
      relations: {
        subscribers: true,
      },
    });

    expect(results).to.be.an("array");
    expect(results).to.be.jsonSchema(postSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("subscribers");
      expect(result.subscribers).to.be.an("array");
      expect(result.subscribers).to.be.jsonSchema(userSchemaArray);
    }

    const pagination = await Repository(Post).paginate({
      relations: {
        subscribers: true,
      },
    });

    expect(pagination.meta).to.be.an("object");
    expect(pagination.meta).to.have.property("total");
    expect(pagination.meta).to.have.property("limit");
    expect(pagination.meta).to.have.property("count");
    expect(pagination.meta).to.have.property("current_page");
    expect(pagination.meta).to.have.property("last_page");
    expect(pagination.meta).to.have.property("next_page");
    expect(pagination.meta).to.have.property("prev_page");

    expect(pagination.data).to.be.an("array");
    expect(pagination.data).to.be.jsonSchema(postSchemaArray);

    for (const result of pagination.data) {
      expect(result).to.have.property("subscribers");
      expect(result.subscribers).to.be.an("array");
      expect(result.subscribers).to.be.jsonSchema(userSchemaArray);

      for (const subscriber of result.subscribers) {
        expect(subscriber).to.be.an("object");
        expect(subscriber).to.be.jsonSchema(userSchemaObject);
      }
    }
  });

  it(`Repository : nested 'users' hasMany 'posts' 'posts' belongsTo 'users' ?`, async function () {
    const result = await Repository(User).first({
      relations: {
        posts: {
          relations: {
            user: {
              relations: {
                post: true,
              },
            },
          },
        },
      },
    });

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(userSchemaObject);
    expect(result).to.have.property("posts");
    expect(result?.posts).to.be.an("array");
    expect(result?.posts).to.be.jsonSchema(postSchemaArray);

    for (const post of result?.posts ?? []) {
      expect(post).to.have.property("user");
      expect(post.user).to.be.an("object");
      expect(post.user).to.be.jsonSchema(userSchemaObject);

      expect(post.user.post).to.be.an("object");
      expect(post.user.post).to.be.jsonSchema(postSchemaObject);
    }
  });

  it(`Repository : withExists and withNotExists 'users' hasMany 'posts' ?`, async function () {
    const exists = await Repository(User).first({
      relationsExists: {
        posts: true,
      },
      where: {
        posts: {
          id: 999,
        },
      },
    });

    expect(exists).to.be.equal(null);

    const notExists = await Repository(User).first({
      model: (query) => query.withNotExists("posts"),
      where: {
        posts: {
          id: 999,
        },
      },
    });

    expect(notExists).to.be.not.equal(null);
  });

  it(`Repository : withCount 'users' and 'subscribers' ?`, async function () {
    await Repository(User).deleteMany({
      where: {
        id: OP.moreOrEq(1),
      },
    });

    await Repository(Post).deleteMany({
      where: {
        id: OP.moreOrEq(1),
      },
    });

    await Repository(User).createMultiple({
      data: userDataArray,
    });

    const usersWithoutPosts = await Repository(User).get({
      model: (query) => query.withCount("posts"),
    });

    for (const user of usersWithoutPosts) {
      expect(user?.posts).to.be.equal(0);

      await Repository(Post).createMultiple({
        data: postDataArray.map((v) => ({ ...v, user_id: user.id })),
      });

      const posts = await Repository(Post).get({
        where: {
          user_id: user.id,
        },
      });

      for (const post of posts) {
        await Repository(PostUser).create({
          data: {
            user_id: user.id,
            post_id: post.id,
          },
        });
      }
    }

    const users = await Repository(User).get({
      model: (query) => query.withCount("posts"),
    });

    for (const user of users) {
      expect(user?.posts).to.be.equal(5);
    }

    const posts = await Repository(Post).get({
      model: (query) => query.withCount("subscribers"),
    });

    for (const post of posts) {
      expect(post?.subscribers).to.be.not.equal(5);
    }
  });

  /* ###################################################### */
});
