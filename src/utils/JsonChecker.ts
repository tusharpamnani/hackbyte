export const validateJsonStructure = (jsonArray) => {
  if (!Array.isArray(jsonArray)) {
    return { valid: false, error: "Invalid JSON: Expected an array." };
  }

  const requiredKeys = {
    Project_id: "number",
    batch: "number",
    title: "string",
    description: "string",
    level: "string",
    learningObjectives: "object", // Expecting an array
  };

  for (let i = 0; i < jsonArray.length; i++) {
    const item = jsonArray[i];

    for (const requiredKey in requiredKeys) {
      if (!item.hasOwnProperty(requiredKey)) {
        return { valid: false, error: `Missing key: ${requiredKey} in project at index ${i}` };
      }

      if (requiredKey === "learningObjectives" && !Array.isArray(item[requiredKey])) {
        return { valid: false, error: `Invalid type for key: ${requiredKey} in project at index ${i}. Expected an array.` };
      }

      if (requiredKey !== "learningObjectives" && typeof item[requiredKey] !== requiredKeys[requiredKey]) {
        return {
          valid: false,
          error: `Type mismatch for key: ${requiredKey} in project at index ${i}. Expected ${requiredKeys[requiredKey]}, found ${typeof item[requiredKey]}`,
        };
      }
    }
  }

  return { valid: true };
};
