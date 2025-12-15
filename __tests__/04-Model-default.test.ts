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
  postDataArray,
  postDataObject,
  userDataArray,
  userDataObject,
} from "./specs/default-spec";

import { 
  PostUser as PostUserCamelCase
}  from "./specs/camel-spec";

import { DB } from "../src/lib";

chai.use(chaiJsonSchema);

describe("Testing Model Default Pattern", function () {
  /* ##################################################### */

  it(`Model: Start to test Schema 
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
    
    await new PostUserCamelCase()
    .drop({ force: true })
    .catch((err) => {
      return false;
    });

    const dropPostUser = await new PostUser()
    .drop({ force: true })
    .catch((err) => {
      console.log(err)
      return false;
    });

    const dropPost = await new Post()
    .drop({ force: true })
    .catch((err) => {
      console.log(err)
      return false;
    });

    const dropUser = await new User()
    .drop({ force: true })
    .catch((err) => {
      console.log(err)
      return false;
    });

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

    expect(dropPostUser).to.be.equal(true);
    expect(dropPost).to.be.equal(true);
    expect(dropUser).to.be.equal(true);
  });

  it(`Model: Start to mock up the data in table 'users' for testing CRUD
    - Create : new User().create(userDataObject).save()
    - Select : new User().first()
    - CreateMultiple : new User().createMultiple(userDataArray).save()
    - Update : new User().where('id',6).update({ name : 'was update'}).save()
    - Delete : new User().where('id',6).delete()
  `, async function () {

    const created = await new User().create(userDataObject).save();
    expect(created).to.be.an("object");
    expect(created).to.be.jsonSchema(userSchemaObject);

    const selectd = await new User().first();
    expect(selectd).to.be.an("object");
    expect(selectd).to.be.jsonSchema(userSchemaObject);

    const createds = await new User().createMultiple(userDataArray).save();
    expect(createds).to.be.an("array");
    expect(createds).to.be.jsonSchema(userSchemaArray);

    const updated = (await new User()
      .where("id", 6)
      .update({ name: "was update" })
      .save()) as Record<string, any>;
    expect(updated).to.be.an("object");
    expect(updated).to.be.jsonSchema(userSchemaObject);
    expect(updated.name).to.be.equal("was update");

    const deleted = await new User().where("id", 6).delete();
    expect(deleted).to.be.an("boolean");
    expect(deleted).to.be.equal(true);
  });

  it(`Model: Start to mock up the data in table 'posts' for testing CRUD
    - Create : new Post().create(postDataObject).save()
    - Select : new Post().first()
    - CreateMultiple : new Post().createMultiple(postDataArray).save()
    - Update : new Post().where('id',6).update({ title : 'was update'}).save()
    - Delete : new Post().where('id',6).delete()
  `, async function () {
    const created = await new Post().create(postDataObject).save();
    expect(created).to.be.an("object");
    expect(created).to.be.jsonSchema(postSchemaObject);

    const selectd = await new Post().first();
    expect(selectd).to.be.an("object");
    expect(selectd).to.be.jsonSchema(postSchemaObject);

    const createds = await new Post().createMultiple(postDataArray).save();
    expect(createds).to.be.an("array");
    expect(createds).to.be.jsonSchema(postSchemaArray);

    const updated = (await new Post().where("id", 6).update({ title: "was update" }).save()) as Record<string,any>
    expect(updated).to.be.an("object");
    expect(updated).to.be.jsonSchema(postSchemaObject);
    expect(updated.title).to.be.equal("was update");

    const deleted = await new Post().where("id", 6).delete();
    expect(deleted).to.be.an("boolean");
    expect(deleted).to.be.equal(true);

    const deletedDisabledSoftDelete = await new Post().where("id", 6).disableSoftDelete().delete();
    expect(deletedDisabledSoftDelete).to.be.an("boolean");
    expect(deletedDisabledSoftDelete).to.be.equal(true);

    const forecDeleted = await new Post().where("id", 9999).forceDelete();
    expect(forecDeleted).to.be.an("boolean");
    expect(forecDeleted).to.be.equal(false);
  });

  it(`Model: Start to mock up the data in table 'postUser' for testing CRUD
    - CreateMultiple : new PostUser().createMultiple([]).save()
  `, async function () {
    const createds = await new PostUser()
      .createMultiple([1, 2, 3, 4, 5].map((v) => ({ user_id: v, post_id: v })))
      .save();

    expect(createds).to.be.an("array");
  });

  it(`Model: User using all where conditions
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
    const whereEq = await new User().where("id", 1).first();
    expect(whereEq).to.be.an("object");
    expect(whereEq).to.be.jsonSchema(userSchemaObject);
    expect(whereEq?.id).to.be.equal(1);

    const whereNotEq = await new User().where("id", "<>", 1).get();
    expect(whereNotEq).to.be.an("array");
    expect(whereNotEq).to.be.jsonSchema(userSchemaArray);
    expect(whereNotEq.every((v) => v?.id !== 1)).to.be.equal(true);

    const whereMoreThanOne = await new User().where("id", ">", 1).get();
    expect(whereMoreThanOne).to.be.an("array");
    expect(whereMoreThanOne).to.be.jsonSchema(userSchemaArray);
    expect(whereMoreThanOne.every((v) => v?.id > 1)).to.be.equal(true);

    const whereLessThanOne = await new User().where("id", "<", 1).get();
    expect(whereLessThanOne).to.be.an("array");
    expect(whereLessThanOne).to.be.jsonSchema(userSchemaArray);
    expect(whereLessThanOne.every((v) => v?.id < 1)).to.be.equal(true);

    const whereUsingObject = await new User().where({ id: 1 }).first();
    expect(whereUsingObject).to.be.an("object");
    expect(whereUsingObject).to.be.jsonSchema(userSchemaObject);
    expect(whereUsingObject?.id).to.be.equal(1);

    const whereObject = await new User().whereObject({ id: 1 }).first();
    expect(whereObject).to.be.an("object");
    expect(whereObject).to.be.jsonSchema(userSchemaObject);
    expect(whereObject?.id).to.be.equal(1);

    const whereIn = await new User().whereIn("id", [2, 3, 4, 5]).get();
    expect(whereIn).to.be.an("array");
    expect(whereIn).to.be.jsonSchema(userSchemaArray);
    expect(whereIn.every((v, i) => [2, 3, 4, 5].includes(v.id))).to.be.equal(
      true
    );
  });

  it(`Relation : 1:1 'user' hasOne 'post' ?`, async function () {
    const result = await new User().with("post").first();

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(userSchemaObject);
    expect(result).to.have.property("post");
    expect(result?.post).to.be.jsonSchema(postSchemaObject);

    const results = await new User().with("post").get();
    expect(results).to.be.jsonSchema(userSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("post");
      if (result?.post == null) continue;
      expect(result?.post).to.be.jsonSchema(postSchemaObject);
    }

    const pagination = await new User().with("post").pagination();

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

  it(`Relation : 1:M 'user' hasMany 'posts' ?`, async function () {
    const result = await new User().with("posts").first();

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(userSchemaObject);
    expect(result).to.have.property("posts");
    expect(result?.posts).to.be.an("array");
    expect(result?.posts).to.be.jsonSchema(postSchemaArray);

    const results = await new User().with("posts").get();

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

    const pagination = await new User().with("posts").pagination();

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

  it(`Relation : 1:1 'post' belongsTo 'user'   ?`, async function () {
    const result = await new Post().with("user").first();

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(postSchemaObject);
    expect(result).to.have.property("user");
    expect(result?.user).to.be.an("object");
    expect(result?.user).to.be.jsonSchema(userSchemaObject);

    const results = await new Post().with("user").get();

    expect(results).to.be.an("array");
    expect(results).to.be.jsonSchema(postSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("user");
      if (result.user_id == null && result.user == null) continue;
      expect(result.user).to.be.an("object");
      expect(result.user).to.be.jsonSchema(userSchemaObject);
    }

    const pagination = await new Post().with("user").pagination();

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

  it(`Relation : M:M 'posts' belongsToMany 'users' ?`, async function () {
    const result = await new Post().withExists("subscribers").first();

    expect(result).to.be.an("object");
    expect(result).to.be.jsonSchema(postSchemaObject);
    expect(result).to.have.property("subscribers");
    expect(result?.subscribers).to.be.an("array");
    expect(result?.subscribers).to.be.jsonSchema(userSchemaArray);

    const results = await new Post().with("subscribers").get();

    expect(results).to.be.an("array");
    expect(results).to.be.jsonSchema(postSchemaArray);

    for (const result of results) {
      expect(result).to.have.property("subscribers");
      expect(result.subscribers).to.be.an("array");
      expect(result.subscribers).to.be.jsonSchema(userSchemaArray);
    }

    const pagination = await new Post().with("subscribers").pagination();

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

  it(`Relation : nested 'users' hasMany 'posts' 'posts' belongsTo 'users' ?`, async function () {
    const result = await new User()
      .with("posts")
      .withQuery("posts", (query: Post) => {
        return query
          .with("user")
          .withQuery("user", (query: User) => query.with("post"));
      })
      .first();

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

  it(`Relation : withExists and withNotExists 'users' hasMany 'posts' ?`, async function () {
    const exists = await new User()
      .withExists("posts")
      .withQuery("posts", (query: Post) => {
        return query.where("id", 999);
      })
      .first();

    expect(exists).to.be.equal(null);

    const notExists = await new User()
      .withNotExists("posts")
      .withQuery("posts", (query: Post) => {
        return query.where("id", 999);
      })
      .first();

    expect(notExists).to.be.not.equal(null);
  });

  it(`Relation : withCount 'users' and 'subscribers' ?`, async function () {
    await new User().where("id", ">=", 1).deleteMany();
    await new Post().where("id", ">=", 1).deleteMany();

    await new User().createMultiple(userDataArray).save();

    const usersWithoutPosts = await new User().withCount("posts").get();

    for (const user of usersWithoutPosts) {
      expect(user?.posts).to.be.equal(0);

      await new Post()
        .createMultiple(postDataArray.map((v) => ({ ...v, user_id: user.id })))
        .save();

      const posts = await new Post().where("user_id", user.id).get();

      for (const post of posts) {
        await new PostUser()
          .create({
            user_id: user.id,
            post_id: post.id,
          })
          .save();
      }
    }

    const users = await new User().withCount("posts").get();

    for (const user of users) {
      expect(user?.posts).to.be.equal(5);
    }

    const posts = await new Post().withCount("subscribers").get();

    for (const post of posts) {
      expect(post?.subscribers).to.be.not.equal(5);
    }
  });

  /* ###################################################### */
});
