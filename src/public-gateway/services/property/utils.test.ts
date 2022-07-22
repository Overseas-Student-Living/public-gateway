import { groupFacilities } from "./utils";

describe("test group facilities", () => {
  test("can group facilities as expected", () => {
    const facilities = [
      { slug: "facility 1", tags: ["amenity"] },
      { slug: "facility 2", tags: ["bills"] },
      { slug: "facility 3", tags: ["security"] },
      { slug: "facility 4", tags: ["rule"] },
      { slug: "facility 5", tags: [] },
      { slug: "facility 6", tags: null }
    ];
    const expected_result = {
      features: [{ slug: "facility 1", tags: ["amenity"] }],
      bills: [{ slug: "facility 2", tags: ["bills"] }],
      securityAndSafety: [{ slug: "facility 3", tags: ["security"] }],
      propertyRules: [{ slug: "facility 4", tags: ["rule"] }]
    };
    const res = groupFacilities(facilities);
    expect(res).toEqual(expected_result);
  });

  test("will ignore empty facilities", () => {
    const facilities = [];
    const res = groupFacilities(facilities);
    expect(res).toBeUndefined();
  });

  test("will ignore undefined facilities", () => {
    const facilities = undefined;
    const res = groupFacilities(facilities);
    expect(res).toBeUndefined();
  });

  test("will ignore null facilities", () => {
    const facilities = null;
    const res = groupFacilities(facilities);
    expect(res).toBeUndefined();
  });
});
