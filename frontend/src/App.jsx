import React from "react";
import "./CreateBlog.css";

function App() {
  return (
    <div>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#">
            My Blog
          </a>
          <nav>
            <a className="nav-link" href="#">
              Home
            </a>
            <a
              className="nav-link cta"
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Sample
            </a>
          </nav>
        </div>
      </header>

      <main className="create-blog" id="top">
        <div className="create-blog__inner">
          <h2 className="muted">CREATE A BLOG WEBSITE</h2>
          <h1 className="title">CREATE A BLOG WEBSITE</h1>

          <p className="lead">
            A blog website is one where users can put up their thoughts about
            anything and everything. You can make it as creative as you want to.
            There are thousands of blog websites out there. You can take
            inspiration from any of these blog websites and create your own.
            Here, people have to log in using their credentials and proper
            authentication will also be done. After that, the user can put up
            their blogs for the public and they should be stored in the database
            so that it remains there. Also, the functionality of editing a blog
            after posting it and deleting it from the post would be a cherry on
            the cake.
          </p>

          <h3 className="section-title">
            The knowledge that you will gain from this project:
          </h3>

          <p>
            The front-end of a blog website should be really impressive for the
            bloggers to be attracted to your website. So, a lot of hard work and
            learning will go into the front end. Also, all the blogs will be
            stored in the database and if the blogger edits it, changes should
            be reflected in the database too. So, handling the database and
            making an attractive front-end are the main learnings that one can
            get from this project. The GitHub Link for a sample Blog Website
            with its source code is given below. You can take inspiration from
            it and try to make your own attractive and amazing blog website.
          </p>

          <p>
            <a
              className="cta-button"
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Sample on GitHub
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
