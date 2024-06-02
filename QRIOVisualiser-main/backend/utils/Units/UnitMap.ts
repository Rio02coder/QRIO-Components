export const enum UNIT_NAMES {
  millisecond = "ms",
  microsecond = "μ",
  second = "s",
}

export const STANDARD_UNIT = UNIT_NAMES.microsecond;

export const unitMap: Map<UNIT_NAMES, number> = new Map<UNIT_NAMES, number>();

unitMap.set(UNIT_NAMES.millisecond, 1000);
unitMap.set(UNIT_NAMES.second, 1000000);
unitMap.set(UNIT_NAMES.microsecond, 1);
