import * as React from 'react';
import { render } from '@testing-library/react';

import { AddLinkModal } from '..';

describe('<AddLinkModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<AddLinkModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
