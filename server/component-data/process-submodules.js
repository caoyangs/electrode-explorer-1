"use strict";

const Path = require("path");
const Fs = require("fs");
const Babel = require("babel-core");
const traverse = require("babel-traverse").default;
const UpdateSearchIndex = require("./update-search-index");

const ProcessSubModules = (moduleName, github, server, keywords) => {
  const subModules = [];

  const demoFile = Path.join(__dirname, `../../node_modules/${moduleName}/demo/demo.jsx`);
  const orgFile = Path.join(__dirname, "../data/orgs.json");

  const parts = github.split("/");
  const moduleOrg = parts[3];
  const moduleRepo = parts[4];

  Babel.transformFile(demoFile, { presets: ["es2015", "react"] }, (err, result) => {
    if (err) {
      console.log("error processing submodules for ", moduleName);
      return console.log(err);
    }

    const visitor = {
      enter(path) {
        if (path.node.key && path.node.key.name === "title") {
          subModules.push(path.node.value.value);
        }
      }
    };

    traverse(result.ast, visitor);

    UpdateSearchIndex(`${moduleOrg}/${moduleRepo}`, subModules, server, keywords);

    if (subModules.length < 3) {
      // Denotes no actual submodules
      return;
    }

    try {
      const orgs = require(orgFile);

      orgs.allOrgs[moduleOrg].repos[moduleRepo].submodules =
        subModules.filter((sm,i)=>i);

      Fs.writeFile(orgFile, JSON.stringify(orgs), (err) => {
        if (err) {
          console.error("Could not add submodules to orgs file");
          console.log(err);
        }

        console.log(`Wrote submodules for ${moduleOrg}/${moduleRepo}`);
      });

    } catch (err) {
      console.error("Could not parse orgs.json");
      console.log(err);
    }

  });

};

module.exports = ProcessSubModules;
