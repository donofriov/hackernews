import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

// ES5
// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; }
//   }
// }
//
// ES6
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

// ES6 Class Component
  class App extends Component {
  // The constructor instantiates the class with all its properties.
  // The business logic of class methods should be defined outside
  // of the constructor and then bound to the constructor.
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    }

    // Binds class method to class constructor
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  };

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    // You can evaluate each item in the list based on a filter condition.
    // If the evaluation for an item is true, the item stays in the list.
    // Otherwise it will be filtered from the list.
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    // Destructure local state object
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <h2 className="App">Hacker News</h2>
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

// Functional Stateless Component
// The best practice is to use ES6 destructuring in the
// function signature to destructure the props.
const Search = ({ value, onChange, children }) =>
    <form>
      {children} <input
        type="text"
        // Forces this to be a controlled component
        // The unidirectional data flow loop for the input field is self-contained now.
        // The internal component state is the single source of truth for the input field.
        value={value}
        onChange={onChange}
      />
    </form>

// Functional Stateless Component
// Enforce only to have props as input and JSX as output
const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {/* You can remove the block body, meaning the curly braces, of the ES6 arrow function.
        In a concise body, an implicit return is attached.

        list and searchTerm can now be used without this.state because it has been destructured.
    */}
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
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
const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;
