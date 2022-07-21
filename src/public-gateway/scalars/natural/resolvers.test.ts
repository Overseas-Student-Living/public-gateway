import { resolvers } from "./resolvers";

const resolver = resolvers.NaturalNumber;

describe("resolvers NaturalNumber", () => {
  describe("parseValue NaturalNumber", () => {
    test("can parseValue from parseLiteral", () => {
      const result = resolver.parseValue(1);
      expect(result).toEqual(1);
    });

    test("will throw error if value is not natural number", () => {
      expect(() => {
        resolver.parseValue(-1);
      }).toThrow("invalid format, should be natural number");
    });
  });

  describe("parseLiteral NaturalNumber", () => {
    test("can parseLiteral natural number", () => {
      const result = resolver.parseLiteral(
        {
          kind: "StringValue",
          value: "1"
        },
        {}
      );
      expect(result).toEqual("1");
    });

    test("will throw error if value is not natural number", () => {
      expect(() => {
        resolver.parseLiteral(
          {
            kind: "StringValue",
            value: "-1"
          },
          {}
        );
      }).toThrow("invalid format, should be natural number");
    });
  });

  describe("serialize NaturalNumber", () => {
    test("can serialize from natural number", () => {
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
