import React from "react";
import { Presentation } from "../Adversities";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<Presentation />).toJSON();
  expect(tree).toMatchSnapshot();
});
