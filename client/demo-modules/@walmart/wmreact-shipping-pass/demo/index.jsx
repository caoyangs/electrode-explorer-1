import React, { PropTypes, Component } from "react";
import Playground from "component-playground";
import assign from "object-assign";

import * as libraryScope from "../src/index";

export default class Index extends Component {
  render() {
    const localScope = assign({ React }, this.props.scope || {}, libraryScope);
    return (
      <div className="component-documentation">
        {Index.Components.map((component, index) => (
          <div key={index}>
            <h3 id={component.title}>{component.title}</h3>
            {component.examples.map((example, subindex) => (
              <div key={subindex}>
                {example.title ? <h4>{example.title}</h4> : null}
                <Playground codeText={example.code}
                  scope={localScope}
                  noRender={example.noRender}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}


Index.propTypes = {
  scope: PropTypes.object
};

Index.Components = [
  {
    title: "Shipping Pass Flyout",
    examples: [
      {
        title: "Shipping Pass Flyout",
        type: "playground",
        code: require("raw!./examples/shipping-pass-flyout.example"),
        noRender: true
      }
    ]
  },
  {
    title: "Shipping Pass",
    examples: [
      {
        title: "Shipping Pass",
        type: "playground",
        code: require("raw!./examples/shipping-pass-tile.example"),
        noRender: true
      }
    ]
  }
];