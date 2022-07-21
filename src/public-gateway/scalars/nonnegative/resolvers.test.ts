import { resolvers } from "./resolvers";

const resolver = resolvers.NonNegative;

describe("resolvers NonNegative", () => {
  describe("parseValue NonNegative", () => {
    test("can parseValue from parseLiteral", () => {
      const result = resolver.parseValue(1);
      expect(result).toEqual(1);
    });

    test("will throw error if value is not positive", () => {
      expect(() => {
        resolver.parseValue(-1);
      }).toThrow("invalid format, should be NonNegative number");
    });
  });

  describe("parseLiteral NonNegative", () => {
    test("can parseLiteral NonNegative", () => {
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
            value: "-1"
          },
          {}
        );
      }).toThrow("invalid format, should be NonNegative number");
    });
  });

  describe("serialize NonNegative", () => {
    test("can serialize from NonNegative", () => {
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
