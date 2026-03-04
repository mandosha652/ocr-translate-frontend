/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "No circular dependencies allowed",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Files that are not imported by any other file (except entry points)",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(?:ts|tsx)$",
          "\\.d\\.ts$",
          "(^|/)tsconfig\\.json$",
          "src/app/.*/page\\.tsx$",
          "src/app/.*/layout\\.tsx$",
          "src/app/.*/loading\\.tsx$",
          "src/app/.*/error\\.tsx$",
          "src/app/.*/not-found\\.tsx$",
          "src/app/.*/route\\.ts$",
          "src/app/.*/opengraph-image\\.tsx$",
          "src/instrumentation.*\\.ts$",
          "src/proxy\\.ts$",
        ],
      },
      to: {},
    },
    {
      name: "no-dev-deps-in-src",
      severity: "error",
      comment: "No devDependencies in production source code",
      from: {
        path: "^src",
      },
      to: {
        dependencyTypes: ["npm-dev"],
        pathNot: [
          "node_modules/@types/",
          "node_modules/@tanstack/react-query-devtools",
        ],
      },
    },
    {
      name: "no-duplicate-dep-types",
      severity: "warn",
      comment: "Dependency listed in both dependencies and devDependencies",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types", "typings"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",
      },
    },
  },
};
