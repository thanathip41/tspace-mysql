"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Model = function (model, npm) {
    return "import { Model } from '".concat(npm, "'\nclass ").concat(model, " extends Model {\n  constructor(){\n    super()\n    this.useTimestamp()\n  }\n}\nexport { ").concat(model, " }\nexport default ").concat(model, "\n");
};
exports.default = Model;
