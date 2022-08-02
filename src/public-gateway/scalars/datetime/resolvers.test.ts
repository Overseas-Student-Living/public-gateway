import { resolvers } from "./resolvers";

const resolver = resolvers.Datetime;

describe("parseLiteral datetime", () => {
  test("can resolve date", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-01-01",
      },
      {}
    );
    expect(result).toEqual("2017-01-01T00:00:00+00:00");
  });

  test("can resolve summertime date", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31",
      },
      {}
    );
    expect(result).toEqual("2017-08-31T00:00:00+00:00");
  });

  test("can resolve simple datetime", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31 23:59:59",
      },
      {}
    );
    expect(result).toEqual("2017-08-31T23:59:59+00:00");
  });

  test("can resolve simple datetime with T", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31T23:59:59",
      },
      {}
    );
    expect(result).toEqual("2017-08-31T23:59:59+00:00");
  });

  test("can resolve full datetime", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31T23:59:59+00:00",
      },
      {}
    );
    expect(result).toEqual("2017-08-31T23:59:59+00:00");
  });

  test("can resolve full datetime with timezone", () => {
    const result = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31T23:59:59+22:00",
      },
      {}
    );
    expect(result).toEqual("2017-08-31T01:59:59+00:00");
  });
});

describe("serialize datetime", () => {
  test("can serialize from date", () => {
    const value = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31",
      },
      {}
    );
    const result = resolver.serialize(value);
    expect(result).toEqual("2017-08-31T00:00:00+00:00");
  });

  test("can serialize from full datetime", () => {
    const value = resolver.parseLiteral(
      {
        kind: "StringValue",
        value: "2017-08-31T23:59:59+22:00",
      },
      {}
    );
    const result = resolver.serialize(value);
    expect(result).toEqual("2017-08-31T01:59:59+00:00");
  });
});

describe("parseValue datetime", () => {
  test("can parseValue from date", () => {
    const result = resolver.parseValue("2017-08-31");
    expect(result).toEqual("2017-08-31T00:00:00+00:00");
  });

  test("can parseValue from full datetime", () => {
    const result = resolver.parseValue("2017-08-31T23:59:59+22:00");
    expect(result).toEqual("2017-08-31T01:59:59+00:00");
  });
});
