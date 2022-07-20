import { resolvers } from "./resolvers";

const resolver = resolvers.PositiveInteger;

describe("resolvers PositiveInteger", () => {
  describe("parseValue PositiveInteger", () => {
    test("can parseValue from parseLiteral", () => {
      const result = resolver.parseValue(1);
      expect(result).toEqual(1);
    });

    test("will throw error if value is not PositiveInteger", () => {
      expect(() => {
        resolver.parseValue(0);
      }).toThrow("invalid format, should be positive integer");
    });
  });

  describe("parseLiteral PositiveInteger", () => {
    test("can parseLiteral PositiveInteger", () => {
      const result = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "1"
        },
        {}
      );
      expect(result).toEqual("1");
    });

    test("will throw error if value is not positive integer", () => {
      expect(() => {
        resolver.parseLiteral(
          {
            kind: "StringValue",
            value: "0"
          },
          {}
        );
      }).toThrow("invalid format, should be positive integer");
    });
  });

  describe("serialize PositiveInteger", () => {
    test("can serialize from PositiveInteger", () => {
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
