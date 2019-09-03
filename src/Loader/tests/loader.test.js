import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Loader from '../Loader';

describe('<Loader />', () => {
  afterEach(cleanup);

  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    render(<Loader />);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(<Loader />);
    expect(firstChild).toMatchSnapshot();
  });
});
