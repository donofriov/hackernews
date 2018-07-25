import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table } from './App';

// • Always begin with a shallow test
// • If componentDidMount() or componentDidUpdate() should be tested, use mount()
// • If you want to test component lifecycle and children behavior, use mount()
// • If you want to test a component’s children rendering with less overhead than mount() and you
//   are not interested in lifecycle methods, use render()
Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Search
        onChange={() => 'I was changed'}
        onSubmit={() => 'I was submitted'}
      >
        Search
      </Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search
        onChange={() => 'I was changed'}
        onSubmit={() => 'I was submitted'}
      >
        Search
      </Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button onClick={() => 'I was clicked'}>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button onClick={() => 'I was clicked'}>Give Me More</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


  it('simulates click events', () => {
    const mockCallBack = jest.fn();
    const element = shallow(
      <Button onClick={mockCallBack}>More</Button>
    );

    element.find('button').simulate('click');

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});

describe('Table', () => {
  const props = {
    onDismiss: () => 'I was clicked',
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table { ...props } />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows two items in list', () => {
    const element = shallow(
      <Table { ...props } />
    )

    expect(element.find('.table-row').length).toBe(2);
  });
});
