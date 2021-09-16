import React, { Component } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";
export default class NewBlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      title: "",
      cover: "https://source.unsplash.com/random",
      readTime: { value: 1, unit: "minutes" },
      author: { name: "Ian", avatar: "https://source.unsplash.com/random?1" },
      content: "This is created on frontEnd and saved in backend",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ ...this.state, content: value });
  }

  sendPost = async (e) => {
    const url = "http://localhost:3003/blogPosts/";
    e.preventDefault();
    try {
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(this.state),
        headers: {
          "Content-type": "application/json",
        },
      });
      let data = response.json();
      if (response.ok) {
        console.log("Successfuly posted!");
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5" onSubmit={this.sendPost}>
          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              size="lg"
              placeholder="Title"
              value={this.state.title}
              onChange={(e) =>
                this.setState({ ...this.state, title: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              size="lg"
              as="select"
              onChange={(e) =>
                this.setState({ ...this.state, category: e.target.value })
              }
            >
              <option>Category1</option>
              <option>Category2</option>
              <option>Category3</option>
              <option>Category4</option>
              <option>Category5</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="blog-content" className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <ReactQuill
              onChange={this.handleChange}
              className="new-blog-content"
              value={this.state.content}
              // onChange={(e) =>
              //   this.setState({ ...this.state, category: e.target.value})
              // }
            />
          </Form.Group>
          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="dark"
              style={{ marginLeft: "1em" }}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
