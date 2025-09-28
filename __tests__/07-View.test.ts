import chai, { expect } from "chai";
import { describe, it } from "mocha";
import chaiJsonSchema from "chai-json-schema";
import { View } from "../src/lib";

chai.use(chaiJsonSchema);

describe("Testing View", function () {
  /* ##################################################### */

  it(`View: Start to create view 'user_post_count' for testing fetching data`, async function () {
    class UserPostCount extends View {
      protected boot(): void {
        this.createView({
          synchronize: true,
          expression: `
            SELECT 
            ROW_NUMBER() OVER (ORDER BY users.id) AS id, 
            users.id AS user_id, users.name, users.email, 
            COUNT(posts.id) AS post_count 
            FROM users 
            LEFT JOIN posts ON users.id = posts.user_id 
            GROUP BY users.id, users.name
          `,
        });
      }
    }

    const userPostCountView = await new UserPostCount().get();

    expect(userPostCountView).to.be.an("array");
    expect(userPostCountView).to.be.jsonSchema({
      type: "array",
      items: {
        type: "object",
        required: ["id", "user_id", "name", "post_count"],
        properties: {
          id: { type: "number" },
          user_id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          post_count: { type: "integer" },
        },
      },
    });
  });
  /* ###################################################### */
});
