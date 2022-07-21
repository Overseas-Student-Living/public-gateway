import { resolvers } from "./resolvers";

const resolver = resolvers.Positive;

describe("resolvers Positive", () => {
  describe("parseValue Positive", () => {
    test("can parseValue from parseLiteral", () => {
      const result = resolver.parseValue(1);
      expect(result).toEqual(1);
    });

    test("will throw error if value is not positive", () => {
      expect(() => {
        resolver.parseValue(0);
      }).toThrow("invalid format, should be Positive number");
    });
  });

  describe("parseLiteral Positive", () => {
    test("can parseLiteral Positive", () => {
      const result = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "1"
        },
        {}
      );
      expect(result).toEqual("1");
    });

    test("will throw error if value is not positive", () => {
      expect(() => {
        resolver.parseLiteral(
          {
            kind: "StringValue",
            value: "0"
          },
          {}
        );
      }).toThrow("invalid format, should be Positive number");
    });
  });

  describe("serialize Positive", () => {
    test("can serialize from Positive", () => {
      const value = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "1"
        },
        {}
      );
      const result = resolver.serialize(value);
      expect(result).toEqual("1");
    });
  });
});
