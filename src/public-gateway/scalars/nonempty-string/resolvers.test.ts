import { resolvers } from "./resolvers";

const resolver = resolvers.NonEmptyString;

describe("resolvers NonEmptyString", () => {
  describe("parseValue NonEmptyString", () => {
    test("can parseValue from parseLiteral", () => {
      const result = resolver.parseValue("NonEmptyString");
      expect(result).toEqual("NonEmptyString");
    });

    test("will throw error if value is empty-string", () => {
      expect(() => {
        resolver.parseValue(" ");
      }).toThrow("cannot be an empty string");
    });
  });

  describe("parseLiteral NonEmptyString", () => {
    test("can parseLiteral NonEmptyString", () => {
      const result = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "NonEmptyString",
        },
        {}
      );
      expect(result).toEqual("NonEmptyString");
    });

    test("will throw error if value is empty-string", () => {
      expect(() => {
        resolver.parseLiteral(
          {
            kind: "StringValue",
            value: " ",
          },
          {}
        );
      }).toThrow("cannot be an empty string");
    });
  });

  describe("serialize NonEmptyString", () => {
    test("can serialize from NonEmptyString", () => {
      const value = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "NonEmptyString",
        },
        {}
      );
      const result = resolver.serialize(value);
      expect(result).toEqual("NonEmptyString");
    });
  });
});
