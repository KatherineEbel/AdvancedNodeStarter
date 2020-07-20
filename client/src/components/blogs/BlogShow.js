import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage() {
    const { imageURL } = this.props.blog
    return imageURL && <img height="268" width="400" src={`https://ke-blog-bucket.s3.amazonaws.com/${imageURL}`} alt="blog" />
  }
  
  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    // https://ke-blog-bucket.s3.amazonaws.com/5f143b0ff6bb1e86d5320000/3d0f62d0-ca7e-11ea-bbe2-1fa0fdc223de.jpeg
    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        { this.renderImage() }
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
