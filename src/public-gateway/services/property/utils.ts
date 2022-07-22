import { isEmpty } from "lodash";

export function groupFacilities(facilities) {
  const tagToCategory = {
    amenity: "features",
    bills: "bills",
    security: "securityAndSafety",
    rule: "propertyRules"
  };
  const result = {
    features: [],
    bills: [],
    securityAndSafety: [],
    propertyRules: []
  };
  if (!isEmpty(facilities)) {
    facilities.forEach(item => {
      if (item.tags && !isEmpty(item.tags)) {
        const category = tagToCategory[item.tags[0]];
        if (category) {
          result[category].push(item);
        }
      }
    });
    return result;
  }
}
