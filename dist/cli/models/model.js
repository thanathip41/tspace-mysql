"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Model = function (model, npm) {
    return "import { Model } from '" + npm + "'\nclass " + model + " extends Model {\n  constructor(){\n    super()\n    this.useTimestamp()\n  }\n}\nexport { " + model + " }\nexport default " + model + "\n";
};
exports.default = Model;
