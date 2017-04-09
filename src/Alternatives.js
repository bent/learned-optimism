import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  FormControl,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel,
  Pager
} from "react-bootstrap";

import lowerCaseFirstLetter from "./lowerCaseFirstLetter";
import disputationPropTypes from "./disputationPropTypes";
import List from "./List";
import PagerLink from "./PagerLink";

const Presentation = ({ belief, ...props }) => {
  const beliefId = belief[".key"];

  return (
    <div>
      <Form onSubmit={props.handleSubmit}>
        <ControlLabel>
          What alternatives are there to&nbsp;
          {lowerCaseFirstLetter(belief.description)}?
        </ControlLabel>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Alternative"
              value={props.alternativeDescription}
              onChange={props.handleChange}
            />
            <InputGroup.Button>
              <Button type="submit" disabled={props.isSaving}>
                Add
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Form>
      <List value={props.alternatives} remove={props.remove} />
      <Pager>
        <PagerLink
          to={`/beliefs/${beliefId}/evidence`}
          previous
          text="Evidence"
        />
        <PagerLink
          to={`/beliefs/${beliefId}/implications`}
          text="Implications"
        />
      </Pager>
    </div>
  );
};

export default React.createClass({
  mixins: [ReactFireMixin],
  propTypes: disputationPropTypes,
  getInitialState() {
    return {
      alternativeDescription: ""
    };
  },
  componentDidMount() {
    this.bindAsArray(
      this.props.beliefRef.child("alternatives"),
      "alternatives"
    );
  },
  render() {
    const { state } = this;

    return (
      <Presentation
        belief={this.props.belief}
        handleSubmit={this.handleSubmit}
        alternativeDescription={state.alternativeDescription}
        handleChange={this.handleChange}
        isSaving={state.isSaving}
        alternatives={state.alternatives}
        remove={this.remove}
      />
    );
  },
  handleChange(e) {
    e.preventDefault();
    this.setState({ alternativeDescription: e.target.value });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSaving: true });

    this.firebaseRefs.alternatives
      .push({
        description: this.state.alternativeDescription
      })
      .then(() => {
        this.setState({ alternativeDescription: "", isSaving: false });
      });
  },
  remove(id) {
    this.firebaseRefs.alternatives.child(id).remove();
  }
});
