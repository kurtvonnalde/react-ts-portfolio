import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App routes', () => {
  it('renders the CV page on /cv route', () => {
    render(
      <MemoryRouter initialEntries={['/cv']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('PROFILE')).toBeInTheDocument();
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
  });
});
