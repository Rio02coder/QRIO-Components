import { UNIT_NAMES, unitMap } from "../Units/UnitMap";

export const unitConverter = (
  quantity: number,
  sourceUnit: UNIT_NAMES,
  targetUnit: UNIT_NAMES
) => {
  const targetToStandardDistance = unitMap.get(targetUnit) as number;
  const sourceToTargetDistance = unitMap.get(sourceUnit) as number;
  return quantity * sourceToTargetDistance * targetToStandardDistance;
};
