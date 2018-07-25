import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = '';
const DEFAULT_HPP = '5';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;

// ES5
// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; }
//   }
// }
//
// ES6
// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

// ES6 Class Component
class App extends Component {
  _isMounted = false;
  // The constructor instantiates the class with all its properties.
  // The business logic of class methods should be defined outside
  // of the constructor and then bound to the constructor.
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    }

    // Binds class method to class constructor
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  };

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    // You can evaluate each item in the list based on a filter condition.
    // If the evaluation for an item is true, the item stays in the list.
    // Otherwise it will be filtered from the list.
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {...results, [searchKey]: { hits: updatedHits, page }}
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  async fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    try {
      const result = await axios.get(`${url}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`);
      this._isMounted && this.setSearchTopStories(result.data, false);
    } catch (error) {
      this._isMounted && this.setState({
        error,
        isLoading: false
      });
    }
  }

  setSearchTopStories(result, isLoading) {
    // get the hits and page from the result
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    // check if there are already old hits
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    // merge old and new hits together
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    // set the merged hits and page in the local component state
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page, isLoading }
      }
    });
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    // Destructure local state object
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <h2 className="App">Hacker News</h2>
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { error
          ? <div className="interactions">
            <p>Something went wrong.</p>
          </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

// Functional Stateless Component
// The best practice is to use ES6 destructuring in the
// function signature to destructure the props.
const Search = ({ value, onChange, onSubmit, children }) =>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        // Forces this to be a controlled component
        // The unidirectional data flow loop for the input field is self-contained now.
        // The internal component state is the single source of truth for the input field.
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>

// Functional Stateless Component
// Enforce only to have props as input and JSX as output
const Table = ({ list, onDismiss }) =>
  <div className="table">
    {/* You can remove the block body, meaning the curly braces, of the ES6 arrow function.
        In a concise body, an implicit return is attached.

        list and searchTerm can now be used without this.state because it has been destructured.
    */}
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

// Functional Stateless Component
const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default App;

export {
  Button,
  Search,
  Table
};
