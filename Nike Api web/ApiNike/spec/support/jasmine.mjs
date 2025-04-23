import 'ts-node/register';

export default {
  spec_dir: "src", // Cambiado de "spec" a "src"
  spec_files: [
    "**/*.spec.ts" // Cambiado para buscar en todos los subdirectorios de "src"
  ],
  helpers: [
    "helpers/**/*.?(m)js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
};
