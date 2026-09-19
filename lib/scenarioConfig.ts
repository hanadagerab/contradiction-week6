export const SCENARIO_CONFIG = {
  route: {
    startZ: 7,
    endZ: -14,
    speed: 0.04,
  },

  contradiction: {
    cueProgress: 0.28,
    commitmentThreshold: 0.48,
  },

  transfer: {
    commitmentThreshold: 0.48,

    variants: {
      "stronger-social-pressure": {
        cueProgress: 0.36,
        crowdSpeed: 1.05,
      },

      "clearer-retest": {
        cueProgress: 0.24,
        crowdSpeed: 0.72,
      },
    },
  },

  crowd: {
    speed: 0.75,
  },
} as const;
